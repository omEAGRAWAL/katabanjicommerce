import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
    const navigate = useNavigate()

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


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/verification-otp", {
                    state: data
                })
                setData({
                    email: "",
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
                    <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
                    <p className="text-gray-500 text-sm mt-1">Enter your email to receive recovery instructions</p>
                </div>

                <form className='grid gap-5' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email' className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-gray-50 p-3 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            required
                        />
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
                        Send OTP
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>
                        Remember your password? <Link to={"/login"} className='font-bold text-green-700 hover:text-green-800 hover:underline'>Login</Link>
                    </p>
                </div>
            </motion.div>
        </section>
    )
}

export default ForgotPassword


