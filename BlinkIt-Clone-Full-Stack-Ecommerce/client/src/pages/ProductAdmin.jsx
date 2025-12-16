import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from '../components/EditProductAdmin'

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")
  const [selectCategory, setSelectCategory] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
          category: selectCategory
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page, selectCategory])

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = () => {
    if (page > 1) {
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  const handleCategoryChange = (e) => {
    const { value } = e.target
    setSelectCategory(value)
    setPage(1)
  }

  useEffect(() => {
    let flag = true

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData()
        flag = false
      }
    }, 300);

    return () => {
      clearTimeout(interval)
    }
  }, [search])

  return (
    <section className=''>
      <div className='p-4 bg-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4'>
        <h2 className='font-semibold text-lg'>Product</h2>
        <div className='flex gap-4 w-full md:w-auto items-center flex-col md:flex-row'>
          <select
            value={selectCategory}
            onChange={handleCategoryChange}
            className='w-full md:w-48 bg-blue-50 px-4 py-2 rounded border focus:border-primary-200 outline-none text-sm cursor-pointer'
          >
            <option value="">All Categories</option>
            {allCategory.map((c, index) => {
              return (
                <option value={c._id} key={c._id + index}>{c.name}</option>
              )
            })}
          </select>

          {/* <div className='h-10 min-w-full md:min-w-[300px] w-full md:w-auto bg-blue-50 px-4 flex items-center gap-3 rounded border focus-within:border-primary-200 transition-colors'>
            <IoSearchOutline size={20} className="text-gray-500" />
            <input
              type='text'
              placeholder='Search product here ...'
              className='h-full w-full outline-none bg-transparent text-sm'
              value={search}
              onChange={handleOnChange}
            />
          </div> */}
        </div>
      </div>
      {
        loading && (
          <Loading />
        )
      }


      <div className='p-4 bg-blue-50'>


        <div className='min-h-[55vh]'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {
              productData.map((p, index) => {
                return (
                  <ProductCardAdmin data={p} fetchProductData={fetchProductData} />
                )
              })
            }
          </div>
        </div>

        <div className='flex justify-between my-4'>
          <button onClick={handlePrevious} className="border border-primary-200 px-4 py-1 hover:bg-primary-200">Previous</button>
          <button className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
          <button onClick={handleNext} className="border border-primary-200 px-4 py-1 hover:bg-primary-200">Next</button>
        </div>

      </div>



    </section>
  )
}

export default ProductAdmin
