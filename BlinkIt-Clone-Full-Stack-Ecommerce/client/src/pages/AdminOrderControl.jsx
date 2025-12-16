import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import moment from "moment";
import toast from "react-hot-toast";
import { IoSearchOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const AdminOrderControl = () => {
    const [allOrder, setAllOrder] = useState([]);
    const [openDetails, setOpenDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

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

    // Filter and Search Logic
    const filteredOrders = allOrder.filter(order => {
        const matchesSearch =
            order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.delivery_address?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus ? order.order_status === filterStatus : true;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h2>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group">
                            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-80 transition-all"
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            <option value="">All Status</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="hidden md:grid grid-cols-6 gap-6 p-5 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        <div>Order ID</div>
                        <div>Date</div>
                        <div>Customer</div>
                        <div>Amount</div>
                        <div>Status</div>
                        <div className="text-center">Action</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => {
                                const isExpanded = openDetails === index;
                                return (
                                    <div key={order._id} className={`group transition-all duration-200 ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                        <div
                                            className="flex flex-col md:grid md:grid-cols-6 gap-3 md:gap-4 p-4 md:p-5 cursor-pointer"
                                            onClick={() => setOpenDetails(isExpanded ? null : index)}
                                        >
                                            {/* Row 1 Mobile: Order ID + Status */}
                                            <div className="flex justify-between items-start md:contents">
                                                <div className="font-mono font-medium text-blue-600 truncate group-hover:text-blue-700 md:col-span-1" title={order.orderId}>
                                                    #{order.orderId}
                                                </div>
                                                <div className="md:hidden">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                        ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                                order.order_status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.order_status || 'Processing'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Desktop Date Position / Mobile Row 3 */}
                                            <div className="text-gray-500 text-xs md:text-sm md:text-gray-600 md:col-span-1 order-3 md:order-none">
                                                {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                                            </div>

                                            {/* Row 2 Mobile: Name + Amount */}
                                            <div className="flex justify-between items-center md:contents order-2 md:order-none">
                                                <div className="font-medium text-gray-800 md:col-span-1 truncate" title={order.delivery_address?.name}>
                                                    {order.delivery_address?.name || "N/A"}
                                                </div>
                                                <div className="font-bold text-gray-900 md:col-span-1">
                                                    {Number(order.totalAmt).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                </div>
                                            </div>

                                            {/* Desktop Status Position */}
                                            <div className="hidden md:block md:col-span-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.order_status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                            order.order_status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                    {order.order_status || 'Processing'}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex justify-center md:col-span-1 order-4 md:order-none mt-2 md:mt-0">
                                                <button
                                                    className={`p-2 rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                                >
                                                    <FaAngleDown />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expandable Details */}
                                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 p-6 border-t border-gray-100' : 'grid-rows-[0fr] opacity-0 h-0 p-0 overflow-hidden'}`}>
                                            <div className="overflow-hidden">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                    {/* Column 1: Delivery Address */}
                                                    <div className="space-y-4">
                                                        <h4 className="flex items-center gap-2 font-semibold text-gray-900 border-b pb-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                            Delivery Address
                                                        </h4>
                                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm md:text-base leading-relaxed text-gray-600">
                                                            <p className="font-semibold text-gray-900 text-lg mb-1">{order.delivery_address?.name}</p>
                                                            <p>{order.delivery_address?.address_line}</p>
                                                            <p>{order.delivery_address?.city}, {order.delivery_address?.state} - {order.delivery_address?.pincode}</p>
                                                            <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-1">
                                                                <p className="flex justify-between">
                                                                    <span>Mobile:</span>
                                                                    <span className="font-medium text-gray-900">{order.delivery_address?.mobile}</span>
                                                                </p>
                                                                {order.delivery_address?.lat && order.delivery_address?.lon && (
                                                                    <a
                                                                        href={`https://www.google.com/maps?q=${order.delivery_address.lat},${order.delivery_address.lon}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium mt-1 inline-flex items-center gap-1"
                                                                    >
                                                                        View Location map
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Column 2: Order Controls */}
                                                    <div className="space-y-4">
                                                        <h4 className="flex items-center gap-2 font-semibold text-gray-900 border-b pb-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                            Order Status
                                                        </h4>
                                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Payment Status</label>
                                                                <select
                                                                    value={order.payment_status}
                                                                    onChange={(e) => handleUpdateStatus(order, 'payment_status', e.target.value)}
                                                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-white"
                                                                >
                                                                    <option value="">Select Status</option>
                                                                    <option value="CASH ON DELIVERY">Cash On Delivery</option>
                                                                    <option value="PAID">Paid</option>
                                                                    <option value="PENDING">Pending</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Order Status</label>
                                                                <select
                                                                    value={order.order_status}
                                                                    onChange={(e) => handleUpdateStatus(order, 'order_status', e.target.value)}
                                                                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                                                                >
                                                                    <option value="">Select Status</option>
                                                                    <option value="Processing">Processing</option>
                                                                    <option value="Shipped">Shipped</option>
                                                                    <option value="Delivered">Delivered</option>
                                                                    <option value="Cancelled">Cancelled</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Column 3: Products */}
                                                    <div className="space-y-4 lg:col-span-1">
                                                        <h4 className="flex items-center gap-2 font-semibold text-gray-900 border-b pb-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                                            Ordered Items
                                                        </h4>
                                                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                                            {order.product_details.map((product, idx) => (
                                                                <div key={idx} className="flex gap-4 items-start bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                                                                    <img
                                                                        src={product.image && product.image[0] ? product.image[0] : ""}
                                                                        alt="product"
                                                                        className="w-14 h-14 object-cover rounded-md border border-gray-200"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-gray-800 text-sm line-clamp-2" title={product.name}>
                                                                            {product.name}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            {product.variant && (
                                                                                <p className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                                                                                    {product.variant.name}
                                                                                </p>
                                                                            )}
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                Qty: {product.quantity}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                                <span className="text-6xl mb-4">🔍</span>
                                <p className="text-lg font-medium text-gray-600">No orders found</p>
                                <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderControl;
