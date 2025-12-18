import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  const handleCashOnDelivery = async () => {
    try {
      if (addressList[selectAddress] === undefined) {
        toast.error("Please select address")
        return
      }
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) {
          fetchCartItem()
        }
        if (fetchOrder) {
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order"
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async () => {
    try {
      if (addressList[selectAddress] === undefined) {
        toast.error("Please select address")
        return
      }
      toast.loading("Loading...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      stripePromise.redirectToCheckout({ sessionId: responseData.id })

      if (fetchCartItem) {
        fetchCartItem()
      }
      if (fetchOrder) {
        fetchOrder()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='bg-gray-50 min-h-screen pb-24'>
      <div className='container mx-auto px-4 py-4 max-w-2xl'>

        {/** Address Section **/}
        <div className='mb-6'>
          <h3 className='text-lg font-bold text-gray-900 mb-3'>Delivery Address</h3>
          <div className='grid gap-3'>
            {
              addressList.map((address, index) => {
                const isSelected = selectAddress == index;
                return (
                  <label key={"address" + index} className='cursor-pointer group relative'>
                    <input
                      id={"address" + index}
                      type='radio'
                      value={index}
                      onChange={(e) => setSelectAddress(e.target.value)}
                      name='address'
                      checked={isSelected}
                      className='hidden'
                    />
                    <div className={`
                      border-2 rounded-xl p-4 flex gap-3 transition-all
                      ${isSelected ? 'border-primary-200 bg-green-50/50' : 'border-gray-200 bg-white hover:border-primary-100'}
                    `}>
                      <div className={`mt-0.5 ${isSelected ? 'text-primary-200' : 'text-gray-400'}`}>
                        {isSelected ? <MdRadioButtonChecked size={22} /> : <MdRadioButtonUnchecked size={22} />}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='font-bold text-gray-800 border bg-gray-100 px-2 py-0.5 rounded text-xs'>Home</span>
                          <span className='font-semibold text-gray-900'>{address.address_line}</span>
                        </div>
                        <p className='text-sm text-gray-600 leading-relaxed'>
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className='text-sm text-gray-600 font-medium mt-1'>
                          Mobile: {address.mobile}
                        </p>
                      </div>
                    </div>
                  </label>
                )
              })
            }
            <div onClick={() => setOpenAddress(true)} className='p-4 bg-white border-2 border-dashed border-primary-200 rounded-xl flex justify-center items-center cursor-pointer text-primary-200 font-bold hover:bg-green-50 transition-colors gap-2'>
              <span className='text-xl'>+</span> Add New Address
            </div>
          </div>
        </div>

        {/** Payment Section **/}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>Payment Method</h3>

          <div className='space-y-3'>
            {/* <button
              onClick={handleOnlinePayment}
              className='w-full border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
                  💳
                </div>
                <div className='text-left'>
                  <p className='font-bold text-gray-900'>Online Payment</p>
                  <p className='text-xs text-gray-500'>Cards, UPI, Netbanking</p>
                </div>
              </div>
            </button> */}

            <button
              onClick={handleCashOnDelivery}
              className='w-full border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group'
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
                  💵
                </div>
                <div className='text-left'>
                  <p className='font-bold text-gray-900'>Cash on Delivery</p>
                  <p className='text-xs text-gray-500'>Pay when you receive</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/** Bill Details **/}
        <div className='bg-white p-5 rounded-xl border border-gray-100'>
          <h3 className='font-bold text-gray-900 mb-3'>Bill Details</h3>
          <div className='flex gap-4 justify-between text-sm mb-2'>
            <p className='text-gray-600'>Items total</p>
            <p className='font-medium text-gray-900 flex items-center gap-2'>
              <span className='line-through text-gray-400 text-xs'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
              <span>{DisplayPriceInRupees(totalPrice)}</span>
            </p>
          </div>
          <div className='flex gap-4 justify-between text-sm mb-2'>
            <p className='text-gray-600'>Delivery Charge</p>
            <p className='font-medium text-green-600'>Free</p>
          </div>
          <div className='border-t pt-3 mt-2 flex items-center justify-between font-bold text-lg text-gray-900'>
            <p>Grand Total</p>
            <p>{DisplayPriceInRupees(totalPrice)}</p>
          </div>
        </div>

      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage
