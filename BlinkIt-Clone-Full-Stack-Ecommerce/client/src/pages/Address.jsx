import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import { motion } from "framer-motion"

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      })
      if (response.data.success) {
        toast.success("Address Removed")
        if (fetchAddress) {
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='p-4'>
      <div className='bg-white shadow-sm px-6 py-4 flex justify-between gap-4 items-center rounded-xl mb-6 border border-gray-100'>
        <h2 className='font-extrabold text-2xl text-gray-800'>Saved Addresses</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className='border border-primary-200 text-primary-200 px-5 py-2 rounded-full hover:bg-primary-50 transition-colors font-bold flex items-center gap-2'
        >
          <FaPlus /> Add New
        </button>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {
          addressList.map((address, index) => {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={address?._id + "address"}
                className={`border border-gray-100 rounded-xl p-5 flex flex-col gap-3 bg-white shadow-sm hover:shadow-premium-hover transition-all ${!address.status && 'hidden'}`}
              >
                <div className='w-full space-y-1'>
                  <p className='font-bold text-gray-800 text-lg'>{address.address_line}</p>
                  <p className='text-gray-600 font-medium'>{address.city}, {address.state}</p>
                  <p className='text-gray-600 font-medium'>{address.country} - <span className='font-bold text-gray-800'>{address.pincode}</span></p>
                  <p className='text-gray-600 mt-2 flex items-center gap-2 font-medium'><span className='text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold'>Mobile</span> {address.mobile}</p>
                </div>
                <div className='flex gap-3 mt-auto pt-4 border-t border-gray-50 md:justify-end'>
                  <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(address)
                  }} className='bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors flex-1 md:flex-none flex items-center justify-center'>
                    <MdEdit size={20} />
                  </button>
                  <button onClick={() =>
                    handleDisableAddress(address._id)
                  } className='bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex-1 md:flex-none flex items-center justify-center'>
                    <MdDelete size={20} />
                  </button>
                </div>
              </motion.div>
            )
          })
        }
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setOpenAddress(true)}
          className='h-auto min-h-[160px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 hover:border-primary-200 transition-all group gap-2'
        >
          <div className='bg-white p-3 rounded-full shadow-sm text-gray-400 group-hover:text-primary-200 transition-colors'>
            <FaPlus size={24} />
          </div>
          <p className='text-gray-500 font-medium group-hover:text-primary-200'>Add New Address</p>
        </motion.div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }

      {
        OpenEdit && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
        )
      }
    </div>
  )
}

export default Address
