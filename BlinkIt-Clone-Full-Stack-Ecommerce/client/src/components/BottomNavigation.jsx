import React from 'react'
import { useLocation } from 'react-router-dom'
import { IoHomeOutline, IoHome } from "react-icons/io5"
import { BsCart4 } from "react-icons/bs"
import { FaRegCircleUser, FaCircleUser } from "react-icons/fa6"
import { useSelector } from 'react-redux'

const BottomNavigation = () => {
    const location = useLocation()
    const user = useSelector((state) => state?.user)
    const cartItem = useSelector(state => state.cartItem.cart)

    const isHomePage = location.pathname === '/'
    const isUserPage = location.pathname === '/user' || location.pathname.startsWith('/user/')

    const cartCount = cartItem?.length || 0

    // Don't show on certain pages
    const hideOnPages = ['/checkout', '/login', '/register', '/forgot-password', '/verify-email']
    if (hideOnPages.includes(location.pathname)) {
        return null
    }

    const handleCartClick = () => {
        console.log('Cart button clicked')
        const event = new CustomEvent('openCart')
        window.dispatchEvent(event)
    }

    const handleHomeClick = () => {
        console.log('Home clicked, navigating to /')
        window.location.href = '/'
    }

    const handleAccountClick = () => {
        console.log('Account clicked')
        if (user?._id) {
            window.location.href = '/user'
        } else {
            window.location.href = '/login'
        }
    }

    return (
        <nav className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50'>
            <div className='flex items-center justify-around py-2'>
                {/* Home Tab */}
                <button
                    onClick={handleHomeClick}
                    className={`flex flex-col items-center justify-center py-1 px-6 transition-all ${isHomePage ? 'text-primary-200' : 'text-gray-500'
                        }`}
                >
                    {isHomePage ? (
                        <IoHome size={26} className='mb-1' />
                    ) : (
                        <IoHomeOutline size={26} className='mb-1' />
                    )}
                    <span className={`text-xs font-medium ${isHomePage ? 'font-bold' : ''}`}>
                        Home
                    </span>
                </button>

                {/* Cart Tab */}
                <button
                    onClick={handleCartClick}
                    className='flex flex-col items-center justify-center py-1 px-6 text-gray-500 hover:text-primary-200 transition-all relative'
                >
                    <div className='relative'>
                        <BsCart4 size={26} className='mb-1' />
                        {cartCount > 0 && (
                            <span className='absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </div>
                    <span className='text-xs font-medium'>Cart</span>
                </button>

                {/* Account Tab */}
                <button
                    onClick={handleAccountClick}
                    className={`flex flex-col items-center justify-center py-1 px-6 transition-all ${isUserPage ? 'text-primary-200' : 'text-gray-500'
                        }`}
                >
                    {isUserPage ? (
                        <FaCircleUser size={26} className='mb-1' />
                    ) : (
                        <FaRegCircleUser size={26} className='mb-1' />
                    )}
                    <span className={`text-xs font-medium ${isUserPage ? 'font-bold' : ''}`}>
                        Account
                    </span>
                </button>
            </div>
        </nav>
    )
}

export default BottomNavigation
