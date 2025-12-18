import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == id
            })

            return filterData ? true : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

        return url
    }

    const redirectURL = handleRedirectProductListpage()

    return (
        <div className='py-4'>
            {/* Header Section */}
            <div className='container mx-auto px-4 mb-3 flex items-center justify-between gap-4'>
                <h3 className='font-bold text-base md:text-lg lg:text-xl text-gray-900 truncate'>
                    {name}
                </h3>
                <Link
                    to={redirectURL}
                    className='text-emerald-600 hover:text-emerald-500 font-semibold text-sm md:text-base whitespace-nowrap active:scale-95 transition-transform touch-manipulation'
                >
                    See All
                </Link>
            </div>

            {/* Products Scroll Container */}
            <div className='relative'>
                <div
                    className='flex gap-3 md:gap-4 lg:gap-5 container mx-auto px-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory'
                    ref={containerRef}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <div
                                    key={"CategorywiseProductDisplay123" + index}
                                    className='flex-none w-[160px] md:w-[200px] lg:w-[220px] snap-start'
                                >
                                    <CardLoading />
                                </div>
                            )
                        })
                    }

                    {
                        data.map((p, index) => {
                            return (
                                <div
                                    key={p._id + "CategorywiseProductDisplay" + index}
                                    className='flex-none w-[160px] md:w-[200px] lg:w-[220px] snap-start'
                                >
                                    <CardProduct data={p} />
                                </div>
                            )
                        })
                    }

                    {/* Spacer for better scroll ending */}
                    {data.length > 0 && <div className='flex-none w-1'></div>}
                </div>

                {/* Desktop Navigation Buttons */}
                <div className='w-full left-0 right-0 container mx-auto px-2 absolute top-1/2 -translate-y-1/2 hidden lg:flex justify-between pointer-events-none'>
                    <button
                        onClick={handleScrollLeft}
                        className='pointer-events-auto z-10 bg-white hover:bg-gray-50 active:bg-gray-100 shadow-lg text-lg p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95'
                    >
                        <FaAngleLeft />
                    </button>
                    <button
                        onClick={handleScrollRight}
                        className='pointer-events-auto z-10 bg-white hover:bg-gray-50 active:bg-gray-100 shadow-lg p-3 text-lg rounded-full transition-all duration-200 hover:scale-110 active:scale-95'
                    >
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay