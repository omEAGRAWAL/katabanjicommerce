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
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])

  console.log(AllSubCategory)

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]


  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
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
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })

      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  return (
    <section className='sticky top-24 lg:top-20 bg-gray-50'>
      <div className='container sticky top-24  mx-auto grid grid-cols-[90px,1fr]  md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr] gap-4 p-4'>
        {/**sub category **/}
        <div className='min-h-[85vh] max-h-[85vh] overflow-y-scroll grid gap-2 shadow-premium bg-white py-4 rounded-xl px-2 scrollbar-none'>
          {
            DisplaySubCatory.map((s, index) => {
              const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
              return (
                <Link to={link} key={s._id + index} className={`w-full p-3 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b border-gray-50 
                  hover:bg-primary-100/10 cursor-pointer rounded-lg transition-all duration-200 group
                  ${subCategoryId === s._id ? "bg-green-50 border-green-200" : ""}
                `}
                >
                  <div className='w-12 h-12 flex-shrink-0 mx-auto lg:mx-0 bg-white rounded-lg p-1 border border-gray-100 group-hover:border-primary-200 transition-colors' >
                    <img
                      src={s.image}
                      alt='subCategory'
                      className='w-full h-full object-scale-down'
                    />
                  </div>
                  <p className={`-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-sm font-medium line-clamp-2 ${subCategoryId === s._id ? "text-green-700 font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>{s.name}</p>
                </Link>
              )
            })
          }
        </div>


        {/**Product **/}
        <div className='sticky top-20'>
          <div className='bg-white shadow-sm p-4 z-10 rounded-xl mb-4 border border-gray-100'>
            <h3 className='font-bold text-xl text-gray-800'>{subCategoryName}</h3>
          </div>
          <div>

            <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative p-1'>
              <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 '>
                {
                  data.map((p, index) => {
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={p._id + "productSubCategory" + index}
                      >
                        <CardProduct
                          data={p}
                        />
                      </motion.div>
                    )
                  })
                }
              </div>
            </div>

            {
              loading && (
                <Loading />
              )
            }

          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
