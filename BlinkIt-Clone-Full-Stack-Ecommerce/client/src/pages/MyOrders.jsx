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
                <div className='flex gap-4 items-center'>
                  <div className='w-20 h-20 bg-gray-50 rounded-lg p-2 flex-shrink-0'>
                    <img
                      src={order.product_details.image[0]}
                      className='w-full h-full object-contain mix-blend-multiply'
                      alt={order.product_details.name}
                    />
                  </div>
                  <div>
                    <p className='font-bold text-gray-800 text-lg mb-1'>{order.product_details.name}</p>
                    <p className='text-gray-600 text-sm font-medium'>Order ID: <span className='font-bold text-gray-800'>{order?.orderId}</span></p>
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
