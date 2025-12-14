
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) {
                close()
            }
            return
        }
        toast("Please Login")
    }
    return (
        <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50 flex justify-end'>
            <div className='bg-white w-full max-w-sm h-full flex flex-col shadow-xl animate-slide-in'>
                <div className='flex items-center p-4 shadow-sm border-b gap-3 justify-between bg-white z-10'>
                    <h2 className='font-bold text-lg'>My Cart</h2>
                    <button onClick={close} className='hover:bg-gray-100 p-1 rounded-full transition-colors'>
                        <IoClose size={25} />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto bg-gray-50 p-4 flex flex-col gap-4 scrollbar-none'>
                    {/***display items */}
                    {
                        cartItem[0] ? (
                            <>
                                <div className='flex items-center justify-between px-4 py-3 bg-purple-50 border border-dashed border-purple-200 text-purple-700 rounded-xl'>
                                    <p className='font-medium text-sm'>Your total savings</p>
                                    <p className='font-bold'>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                                </div>

                                <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item, index) => {
                                                let variantDetails = null;
                                                let displayPrice = item?.productId?.price;
                                                let displayDiscount = item?.productId?.discount;
                                                let displayName = item?.productId?.name;

                                                if (item.variantId && item.productId.variants) {
                                                    variantDetails = item.productId.variants.find(v => v._id === item.variantId)
                                                    if (variantDetails) {
                                                        displayPrice = variantDetails.price;
                                                        displayDiscount = variantDetails.discount;
                                                        displayName = `${item?.productId?.name} (${variantDetails.name})`;
                                                    }
                                                }

                                                return (
                                                    <div key={item?._id + "cartItemDisplay"} className='flex w-full gap-3 p-3 border-b last:border-b-0'>
                                                        <div className='w-16 h-16 shrink-0 bg-gray-50 border rounded-lg flex items-center justify-center p-1'>
                                                            <img
                                                                src={item?.productId?.image[0]}
                                                                className='w-full h-full object-contain'
                                                            />
                                                        </div>
                                                        <div className='w-full flex flex-col justify-between'>
                                                            <div>
                                                                <p className='text-sm font-medium text-gray-800 line-clamp-2 leading-tight'>{displayName}</p>
                                                                <p className='text-xs text-gray-500 mt-0.5'>{item?.productId?.unit}</p>
                                                            </div>
                                                            <div className='flex items-center justify-between mt-2'>
                                                                <div className='flex items-center gap-2'>
                                                                    <p className='font-bold text-sm text-gray-900'>{DisplayPriceInRupees(pricewithDiscount(displayPrice, displayDiscount))}</p>
                                                                    {Boolean(displayDiscount) && (
                                                                        <p className='text-xs text-gray-400 line-through'>{DisplayPriceInRupees(displayPrice)}</p>
                                                                    )}
                                                                </div>
                                                                <AddToCartButton data={item?.productId} variantId={item?.variantId} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>

                                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4'>
                                    <h3 className='font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide'>Bill details</h3>
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
                                    <div className='border-t pt-3 mt-2 flex items-center justify-between font-bold text-base text-gray-900'>
                                        <p>Grand total</p>
                                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className='flex flex-col justify-center items-center h-full gap-4'>
                                <img
                                    src={imageEmpty}
                                    className='w-40 h-40 object-contain grayscale opacity-50'
                                />
                                <p className='text-gray-500 font-medium'>Your cart is empty</p>
                                <Link onClick={close} to={"/"} className='bg-primary-200 px-6 py-2.5 text-white font-bold rounded-full shadow-lg hover:bg-primary-100 transition-colors'>Shop Now</Link>
                            </div>
                        )
                    }

                </div>

                {
                    cartItem[0] && (
                        <div className='p-4 bg-white border-t sticky bottom-0 z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
                            <button onClick={redirectToCheckoutPage} className='bg-primary-200 hover:bg-primary-100 text-white w-full rounded-xl py-3 px-4 font-bold text-lg flex items-center justify-between transition-colors shadow-premium hover:shadow-premium-hover'>
                                <div className='flex flex-col text-left items-start leading-none gap-0.5'>
                                    <span className='text-sm font-medium opacity-90'>{DisplayPriceInRupees(totalPrice)}</span>
                                    <span className='text-xs font-normal opacity-75'>Total</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    Proceed to Pay
                                    <FaCaretRight size={20} />
                                </div>
                            </button>
                        </div>
                    )
                }

            </div>
        </section>
    )
}

export default DisplayCartItem
