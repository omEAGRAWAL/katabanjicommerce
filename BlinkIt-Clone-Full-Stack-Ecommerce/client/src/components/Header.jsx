// import React, { useEffect, useState } from 'react'
// import logo from '../assets/logo.png'
// import Search from './Search'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { FaRegCircleUser } from "react-icons/fa6";
// import useMobile from '../hooks/useMobile';
// import { BsCart4 } from "react-icons/bs";
// import { useSelector } from 'react-redux';
// import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
// import UserMenu from './UserMenu';
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
// import { useGlobalContext } from '../provider/GlobalProvider';
// import DisplayCartItem from './DisplayCartItem';
// import { MdLocationOn } from "react-icons/md";

// const Header = () => {
//     const [isMobile] = useMobile()
//     const location = useLocation()
//     const isSearchPage = location.pathname === "/search"
//     const navigate = useNavigate()
//     const user = useSelector((state) => state?.user)
//     const [openUserMenu, setOpenUserMenu] = useState(false)
//     const cartItem = useSelector(state => state.cartItem.cart)
//     const { totalPrice, totalQty } = useGlobalContext()
//     const [openCartSection, setOpenCartSection] = useState(false)

//     const redirectToLoginPage = () => {
//         navigate("/login")
//     }

//     const handleCloseUserMenu = () => {
//         setOpenUserMenu(false)
//     }

//     const handleMobileUser = () => {
//         if (!user._id) {
//             navigate("/login")
//             return
//         }

//         navigate("/user")
//     }

//     useEffect(() => {
//         const handleOpenCart = () => {
//             setOpenCartSection(true)
//         }

//         window.addEventListener('openCart', handleOpenCart)

//         return () => {
//             window.removeEventListener('openCart', handleOpenCart)
//         }
//     }, [])

//     return (
//         <header className='h-32 lg:h-24 sticky top-0 z-40 flex flex-col justify-center gap-1 bg-primary-200 text-white shadow-md'>
//             <div className='container mx-auto flex items-center px-4 justify-between h-full lg:h-auto'>
//                 {/** Mobile Layout: Location & Profile */}
//                 <div className='w-full lg:hidden flex flex-col gap-2'>
//                     {
//                         !isSearchPage && (
//                             <div className='flex items-center justify-between w-full'>
//                                 <div className='flex items-center gap-2'>
//                                     <div className='text-2xl font-semibold'>kirana India</div>
//                                 </div>
//                             </div>
//                         )
//                     }
//                     <div className='mt-1'>
//                         <Search />
//                     </div>
//                 </div>

//                 {/** Desktop Layout */}
//                 <div className='hidden lg:flex items-center justify-between w-full'>
//                     {/**logo */}
//                     <div className='h-full'>
//                         <Link to={"/"} className='h-full flex justify-center items-center'>
//                             <img
//                                 src={logo}
//                                 width={170}
//                                 height={60}
//                                 alt='logo'
//                                 className='block brightness-0 invert'
//                             />
//                         </Link>
//                     </div>

//                     {/**Search */}
//                     <div className='w-full max-w-xl'>
//                         <Search />
//                     </div>

//                     {/**login and my cart */}
//                     <div className='flex items-center gap-8'>
//                         {
//                             user?._id ? (
//                                 <div className='relative'>
//                                     <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-2 cursor-pointer font-medium hover:text-secondary-100 transition-colors'>
//                                         <p>Account</p>
//                                         {
//                                             openUserMenu ? (
//                                                 <GoTriangleUp size={20} />
//                                             ) : (
//                                                 <GoTriangleDown size={20} />
//                                             )
//                                         }
//                                     </div>
//                                     {
//                                         openUserMenu && (
//                                             <div className='absolute right-0 top-12 z-50'>
//                                                 <div className='bg-white rounded p-4 min-w-52 shadow-xl text-black'>
//                                                     <UserMenu close={handleCloseUserMenu} />
//                                                 </div>
//                                             </div>
//                                         )
//                                     }
//                                 </div>
//                             ) : (
//                                 <button onClick={redirectToLoginPage} className='text-lg px-2 font-medium hover:text-secondary-100 transition-colors'>Login</button>
//                             )
//                         }
//                         <button onClick={() => setOpenCartSection(true)} className='flex items-center gap-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl text-primary-200 transition-all font-bold shadow-sm'>
//                             <div className='animate-bounce text-primary-200'>
//                                 <BsCart4 size={24} />
//                             </div>
//                             <div className='text-left'>
//                                 {
//                                     cartItem[0] ? (
//                                         <div className='leading-tight'>
//                                             <p className='text-xs font-normal text-gray-500'>{totalQty} Items</p>
//                                             <p className='text-sm'>{DisplayPriceInRupees(totalPrice)}</p>
//                                         </div>
//                                     ) : (
//                                         <p className='text-sm'>My Cart</p>
//                                     )
//                                 }
//                             </div>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {
//                 openCartSection && (
//                     <DisplayCartItem close={() => setOpenCartSection(false)} />
//                 )
//             }
//         </header>
//     )
// }

// export default Header
import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import { MdLocationOn } from "react-icons/md";

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }

        navigate("/user")
    }

    useEffect(() => {
        const handleOpenCart = () => {
            setOpenCartSection(true)
        }

        window.addEventListener('openCart', handleOpenCart)

        return () => {
            window.removeEventListener('openCart', handleOpenCart)
        }
    }, [])

    return (
        <header className='sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm'>
            {/* Desktop Header */}
            <div className='hidden lg:block bg-gradient-to-r from-emerald-600 to-emerald-500'>
                <div className='container mx-auto px-4 py-2'>
                    <div className='flex items-center justify-between text-white text-sm'>
                        <div className='flex items-center gap-2'>
                            <MdLocationOn size={18} />
                            <span>Deliver to: <strong>Bhubaneswar, Odisha</strong></span>
                        </div>
                        <div className='flex items-center gap-6'>
                            <span className='hover:text-emerald-100 cursor-pointer transition-colors'>Help</span>
                            <span className='hover:text-emerald-100 cursor-pointer transition-colors'>Offers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className='bg-white'>
                <div className='container mx-auto px-4'>
                    {/* Desktop Layout */}
                    <div className='hidden lg:flex items-center justify-between py-4 gap-8'>
                        {/* Logo */}
                        <Link to={"/"} className='flex-shrink-0'>
                            <div className='text-2xl font-bold text-emerald-600'>
                                kirana<span className='text-gray-800'>India</span>
                            </div>
                        </Link>

                        {/* Search - Takes most space */}
                        <div className='flex-1 max-w-2xl'>
                            <Search />
                        </div>

                        {/* Right Side Actions */}
                        <div className='flex items-center gap-6 flex-shrink-0'>
                            {/* User Account */}
                            {user?._id ? (
                                <div className='relative'>
                                    <button
                                        onClick={() => setOpenUserMenu(prev => !prev)}
                                        className='flex items-center gap-2 hover:text-emerald-600 transition-colors group'
                                    >
                                        <FaRegCircleUser size={24} className='group-hover:scale-110 transition-transform' />
                                        <div className='text-left'>
                                            <p className='text-xs text-gray-500'>Hello,</p>
                                            <p className='text-sm font-semibold text-gray-800 flex items-center gap-1'>
                                                {user.name?.split(' ')[0] || 'Account'}
                                                {openUserMenu ? <GoTriangleUp size={14} /> : <GoTriangleDown size={14} />}
                                            </p>
                                        </div>
                                    </button>
                                    {openUserMenu && (
                                        <div className='absolute right-0 top-full mt-2 z-50'>
                                            <div className='bg-white rounded-lg p-4 min-w-56 shadow-xl border border-gray-200'>
                                                <UserMenu close={handleCloseUserMenu} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={redirectToLoginPage}
                                    className='flex items-center gap-2 hover:text-emerald-600 transition-colors group'
                                >
                                    <FaRegCircleUser size={24} className='group-hover:scale-110 transition-transform' />
                                    <div className='text-left'>
                                        <p className='text-xs text-gray-500'>Hello,</p>
                                        <p className='text-sm font-semibold text-gray-800'>Sign In</p>
                                    </div>
                                </button>
                            )}

                            {/* Cart Button */}
                            <button
                                onClick={() => setOpenCartSection(true)}
                                className='relative flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg active:scale-95'
                            >
                                <BsCart4 size={24} />
                                <div className='text-left'>
                                    {cartItem[0] ? (
                                        <div>
                                            <p className='text-xs opacity-90'>{totalQty} Items</p>
                                            <p className='text-sm font-bold'>{DisplayPriceInRupees(totalPrice)}</p>
                                        </div>
                                    ) : (
                                        <p className='text-sm font-bold'>Cart</p>
                                    )}
                                </div>
                                {totalQty > 0 && (
                                    <span className='absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center'>
                                        {totalQty}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className='lg:hidden py-3'>
                        {/* Top Row - Logo and Icons */}
                        <div className='flex items-center justify-between mb-3'>
                            <Link to={"/"}>
                                <div className='text-xl font-bold text-emerald-600'>
                                    kirana<span className='text-gray-800'>India</span>
                                </div>
                            </Link>

                            <div className='flex items-center gap-3'>
                                {/* User Icon */}
                                <button
                                    onClick={handleMobileUser}
                                    className='p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95'
                                >
                                    <FaRegCircleUser size={24} className='text-gray-700' />
                                </button>

                                {/* Cart Icon */}
                                <button
                                    onClick={() => setOpenCartSection(true)}
                                    className='relative p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95'
                                >
                                    <BsCart4 size={24} className='text-gray-700' />
                                    {totalQty > 0 && (
                                        <span className='absolute -top-1 -right-1 bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                                            {totalQty}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className='mb-2'>
                            <Search />
                        </div>

                        {/* Location */}
                        {/* <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <MdLocationOn size={16} className='text-emerald-600' />
                            <span className='truncate'>Deliver to: <strong className='text-gray-800'>Bhubaneswar</strong></span>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Cart Sidebar */}
            {openCartSection && (
                <DisplayCartItem close={() => setOpenCartSection(false)} />
            )}
        </header>
    )
}

export default Header