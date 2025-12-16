import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { motion } from "framer-motion"

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  console.log("order Items", orders)
  return (
    <div className='p-4'>
      <div className='bg-white shadow-sm p-4 rounded-xl mb-6 border border-gray-100'>
        <h1 className='font-extrabold text-2xl text-gray-800'>My Orders</h1>
      </div>
      {
        !orders[0] && (
          <div className="bg-white rounded-xl shadow-sm p-8 min-h-[50vh] flex flex-col items-center justify-center">
            <NoData />
            <p className='text-gray-500 mt-4 font-semibold'>No orders yet</p>
          </div>
        )
      }

      <div className="space-y-4">
        {
          orders.map((order, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={order._id + index + "order"}
                className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 justify-between items-start md:items-center'
              >
                <div className='flex flex-col gap-4 w-full'>
                  {order.product_details.map((product, pIndex) => (
                    <div key={product._id || pIndex} className='flex gap-4 items-center border-b last:border-0 pb-2 last:pb-0 border-gray-100'>
                      <div className='w-20 h-20 bg-gray-50 rounded-lg p-2 flex-shrink-0'>
                        <img
                          src={product.image && product.image[0] ? product.image[0] : ""}
                          className='w-full h-full object-contain mix-blend-multiply'
                          alt={product.name}
                        />
                      </div>
                      <div className='flex-1'>
                        <p className='font-bold text-gray-800 text-lg mb-1 line-clamp-1'>{product.name}</p>
                        <div className="flex gap-2 items-center">
                          {product.variant && <p className='text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>Variant: {product.variant.name}</p>}
                          <p className='text-sm text-gray-500'>Qty: {product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 text-right">
                    <p className='text-gray-600 text-sm font-medium'>Order ID: <span className='font-bold text-gray-800'>{order?.orderId}</span></p>
                    <p className='text-gray-600 text-sm font-medium'>Total: <span className='font-bold text-gray-800'>{Number(order?.totalAmt).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></p>
                  </div>
                </div>
              </motion.div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders
