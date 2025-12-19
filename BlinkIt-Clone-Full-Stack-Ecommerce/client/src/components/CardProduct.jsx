import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [loading, setLoading] = useState(false)

  return (
    <Link
      to={url}
      className='border border-gray-200 rounded-xl cursor-pointer bg-white shadow-sm hover:shadow-lg active:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden touch-manipulation'
    >
      {/* Image Container */}
      <div className='bg-slate-50 aspect-square w-full overflow-hidden relative'>
        {data.discount > 0 && (
          <div className='absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10'>
            {data.discount}% OFF
          </div>
        )}
        <img
          src={data.image[0]}
          alt={data.name}
          className='w-full h-full object-contain hover:scale-105 transition-transform duration-300 p-2'
        />
      </div>

      {/* Content Container */}
      <div className='p-2.5 flex flex-col gap-1.5 flex-1'>


        {/* Product Name */}
        <div className='font-semibold text-gray-900 text-xs line-clamp-2'>
          {data.name}
        </div>

        {/* Unit */}


        {/* Pricing Section */}
        <div className='flex items-center gap-1.5 mt-auto'>
          <div className='text-[10px] text-gray-500 font-medium'>
            {data.unit}
          </div>
          <div className='font-bold text-sm text-gray-900'>
            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
          </div>
          {Boolean(data.discount) && (
            <div className='text-[10px] text-gray-400 line-through'>
              {DisplayPriceInRupees(data.price)}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className='mt-1.5' onClick={(e) => e.preventDefault()}>
          {
            data.stock == 0 ? (
              <div className='w-full text-center text-red-600 text-[10px] font-bold bg-red-50 px-2 py-1.5 rounded-lg border border-red-200'>
                Out of Stock
              </div>
            ) : (
              <AddToCartButton data={data} />
            )
          }
        </div>
      </div>
    </Link>
  )
}

export default CardProduct