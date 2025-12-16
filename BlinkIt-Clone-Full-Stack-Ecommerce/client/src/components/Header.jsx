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
        <header className='h-32 lg:h-24 sticky top-0 z-40 flex flex-col justify-center gap-1 bg-primary-200 text-white shadow-md'>
            <div className='container mx-auto flex items-center px-4 justify-between h-full lg:h-auto'>
                {/** Mobile Layout: Location & Profile */}
                <div className='w-full lg:hidden flex flex-col gap-2'>
                    {
                        !isSearchPage && (
                            <div className='flex items-center justify-between w-full'>
                                <div className='flex items-center gap-2'>
                                    <div className='text-2xl font-semibold'>kirana India</div>
                                </div>
                            </div>
                        )
                    }
                    <div className='mt-1'>
                        <Search />
                    </div>
                </div>

                {/** Desktop Layout */}
                <div className='hidden lg:flex items-center justify-between w-full'>
                    {/**logo */}
                    <div className='h-full'>
                        <Link to={"/"} className='h-full flex justify-center items-center'>
                            <img
                                src={logo}
                                width={170}
                                height={60}
                                alt='logo'
                                className='block brightness-0 invert'
                            />
                        </Link>
                    </div>

                    {/**Search */}
                    <div className='w-full max-w-xl'>
                        <Search />
                    </div>

                    {/**login and my cart */}
                    <div className='flex items-center gap-8'>
                        {
                            user?._id ? (
                                <div className='relative'>
                                    <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-2 cursor-pointer font-medium hover:text-secondary-100 transition-colors'>
                                        <p>Account</p>
                                        {
                                            openUserMenu ? (
                                                <GoTriangleUp size={20} />
                                            ) : (
                                                <GoTriangleDown size={20} />
                                            )
                                        }
                                    </div>
                                    {
                                        openUserMenu && (
                                            <div className='absolute right-0 top-12 z-50'>
                                                <div className='bg-white rounded p-4 min-w-52 shadow-xl text-black'>
                                                    <UserMenu close={handleCloseUserMenu} />
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <button onClick={redirectToLoginPage} className='text-lg px-2 font-medium hover:text-secondary-100 transition-colors'>Login</button>
                            )
                        }
                        <button onClick={() => setOpenCartSection(true)} className='flex items-center gap-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl text-primary-200 transition-all font-bold shadow-sm'>
                            <div className='animate-bounce text-primary-200'>
                                <BsCart4 size={24} />
                            </div>
                            <div className='text-left'>
                                {
                                    cartItem[0] ? (
                                        <div className='leading-tight'>
                                            <p className='text-xs font-normal text-gray-500'>{totalQty} Items</p>
                                            <p className='text-sm'>{DisplayPriceInRupees(totalPrice)}</p>
                                        </div>
                                    ) : (
                                        <p className='text-sm'>My Cart</p>
                                    )
                                }
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {
                openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )
            }
        </header>
    )
}

export default Header
