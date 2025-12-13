import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { motion } from "framer-motion"

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat)
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

    navigate(url)
    console.log(url)
  }


  return (
    <section className='bg-white min-h-screen'>
      <div className='container mx-auto px-4 pt-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`w-full h-full min-h-48 bg-blue-100 rounded-2xl overflow-hidden shadow-premium ${!banner && "animate-pulse my-2"} `}
        >
          <img
            src={banner}
            className='w-full h-full hidden lg:block object-cover transform hover:scale-105 transition-transform duration-700'
            alt='banner'
          />
          <img
            src={bannerMobile}
            className='w-full h-full lg:hidden object-cover'
            alt='banner'
          />
        </motion.div>
      </div>

      <div className='container mx-auto px-4 my-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-4'>Shop by Category</h3>
        <div className='grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c, index) => {
                return (
                  <div key={index + "loadingcategory"} className='bg-white rounded-xl p-4 min-h-36 grid gap-2 shadow-sm animate-pulse border border-gray-100'>
                    <div className='bg-gray-100 min-h-20 rounded-lg'></div>
                    <div className='bg-gray-100 h-6 rounded w-3/4 mx-auto'></div>
                  </div>
                )
              })
            ) : (
              categoryData.map((cat, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={cat._id + "displayCategory"}
                    className='group cursor-pointer'
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  >
                    <div className='bg-gray-50 rounded-xl p-3 h-32 flex items-center justify-center shadow-sm group-hover:shadow-premium-hover group-hover:-translate-y-1 transition-all duration-300 border border-transparent group-hover:border-primary-100/30'>
                      <img
                        src={cat.image}
                        className='w-full h-full object-scale-down transform group-hover:scale-110 transition-transform duration-300'
                        alt={cat.name}
                      />
                    </div>
                    <p className='text-center text-sm font-medium mt-2 text-gray-900 group-hover:text-primary-200 transition-colors'>{cat.name}</p>
                  </motion.div>
                )
              })
            )
          }
        </div>
      </div>

      <div className='container mx-auto px-4 pb-10 space-y-12'>
        {/***display category product */}
        {
          categoryData?.map((c, index) => {
            return (
              <CategoryWiseProductDisplay
                key={c?._id + "CategorywiseProduct"}
                id={c?._id}
                name={c?.name}
              />
            )
          })
        }
      </div>

    </section>
  )
}

export default Home
