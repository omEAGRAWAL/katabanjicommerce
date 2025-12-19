import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdPhone } from 'react-icons/md'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'
import { motion, AnimatePresence } from 'framer-motion'

const LoginPromptModal = ({ isOpen, onClose }) => {
    const [data, setData] = useState({
        mobile: "",
        name: "",
    })
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        // For mobile field, only allow numbers and limit to 10 digits
        if (name === 'mobile') {
            const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 10)
            setData((prev) => ({
                ...prev,
                [name]: numbersOnly
            }))
        } else {
            setData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const valideValue = data.mobile.length === 10 && data.name.trim() !== ""

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.mobile_login,
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
                    mobile: "",
                    name: "",
                })
                onClose()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className='absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95'
                            aria-label='Close'
                        >
                            <IoClose size={24} className='text-gray-600' />
                        </button>

                        {/* Header */}
                        <div className='text-center mb-6'>
                            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>Login to Continue</h2>
                            <p className='text-gray-600 text-sm'>Enter your mobile number and name to get started</p>
                        </div>

                        {/* Login Form */}
                        <form className='grid gap-4' onSubmit={handleSubmit}>
                            <div className='grid gap-2'>
                                <label htmlFor='modal-mobile' className='text-sm font-semibold text-gray-700'>
                                    Mobile Number
                                </label>
                                <div className='bg-gray-100 p-3 rounded-xl flex items-center border-2 border-transparent focus-within:border-emerald-500 transition-all'>
                                    <MdPhone className='text-gray-400 mr-2' size={20} />
                                    <input
                                        type='tel'
                                        id='modal-mobile'
                                        className='w-full outline-none bg-transparent text-gray-800'
                                        name='mobile'
                                        value={data.mobile}
                                        onChange={handleChange}
                                        placeholder='Enter 10-digit number'
                                        maxLength='10'
                                        required
                                    />
                                </div>
                                {data.mobile && data.mobile.length !== 10 && (
                                    <p className='text-xs text-red-500 ml-1'>Please enter a valid 10-digit mobile number</p>
                                )}
                            </div>

                            <div className='grid gap-2'>
                                <label htmlFor='modal-name' className='text-sm font-semibold text-gray-700'>
                                    Name
                                </label>
                                <input
                                    type='text'
                                    id='modal-name'
                                    className='bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-gray-800'
                                    name='name'
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder='Enter your name'
                                    required
                                />
                            </div>

                            <button
                                disabled={!valideValue}
                                type='submit'
                                className={`
                                    mt-2 py-3 rounded-full font-bold text-white text-base tracking-wide transition-all shadow-lg
                                    ${valideValue
                                        ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5'
                                        : 'bg-gray-300 cursor-not-allowed'
                                    }
                                `}
                            >
                                Login
                            </button>
                        </form>

                        {/* Footer */}
                        <div className='mt-4 text-center'>
                            <p className='text-xs text-gray-500'>
                                By continuing, you agree to our Terms & Conditions
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default LoginPromptModal
