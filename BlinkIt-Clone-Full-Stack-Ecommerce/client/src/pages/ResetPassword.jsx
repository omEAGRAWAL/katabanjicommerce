import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import { motion } from "framer-motion";

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const valideValue = Object.values(data).every(el => el)

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }

        if (location?.state?.email) {
            setData((preve) => {
                return {
                    ...preve,
                    email: location?.state?.email
                }
            })
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    console.log("data reset password", data)

    const handleSubmit = async (e) => {
        e.preventDefault()

        ///optional 
        if (data.newPassword !== data.confirmPassword) {
            toast.error("New password and confirm password must be same.")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword, //change
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })

            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-2 flex items-center justify-center min-h-[80vh]'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white/90 backdrop-blur-md shadow-premium rounded-xl p-8 w-full max-w-md border border-gray-100'
            >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-500 text-sm mt-1">Create a strong new password</p>
                </div>

                <form className='grid gap-5' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='newPassword' className="text-sm font-medium text-gray-700">New Password</label>
                        <div className='bg-gray-50 p-3 border border-gray-200 rounded-lg flex items-center focus-within:border-primary-200 focus-within:ring-2 focus-within:ring-primary-200/20 transition-all'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none bg-transparent'
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Enter your new password'
                                required
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer text-gray-500 hover:text-gray-700 transition-colors'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword' className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className='bg-gray-50 p-3 border border-gray-200 rounded-lg flex items-center focus-within:border-primary-200 focus-within:ring-2 focus-within:ring-primary-200/20 transition-all'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none bg-transparent'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm password'
                                required
                            />
                            <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer text-gray-500 hover:text-gray-700 transition-colors'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!valideValue}
                        className={`
                            py-3 rounded-lg font-bold text-white tracking-wide transition-all shadow-md mt-2
                            ${valideValue
                                ? "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 hover:shadow-lg transform hover:-translate-y-0.5"
                                : "bg-gray-400 cursor-not-allowed"
                            }
                        `}
                    >
                        Change Password
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Already have an account? <Link to={"/login"} className='font-bold text-green-700 hover:text-green-800 hover:underline'>Login</Link>
                    </p>
                </div>
            </motion.div>
        </section>
    )
}

export default ResetPassword
