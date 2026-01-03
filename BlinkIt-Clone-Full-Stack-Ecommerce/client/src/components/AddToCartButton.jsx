import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data, variantId }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Optimistic Update
        setIsAvailableCart(true)
        setQty(1)

        try {
            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id,
                    variantId: variantId || null
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            } else {
                // Revert on failure (if success false but no error throw)
                setIsAvailableCart(false)
                setQty(0)
            }
        } catch (error) {
            // Revert on error
            setIsAvailableCart(false)
            setQty(0)
            AxiosToastError(error)
        }
    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item =>
            item.productId._id === data._id &&
            (variantId ? item.variantId === variantId : !item.variantId)
        )
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item =>
            item.productId._id === data._id &&
            (variantId ? item.variantId === variantId : !item.variantId)
        )
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem, variantId])


    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Optimistic
        const prevQty = qty
        setQty(prev => prev + 1)

        const response = await updateCartItem(cartItemDetails?._id, prevQty + 1)

        if (response.success) {
            toast.success("Item added")
        } else {
            // Revert
            setQty(prevQty)
        }
    }

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Optimistic
        const prevQty = qty
        if (prevQty === 1) {
            setIsAvailableCart(false)
            setQty(0)

            const response = await deleteCartItem(cartItemDetails?._id)
            if (response.success) {
                toast.success("Item remove")
            } else {
                // Revert
                setIsAvailableCart(true)
                setQty(1)
            }
        } else {
            setQty(prev => prev - 1)
            const response = await updateCartItem(cartItemDetails?._id, prevQty - 1)

            if (response.success) {
                toast.success("Item remove")
            } else {
                // Revert
                setQty(prevQty)
            }
        }
    }
    return (
        <div className='w-full max-w-[150px]'>
            {
                isAvailableCart ? (
                    <div className='flex w-full h-9 items-center bg-green-600 rounded-lg overflow-hidden shrink-0'>
                        <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full h-full p-1 flex items-center justify-center transition-colors'><FaMinus size={12} /></button>

                        <p className='flex-1 w-full h-full font-bold px-1 flex items-center justify-center text-white text-sm'>{qty}</p>

                        <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full h-full p-1 flex items-center justify-center transition-colors'><FaPlus size={12} /></button>
                    </div>
                ) : (
                    <button onClick={handleADDTocart} className='bg-white hover:bg-green-50 text-green-600 border border-green-600 px-4 py-1.5 rounded-lg text-sm font-bold w-fit min-w-[80px] transition-colors uppercase tracking-wide'>
                        {false ? <Loading /> : "Add"}
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton
