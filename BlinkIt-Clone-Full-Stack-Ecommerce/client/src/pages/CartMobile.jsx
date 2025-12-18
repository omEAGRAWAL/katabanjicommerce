import React, { useEffect } from 'react'
import DisplayCartItem from '../components/DisplayCartItem'
import Header from '../components/Header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CartMobile = () => {
  const user = useSelector((state) => state?.user)
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!user?._id) {
      navigate('/login')
    }
  }, [user, navigate])

  // Don't render the cart if user is not logged in
  if (!user?._id) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='container mx-auto px-4 py-6'>
        <DisplayCartItem />
      </div>
    </div>
  )
}

export default CartMobile
