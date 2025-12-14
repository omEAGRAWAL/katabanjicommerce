import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;
    if (!userId || !list_items || !totalAmt || !addressId || !subTotalAmt) {
      return response.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const payload = list_items.map((el) => {
      let variantDetails = null;
      if (el.variantId) {
        variantDetails = el.productId.variants.find(v => v._id.toString() === el.variantId.toString());
      }
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
          variant: variantDetails ? {
            name: variantDetails.name,
            price: variantDetails.price
          } : null
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    ///remove from the cart
    const removeCartItems = await CartProductModel.deleteMany({
      userId: userId,
    });
    const updateInUser = await UserModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return response.json({
      message: "Order successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

export async function paymentController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const user = await UserModel.findById(userId);

    const line_items = list_items.map((item) => {
      let variantDetails = null;
      let price = item.productId.price;
      let discount = item.productId.discount;
      let name = item.productId.name;

      if (item.variantId) {
        const v = item.productId.variants.find(v => v._id.toString() === item.variantId.toString());
        if (v) {
          variantDetails = v;
          price = v.price;
          discount = v.discount;
          name = `${name} (${v.name})`;
        }
      }

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
              variantId: item.variantId || ""
            },
          },
          unit_amount:
            pricewithDiscount(price, discount) *
            100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return response.status(200).json(session);
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      let variantDetails = null;
      if (product.metadata.variantId) {
        variantDetails = {
          name: product.name.replace(/.*\((.*)\)/, '$1'), // Attempt to extract variant name from "Product (Variant)"
          // ideally we should probably fetch the product to get clean variant details, but saving what we sent to stripe is also fine.
          // For now, let's just store the name as is or try to be cleaner.
          // Actually, since we stored productId, we can fetch the product text if we wanted, 
          // but for now let's just use the metadata and name.
          // If we want to be precise, we need to fetch ProductModel here to get original Variant Data? 
          // Or just rely on what we sent.
          // The existing code re-fetches nothing, just uses Stripe data.
          // Let's stick to using Stripe data.
          // We sent "Name (Variant)" as name.
        }
      }

      const paylod = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
          variant: product.metadata.variantId ? {
            name: product.name, // Stripe product name has variant info
            price: item.amount_total / 100 / item.quantity // Calculated unit price
          } : null
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      };

      productList.push(paylod);
    }
  }

  return productList;
};

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
  const event = request.body;
  const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

  console.log("event", event);

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      const userId = session.metadata.userId;
      const orderProduct = await getOrderProductItems({
        lineItems: lineItems,
        userId: userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });

      const order = await OrderModel.insertMany(orderProduct);

      console.log(order);
      if (Boolean(order[0])) {
        const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
          shopping_cart: [],
        });
        const removeCartProductDB = await CartProductModel.deleteMany({
          userId: userId,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}

export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId; // order id

    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// get all order - admin
export async function getAllOrderDetailsController(request, response) {
  try {
    const orderlist = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .populate("delivery_address");
    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getOrderDetailsByIdController(request, response) {
  try {
    const { orderId } = request.params;
    const orderlist = await OrderModel.find({ userId: orderId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");
    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
//update order status by admin
export async function updateOrderStatusController(request, response) {
  try {
    const orderId = request.params.orderId || request.body.orderId;
    const { payment_status, order_status } = request.body;

    const payload = {}
    if (payment_status) {
      payload.payment_status = payment_status
    }
    if (order_status) {
      payload.order_status = order_status
    }

    const updateOrderStatus = await OrderModel.findOneAndUpdate(
      { orderId: orderId },
      payload,
      { new: true }
    );
    return response.json({
      message: "Order status updated",
      data: updateOrderStatus,
      error: false,

      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
