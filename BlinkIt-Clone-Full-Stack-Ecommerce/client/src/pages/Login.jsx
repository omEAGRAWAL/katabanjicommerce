import { useState } from 'react'
import { FaRegEyeSlash, FaRegEye, FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { motion } from "framer-motion";
import { auth, googleProvider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
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
            const result = await signInWithPopup(auth, googleProvider)
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

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                navigate("/")
            }
        } catch (error) {
            console.error(error)
            toast.error("Google Login Failed")
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email: "",
                    password: "",
                })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full container mx-auto px-4 flex items-center justify-center min-h-screen bg-white'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md'
            >
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Login/Register</h2>
                </div>

                <form className='grid gap-6' onSubmit={handleSubmit}>
                    <div className='grid gap-2'>
                        <label htmlFor='email' className="text-sm font-semibold text-gray-700">Email</label>
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
                        <Link to={"/forgot-password"} className='block ml-auto text-sm font-medium text-primary-200 hover:opacity-80 transition-opacity mt-1'>Forgot password?</Link>
                    </div>

                    <button
                        disabled={!valideValue}
                        className={`
                            py-4 rounded-full font-bold text-white text-lg tracking-wide transition-all shadow-lg
                            ${valideValue
                                ? "bg-primary-200 hover:bg-primary-100 hover:shadow-xl transform hover:-translate-y-0.5"
                                : "bg-gray-300 cursor-not-allowed"
                            }
                        `}
                    >
                        Login
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Social Login</span>
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
                            Don't have an account? <Link to={"/register"} className='font-bold text-primary-200 hover:underline'>Register</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default Login
