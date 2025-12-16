import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { motion } from "framer-motion"

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCategory, setDisplaySubCategory] = useState([])

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]

  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page,
          limit: 8,
        }
      })

      const { data: responseData } = response
      if (responseData.success) {
        setData(responseData.page === 1 ? responseData.data : [...data, ...responseData.data])
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s =>
      s.category.some(el => el._id === categoryId)
    )
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  return (
    <section className='sticky top-24 lg:top-20 bg-[#f7f8fa]'>
      <div className='grid grid-cols-[72px,1fr] md:grid-cols-[110px,1fr] lg:grid-cols-[140px,1fr]'>

        {/* SUB CATEGORY SIDEBAR */}
        <div className='min-h-[88vh] max-h-[88vh] overflow-y-auto bg-white border-r border-gray-200 scrollbar-none'>
          {DisplaySubCategory.map((s, index) => {
            const link = `/${valideURLConvert(s.category[0].name)}-${s.category[0]._id}/${valideURLConvert(s.name)}-${s._id}`

            return (
              <Link
                to={link}
                key={s._id + index}
                className={`flex flex-col items-center py-3 px-1 transition
                  ${subCategoryId === s._id
                    ? "bg-green-50 border-r-4 border-green-600"
                    : "hover:bg-gray-50"}
                `}
              >
                <div className={`w-10 h-10 rounded-full p-1 border
                  ${subCategoryId === s._id ? "bg-white border-green-200" : "bg-gray-100 border-gray-200"}
                `}>
                  <img
                    src={s.image}
                    alt={s.name}
                    className='w-full h-full object-contain rounded-full'
                  />
                </div>
                <p className={`text-[10px] text-center leading-tight line-clamp-2 mt-1
                  ${subCategoryId === s._id ? "font-semibold text-green-700" : "text-gray-600"}
                `}>
                  {s.name}
                </p>
              </Link>
            )
          })}
        </div>

        {/* PRODUCT LIST */}
        <div className='bg-[#f7f8fa] px-3 py-4'>
          <div className='bg-white rounded-lg px-3 py-2 mb-3 border border-gray-200'>
            <h3 className='font-semibold text-lg text-gray-800'>
              {subCategoryName}
            </h3>
          </div>

          <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto scrollbar-none pb-24'>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-fr items-stretch'>
              {data.map((p, index) => (
                <motion.div
                  key={p._id + index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className='h-full'
                >
                  <CardProduct data={p} />
                </motion.div>
              ))}
            </div>

            {loading && <Loading />}
          </div>
        </div>

      </div>
    </section>
  )
}

export default ProductListPage
