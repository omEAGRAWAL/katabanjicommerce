import React, { useEffect, useRef, useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    console.log("location", location)

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [])

    const valideValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }

        } catch (error) {
            console.log('error', error)
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
                    <h2 className="text-2xl font-bold text-gray-800">Verification Code</h2>
                    <p className="text-gray-500 text-sm mt-1">Please enter the OTP sent to your email</p>
                </div>

                <form className='grid gap-5' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='otp' className="text-sm font-medium text-gray-700">Enter Your OTP</label>
                        <div className='flex items-center gap-2 justify-between mt-3'>
                            {
                                data.map((element, index) => {
                                    return (
                                        <input
                                            key={"otp" + index}
                                            type='text'
                                            id='otp'
                                            ref={(ref) => {
                                                inputRef.current[index] = ref
                                                return ref
                                            }}
                                            value={data[index]}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                console.log("value", value)

                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)

                                                if (value && index < 5) {
                                                    inputRef.current[index + 1].focus()
                                                }
                                            }}
                                            maxLength={1}
                                            className='bg-gray-50 w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 text-center font-bold text-lg h-12 transition-all'
                                        />
                                    )
                                })
                            }
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
                        Verify OTP
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

export default OtpVerification



