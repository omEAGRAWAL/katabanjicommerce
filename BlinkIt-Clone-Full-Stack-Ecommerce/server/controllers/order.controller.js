import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
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

    const address = await AddressModel.findById(addressId);

    const product_details = list_items.map((el) => {
      let variantDetails = null;
      if (el.variantId) {
        variantDetails = el.productId.variants.find(v => v._id.toString() === el.variantId.toString());
      }
      return {
        productId: el.productId._id,
        name: el.productId.name,
        image: el.productId.image,
        variant: variantDetails ? {
          name: variantDetails.name,
          price: variantDetails.price
        } : null,
        quantity: el.quantity,
        price: el.productId.price // Base price or variant price if handled elsewhere, but structure requests array
      };
    });

    const payload = {
      userId: userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      product_details: product_details,
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: address,
      subTotalAmt: subTotalAmt,
      totalAmt: totalAmt,
    };

    const generatedOrder = await OrderModel.create(payload);

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
  const product_details = [];
  const address = await AddressModel.findById(addressId);

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      product_details.push({
        productId: product.metadata.productId,
        name: product.name,
        image: product.images,
        variant: product.metadata.variantId ? {
          name: product.name,
          price: item.amount_total / 100 / item.quantity
        } : null,
        quantity: item.quantity,
        price: item.price.unit_amount / 100
      });
    }
  }

  const payload = {
    userId: userId,
    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
    product_details: product_details,
    paymentId: paymentId,
    payment_status: payment_status,
    delivery_address: address,
    subTotalAmt: Number(lineItems.data.reduce((acc, item) => acc + item.amount_total, 0) / 100),
    totalAmt: Number(lineItems.data.reduce((acc, item) => acc + item.amount_total, 0) / 100),
  };

  return [payload];
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
