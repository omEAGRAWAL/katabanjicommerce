import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import { motion } from "framer-motion"

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: [],
    variants: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
        if (responseData.data.variants && responseData.data.variants.length > 0) {
          setSelectedVariant(responseData.data.variants[0])
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }
  console.log("product data", data)
  return (
    <section className='container mx-auto p-4 lg:p-8 grid lg:grid-cols-2 gap-8 lg:gap-12'>
      {/* Left Side: Images */}
      <div className=''>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded-2xl min-h-56 max-h-56 h-full w-full shadow-sm border border-gray-100 p-4 flex items-center justify-center sticky top-20'
        >
          <img
            src={data.image[image]}
            className='w-full h-full object-contain hover:scale-105 transition-transform duration-500'
            alt={data.name}
          />
        </motion.div>
        <div className='flex items-center justify-center gap-3 my-4'>
          {
            data.image.map((img, index) => {
              return (
                <div key={img + index + "point"} className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${index === image ? "bg-primary-200 scale-125" : "bg-slate-200"}`}></div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none py-2 px-1'>
            {
              data.image.map((img, index) => {
                return (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md rounded-xl border-2 overflow-hidden ${index === image ? "border-primary-200" : "border-transparent"}`}
                    key={img + index}
                  >
                    <img
                      src={img}
                      alt='min-product'
                      onClick={() => setImage(index)}
                      className='w-full h-full object-contain bg-white'
                    />
                  </motion.div>
                )
              })
            }
          </div>
          <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center pointer-events-none'>
            <button onClick={handleScrollLeft} className='z-10 bg-white relative p-2 rounded-full shadow-lg pointer-events-auto hover:bg-gray-50 text-gray-600 transition-colors'>
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className='z-10 bg-white relative p-2 rounded-full shadow-lg pointer-events-auto hover:bg-gray-50 text-gray-600 transition-colors'>
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Details */}
      <div className='flex flex-col gap-6'>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <p className='bg-green-100 text-green-700 font-semibold w-fit px-3 py-1 rounded-full text-xs'>10 Min Delivery</p>
          <h2 className='text-2xl font-bold lg:text-4xl text-gray-800 mt-3 mb-1'>{data.name}</h2>
          <p className='text-gray-500 font-medium'>{selectedVariant ? selectedVariant.name : data.unit}</p>

          <div className="my-4">
            <Divider />
          </div>

          <div>
            <p className='text-gray-700 text-sm mb-2'>Price</p>
            <div className='flex items-end gap-3 lg:gap-4'>
              <div className='border border-green-600 px-4 py-2 rounded-lg bg-green-50 w-fit flex items-center gap-2'>
                <p className='font-bold text-xl lg:text-2xl text-gray-900'>
                  {DisplayPriceInRupees(pricewithDiscount(
                    selectedVariant ? selectedVariant.price : data.price,
                    selectedVariant ? selectedVariant.discount : data.discount
                  ))}
                </p>
              </div>
              {
                (selectedVariant ? selectedVariant.discount : data.discount) && (
                  <div className="mb-2">
                    <p className='line-through text-gray-500 text-lg'>{DisplayPriceInRupees(selectedVariant ? selectedVariant.price : data.price)}</p>
                    <p className="font-bold text-green-600 text-sm">Save {selectedVariant ? selectedVariant.discount : data.discount}%</p>
                  </div>
                )
              }
            </div>
          </div>

          {
            data.variants && data.variants.length > 0 && (
              <div className='my-4'>
                <p className='font-semibold mb-2 text-gray-700'>Variants</p>
                <div className='flex gap-3 flex-wrap'>
                  {data.variants.map((v, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1 rounded border ${selectedVariant && selectedVariant._id === v._id ? 'border-primary-200 bg-primary-50 text-primary-600 font-semibold shadow-inner transform scale-105' : 'border-gray-300 hover:border-primary-200 text-gray-600'} transition-all`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          }

          <div className='mt-6'>
            {
              (selectedVariant ? selectedVariant.stock : data.stock) === 0 ? (
                <p className='text-lg text-red-500 font-bold bg-red-50 px-4 py-2 rounded-lg inline-block'>Out of Stock</p>
              )
                : (
                  <div className='w-full max-w-xs'>
                    <AddToCartButton data={data} variantId={selectedVariant ? selectedVariant._id : null} />
                  </div>
                )
            }
          </div>
        </div>

        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <h2 className='font-bold text-lg text-gray-800 mb-4'>Why shop from binkeyit? </h2>
          <div className="grid gap-4">
            <div className='flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors'>
              <img
                src={image1}
                alt='superfast delivery'
                className='w-16 h-16 object-contain'
              />
              <div className='text-sm mt-1'>
                <div className='font-bold text-gray-800 mb-1'>Superfast Delivery</div>
                <p className='text-gray-600 leading-relaxed'>Get your orer delivered to your doorstep at the earliest from dark stores near you.</p>
              </div>
            </div>
            <div className='flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors'>
              <img
                src={image2}
                alt='Best prices offers'
                className='w-16 h-16 object-contain'
              />
              <div className='text-sm mt-1'>
                <div className='font-bold text-gray-800 mb-1'>Best Prices & Offers</div>
                <p className='text-gray-600 leading-relaxed'>Best price destination with offers directly from the nanufacturers.</p>
              </div>
            </div>
            <div className='flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors'>
              <img
                src={image3}
                alt='Wide Assortment'
                className='w-16 h-16 object-contain'
              />
              <div className='text-sm mt-1'>
                <div className='font-bold text-gray-800 mb-1'>Wide Assortment</div>
                <p className='text-gray-600 leading-relaxed'>Choose from 5000+ products across food personal care, household & other categories.</p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4'>
          <div>
            <p className='font-semibold text-gray-800 mb-2'>Description</p>
            <p className='text-gray-600 leading-relaxed'>{data.description}</p>
          </div>
          <div>
            <p className='font-semibold text-gray-800 mb-2'>Unit</p>
            <p className='text-gray-600'>{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, index) => {
              return (
                <div key={index}>
                  <p className='font-semibold text-gray-800 mb-2 capitalize'>{element}</p>
                  <p className='text-gray-600'>{data?.more_details[element]}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
