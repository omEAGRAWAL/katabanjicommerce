import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import moment from "moment";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";

const AdminOrderControl = () => {
    const [allOrder, setAllOrder] = useState([]);
    const [openDetails, setOpenDetails] = useState(null);

    const fetchOrder = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getAllOrderItems
            });
            const { data: responseData } = response;
            if (responseData.success) {
                setAllOrder(responseData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    const handleUpdateStatus = async (order, type, value) => {
        try {
            const payload = {
                orderId: order.orderId,
                [type]: value
            }
            const response = await Axios({
                ...SummaryApi.updateOrderStatus,
                data: payload
            })
            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchOrder()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Management</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b bg-gray-100 font-semibold grid grid-cols-6 gap-4 text-sm text-gray-600">
                    <div>Order ID</div>
                    <div>Date</div>
                    <div>Customer</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Actions</div>
                </div>

                <div className="divide-y divide-gray-200">
                    {allOrder.map((order, index) => (
                        <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-6 gap-4 items-center text-sm">
                                <div className="font-medium text-blue-600 truncate" title={order.orderId}>{order.orderId}</div>
                                <div>{moment(order.createdAt).format('DD/MM/YYYY')}</div>
                                <div className="truncate" title={order.delivery_address?.name || "N/A"}>
                                    {order.delivery_address?.name || "N/A"}
                                </div>
                                <div className="font-semibold text-green-600">
                                    ₹{order.totalAmt}
                                </div>
                                <div>
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-xs px-2 py-1 rounded-full w-fit ${order.payment_status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            Pay: {order.payment_status || 'Pending'}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full w-fit ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            Order: {order.order_status || 'Processing'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => setOpenDetails(openDetails === index ? null : index)}
                                        className="text-blue-500 hover:text-blue-700 font-medium text-sm border border-blue-200 px-3 py-1 rounded hover:bg-blue-50"
                                    >
                                        {openDetails === index ? 'Hide' : 'View'}
                                    </button>
                                </div>
                            </div>

                            {/* Expandable Details */}
                            {openDetails === index && (
                                <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold mb-2 text-gray-700">Delivery Address</h4>
                                            <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                                                <p className="font-medium">{order.delivery_address?.name}</p>
                                                <p>{order.delivery_address?.address_line}</p>
                                                <p>{order.delivery_address?.city}, {order.delivery_address?.state} - {order.delivery_address?.pincode}</p>
                                                <p>Mobile: {order.delivery_address?.mobile}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2 text-gray-700">Update Status</h4>
                                            <div className="space-y-3 bg-white p-3 rounded border text-sm">
                                                <div className="flex items-center gap-3">
                                                    <label className="w-24 text-gray-600">Payment:</label>
                                                    <select
                                                        value={order.payment_status}
                                                        onChange={(e) => handleUpdateStatus(order, 'payment_status', e.target.value)}
                                                        className="border rounded p-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 hover:bg-white transition-colors"
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="CASH ON DELIVERY">Cash On Delivery</option>
                                                        <option value="PAID">Paid</option>
                                                        <option value="PENDING">Pending</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="w-24 text-gray-600">Order:</label>
                                                    <select
                                                        value={order.order_status}
                                                        onChange={(e) => handleUpdateStatus(order, 'order_status', e.target.value)}
                                                        className="border rounded p-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 hover:bg-white transition-colors"
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2 text-gray-700">Products</h4>
                                        <div className="grid gap-2">
                                            {
                                                order.product_details.image.map((img, idx) => {
                                                    return (
                                                        <div key={idx} className="flex gap-4 items-center bg-white p-2 rounded border">
                                                            <img src={img} alt="product" className="w-16 h-16 object-cover rounded" />
                                                            <div>
                                                                <p className="font-medium text-gray-800">{order.product_details.name}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {allOrder.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No orders found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrderControl;
