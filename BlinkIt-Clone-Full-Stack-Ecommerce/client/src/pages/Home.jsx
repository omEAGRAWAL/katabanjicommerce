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

    <section className='bg-white min-h-screen pb-20'>
      {/** Location & Search Mobile Placeholder - actually handled in Header but spacing needed */}
      <div className='lg:hidden h-2'></div>

      {/** Banner Section - Replacing grid with single promo banner */}
      <div className='container mx-auto px-4 mt-4'>
        <div className={`w-full h-40 lg:h-64 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl overflow-hidden relative shadow-sm ${!banner && "animate-pulse"}`}>
          <img
            src={banner}
            className='w-full h-full object-cover hidden lg:block'
            alt='banner'
          />
          <img
            src={bannerMobile}
            className='w-full h-full object-cover lg:hidden'
            alt='banner'
          />
          {/* Placeholder for "Shop Now" text overlay if needed, but assuming image has it */}
          {/* <div className='absolute bottom-4 left-4'>
                         <button className='bg-black text-white px-4 py-2 rounded-full font-bold text-sm'>Shop Now</button>
                    </div> */}
        </div>
      </div>

      {/** Circular Categories Section */}
      <div className='container mx-auto px-4 mt-8'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-bold text-gray-900'>Shop by Category</h3>
          {/* <Link to="/categories" className='text-green-600 text-sm font-semibold'>See All</Link> */}
        </div>

        <div className='flex gap-4 overflow-x-auto scrollbar-none pb-4'>
          {
            loadingCategory ? (
              new Array(10).fill(null).map((c, index) => (
                <div key={index + "loading"} className='flex flex-col items-center gap-2 min-w-[80px]'>
                  <div className='w-16 h-16 bg-gray-100 rounded-full animate-pulse'></div>
                  <div className='w-12 h-3 bg-gray-100 rounded animate-pulse'></div>
                </div>
              ))
            ) : (
              categoryData.map((cat, index) => (
                <motion.div
                  key={cat._id + "display"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group'
                  onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                >
                  <div className='w-20 h-20 bg-blue-50/50 rounded-full flex items-center justify-center p-3 border border-gray-100 group-hover:border-primary-100 transition-colors shadow-sm overflow-hidden'>
                    <img
                      src={cat.image}
                      className='w-full h-full object-scale-down group-hover:scale-110 transition-transform duration-300'
                      alt={cat.name}
                    />
                  </div>
                  <p className='text-xs font-semibold text-center text-gray-700 leading-tight w-20 break-words line-clamp-2'>{cat.name}</p>
                </motion.div>
              ))
            )
          }
        </div>
      </div>

      {/** Product Sections */}
      <div className='container mx-auto px-4 space-y-8 mt-4'>
        {
          categoryData?.map((c, index) => (
            <div key={c?._id + "CategoryProductSection"} className={`${index === 0 ? "pt-2" : ""}`}>
              <CategoryWiseProductDisplay
                id={c?._id}
                name={c?.name}
                index={index} // Making sure to pass index if needed for specific logic
              />
            </div>
          ))
        }
      </div>

    </section>
  )
}

export default Home
