import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';
import { motion } from "framer-motion"

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        })
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setUserData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }
    return (
        <div className='p-4'>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-3xl mx-auto'
            >
                <div className="bg-white rounded-xl shadow-premium p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className='text-xl font-bold text-gray-800 mb-6'>Profile Details</h2>

                    {/**profile upload and display image */}
                    <div className='flex items-center gap-6 mb-8'>
                        <div className='w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full overflow-hidden shadow-md border-2 border-white ring-2 ring-gray-100'>
                            {
                                user.avatar ? (
                                    <img
                                        alt={user.name}
                                        src={user.avatar}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <FaRegUserCircle size={65} className="text-gray-500" />
                                )
                            }
                        </div>
                        <div>
                            <button onClick={() => setProfileAvatarEdit(true)} className='text-sm border border-primary-200 text-primary-200 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold transition-colors'>
                                Change Photo
                            </button>
                        </div>
                    </div>

                    {
                        openProfileAvatarEdit && (
                            <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
                        )
                    }

                    {/**name, mobile , email, change password */}
                    <form className='grid gap-6' onSubmit={handleSubmit}>
                        <div className='grid gap-2'>
                            <label className='font-semibold text-gray-800'>Full Name</label>
                            <input
                                type='text'
                                placeholder='Enter your name'
                                className='w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-medium'
                                value={userData.name}
                                name='name'
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                        <div className='grid md:grid-cols-2 gap-6'>
                            <div className='grid gap-2'>
                                <label htmlFor='email' className='font-semibold text-gray-800'>Email Address</label>
                                <input
                                    type='email'
                                    id='email'
                                    placeholder='Enter your email'
                                    className='w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium'
                                    value={userData.email}
                                    name='email'
                                    onChange={handleOnChange}
                                    required
                                    disabled // Usually email isn't changeable directly or warrants specific flow
                                />
                            </div>
                            <div className='grid gap-2'>
                                <label htmlFor='mobile' className='font-semibold text-gray-800'>Mobile Number</label>
                                <input
                                    type='text'
                                    id='mobile'
                                    placeholder='Enter your mobile'
                                    className='w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-medium'
                                    value={userData.mobile}
                                    name='mobile'
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button className='bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all tracking-wide'>
                                {
                                    loading ? "Updating..." : "Save Changes"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default Profile
