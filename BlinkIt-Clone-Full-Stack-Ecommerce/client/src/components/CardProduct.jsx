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
    <Link to={url} className='border border-gray-100 py-3 p-3 grid gap-2 w-full rounded-xl cursor-pointer bg-white shadow-sm hover:shadow-premium-hover transition-shadow h-full' >
      <div className='bg-slate-50 min-h-28 w-full max-h-32 rounded-lg overflow-hidden flex items-center justify-center p-2'>
        <img
          src={data.image[0]}
          className='w-full h-full object-contain hover:scale-110 transition-transform duration-300'
        />
      </div>

      <div className='flex items-center justify-between gap-1'>
        <div className='rounded-md text-[10px] font-bold px-1.5 py-0.5 text-gray-700 bg-gray-100 flex items-center gap-1'>
          <span className='w-3 h-3 bg-gray-300 rounded-full flex items-center justify-center text-[8px]'>🕒</span> 12 mins
        </div>
      </div>

      <div className='font-semibold text-gray-800 text-sm line-clamp-2 leading-tight h-10'>
        {data.name}
      </div>

      <div className='text-xs text-gray-500'>
        {data.unit}
      </div>

      <div className='flex items-center justify-between gap-2 mt-1'>
        <div className='flex flex-col'>
          <div className='font-semibold text-sm text-gray-800'>
            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
          </div>
          {Boolean(data.discount) && (
            <p className='text-xs text-gray-400 line-through'>{DisplayPriceInRupees(data.price)}</p>
          )}
        </div>

        <div className=''>
          {
            data.stock == 0 ? (
              <p className='text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-md border border-red-100'>Out of stock</p>
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
