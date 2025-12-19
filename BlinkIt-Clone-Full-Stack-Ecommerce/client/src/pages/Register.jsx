import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion"

const Register = () => {
    return (
        <section className='w-full container mx-auto px-4 flex items-center justify-center min-h-screen bg-white'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md text-center'
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">No Registration Required!</h2>
                    <p className="text-gray-600 text-lg mb-6">
                        Simply login with your mobile number and name to get started.
                    </p>
                    <p className="text-gray-500 text-sm mb-8">
                        We've simplified the login process. Just enter your 10-digit mobile number and name - that's all you need!
                    </p>
                </div>

                <Link
                    to="/login"
                    className="inline-block bg-primary-200 hover:bg-primary-100 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    Go to Login
                </Link>
            </motion.div>
        </section>
    )
}

export default Register


/* ==================== OLD REGISTRATION CODE (COMMENTED OUT) ====================

import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye, FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { auth, googleProvider } from '../firebase'
import { signInWithRedirect } from 'firebase/auth'
import { useDispatch } from 'react-redux';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)

    const handleGoogleLogin = async (e) => {
        e.preventDefault()
        try {
            const result = await signInWithRedirect(auth, googleProvider)
            const user = result.user

            const response = await Axios({
                ...SummaryApi.google_login,
                data: {
                    name: user.displayName,
                    email: user.email,
                    googlePhotoUrl: user.photoURL
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                navigate("/")
            }
        } catch (error) {
            console.error(error)
            toast.error("Google Login Failed")
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password !== data.confirmPassword) {
            toast.error(
                "password and confirm password must be same"
            )
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-4 flex items-center justify-center min-h-screen bg-white'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-lg'
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-500 text-sm">Join Binkeyit today</p>
                </div>

                <form className='grid gap-5' onSubmit={handleSubmit}>
                    <div className='grid gap-2'>
                        <label htmlFor='name' className="text-sm font-semibold text-gray-700">Name</label>
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className='bg-gray-100 p-4 rounded-xl outline-none border-2 border-transparent focus:border-primary-200 transition-all text-gray-800'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor='email' className="text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-gray-100 p-4 rounded-xl outline-none border-2 border-transparent focus:border-primary-200 transition-all text-gray-800'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor='password' className="text-sm font-semibold text-gray-700">Password</label>
                        <div className='bg-gray-100 p-4 rounded-xl flex items-center border-2 border-transparent focus-within:border-primary-200 transition-all'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none bg-transparent text-gray-800'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                                required
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors'>
                                {
                                    showPassword ? (
                                        <FaRegEye size={20} />
                                    ) : (
                                        <FaRegEyeSlash size={20} />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor='confirmPassword' className="text-sm font-semibold text-gray-700">Confirm Password</label>
                        <div className='bg-gray-100 p-4 rounded-xl flex items-center border-2 border-transparent focus-within:border-primary-200 transition-all'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none bg-transparent text-gray-800'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Confirm your password'
                                required
                            />
                            <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer text-gray-400 hover:text-gray-600 transition-colors'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye size={20} />
                                    ) : (
                                        <FaRegEyeSlash size={20} />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!valideValue}
                        className={`
                            py-4 rounded-full font-bold text-white text-lg tracking-wide transition-all shadow-lg mt-4
                            ${valideValue
                                ? "bg-primary-200 hover:bg-primary-100 hover:shadow-xl transform hover:-translate-y-0.5"
                                : "bg-gray-300 cursor-not-allowed"
                            }
                        `}
                    >
                        Register
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or register with</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="flex justify-center gap-6 mt-4">
                        <button type='button' className="w-12 h-12 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <FaFacebook className="text-blue-600 text-2xl" />
                        </button>
                        <button type='button' onClick={handleGoogleLogin} className="w-12 h-12 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <FcGoogle className="text-2xl" />
                        </button>
                        <button type='button' className="w-12 h-12 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <MdEmail className="text-red-500 text-2xl" />
                        </button>
                    </div>

                    <div className="mt-8 text-center text-gray-600">
                        <p>
                            Already have an account? <Link to={"/login"} className='font-bold text-primary-200 hover:underline'>Login</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default Register

==================== END OF OLD CODE ====================
*/
