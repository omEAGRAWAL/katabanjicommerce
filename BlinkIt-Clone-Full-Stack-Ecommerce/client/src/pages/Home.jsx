// import React from 'react'
// import banner from '../assets/banner.jpg'
// import bannerMobile from '../assets/banner-mobile.jpg'
// import { useSelector } from 'react-redux'
// import { valideURLConvert } from '../utils/valideURLConvert'
// import { Link, useNavigate } from 'react-router-dom'
// import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
// import { motion } from "framer-motion"

// const Home = () => {
//   const loadingCategory = useSelector(state => state.product.loadingCategory)
//   const categoryData = useSelector(state => state.product.allCategory)
//   const subCategoryData = useSelector(state => state.product.allSubCategory)
//   const navigate = useNavigate()

//   const handleRedirectProductListpage = (id, cat) => {
//     console.log(id, cat)
//     const subcategory = subCategoryData.find(sub => {
//       const filterData = sub.category.some(c => {
//         return c._id == id
//       })

//       return filterData ? true : null
//     })
//     const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

//     navigate(url)
//     console.log(url)
//   }


//   return (

//     <section className='bg-white min-h-screen pb-20'>
//       {/** Location & Search Mobile Placeholder - actually handled in Header but spacing needed */}
//       <div className='lg:hidden h-2'></div>

//       {/** Banner Section - Replacing grid with single promo banner */}
//       <div className='container mx-auto px-2 mt-1'>
//         <div className={`w-full  lg:h-64 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl overflow-hidden relative shadow-sm ${!banner && "animate-pulse"}`}>
//           <img
//             src={banner}
//             className='w-full h-full object-cover hidden lg:block'
//             alt='banner' />
//           <img
//             src={banner}
//             className='w-full h-full object-cover lg:hidden'
//             alt='banner'
//           />
//           {/* Placeholder for "Shop Now" text overlay if needed, but assuming image has it */}
//           {/* <div className='absolute bottom-4 left-4'>
//                          <button className='bg-black text-white px-4 py-2 rounded-full font-bold text-sm'>Shop Now</button>
//                     </div> */}
//         </div>
//       </div>

//       {/** Circular Categories Section */}
//       <div className='container mx-auto px-4 mt-8'>
//         <div className='flex items-center justify-between mb-4'>
//           <h3 className='text-lg font-bold text-gray-900'>Shop by Category</h3>
//           {/* <Link to="/categories" className='text-green-600 text-sm font-semibold'>See All</Link> */}
//         </div>

//         <div className='flex gap-4 overflow-x-auto scrollbar-none pb-4'>
//           {
//             loadingCategory ? (
//               new Array(10).fill(null).map((c, index) => (
//                 <div key={index + "loading"} className='flex flex-col items-center gap-2 min-w-[80px]'>
//                   <div className='w-16 h-16 bg-gray-100 rounded-full animate-pulse'></div>
//                   <div className='w-12 h-3 bg-gray-100 rounded animate-pulse'></div>
//                 </div>
//               ))
//             ) : (
//               categoryData.map((cat, index) => (
//                 <motion.div
//                   key={cat._id + "display"}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                   className='flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group'
//                   onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
//                 >
//                   <div className='w-16 h-16 bg-blue-50/50 rounded-full flex items-center justify-center  border border-gray-100 group-hover:border-primary-100 transition-colors shadow-sm overflow-hidden'>
//                     <img
//                       src={cat.image}
//                       className='w-full h-full '
//                       alt={cat.name}
//                     />
//                   </div>
//                   <p className='text-sm font-semibold text-center text-gray-700 leading-tight w-20 break-words line-clamp-2'>{cat.name}</p>
//                 </motion.div>
//               ))
//             )
//           }
//         </div>
//       </div>

//       {/** Product Sections */}
//       <div className='container mx-auto px-4 space-y-8 mt-4'>
//         {
//           categoryData?.map((c, index) => (
//             <div key={c?._id + "CategoryProductSection"} className={`${index === 0 ? "pt-2" : ""}`}>
//               <CategoryWiseProductDisplay
//                 id={c?._id}
//                 name={c?.name}
//                 index={index} // Making sure to pass index if needed for specific logic
//               />
//             </div>
//           ))
//         }
//       </div>

//     </section>
//   )
// }

// export default Home
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
    <section className='bg-gradient-to-b from-gray-50 to-white min-h-screen pb-20'>
      {/* Hero Banner Section */}
      <div className='container mx-auto px-4  md:pt-6'>
        <div className='relative w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'>
          {/* Desktop Banner */}
          <div className='hidden lg:block'>
            <img
              src={banner}
              className='w-full h-[320px] object-cover'
              alt='banner'
            />
          </div>

          {/* Mobile Banner */}
          {/* <div className='lg:hidden'>
            <img
              src={banner}
              className='w-full h-[160px] object-cover'
              alt='banner'
            />
          </div> */}
        </div>
      </div>

      {/* Categories Section */}
      <div className='container mx-auto px-4 mt-2 md:mt-12'>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h2 className='text-xl md:text-2xl font-bold text-gray-900'>Shop by Category</h2>
          </div>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-3 gap-2 md:gap-3'>
          {loadingCategory ? (
            new Array(12).fill(null).map((c, index) => (
              <div key={index + "loading"} className='bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse h-[15vh] min-h-[120px]'>
                <div className='h-[70%] bg-gray-200'></div>
                <div className='p-2 h-[30%] flex items-center justify-center'>
                  <div className='h-3 bg-gray-200 rounded w-2/3'></div>
                </div>
              </div>
            ))
          ) : (
            categoryData.map((cat, index) => (
              <div
                key={cat._id + "display"}
                className='bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group shadow-lg border-emerald-300 transition-all duration-300 h-[15vh] min-h-[120px] flex flex-col'
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
              >
                {/* Image Container */}
                <div className='h-[70%] rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-2 md:p-3 relative overflow-hidden group-hover:from-emerald-50 group-hover:to-emerald-100 transition-all duration-300'>
                  <img
                    src={cat.image}
                    className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300'
                    alt={cat.name}
                  />
                  {/* "+X more" badge */}
                  <div className='absolute top-1 left-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[10px] md:text-xs font-semibold text-gray-700 shadow-sm'>
                    +10 more
                  </div>
                </div>

                {/* Category Name */}
                <div className='p-1.5 md:p-2 text-center h-[30%] flex items-center justify-center'>
                  <p className='text-[11px] md:text-xs font-bold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2'>
                    {cat.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Special Offers Banner - Optional */}
      {/* <div className='container mx-auto px-4 mt-8'>
        <div className='bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 md:p-8 text-white shadow-lg'>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div>
              <h3 className='text-xl md:text-2xl font-bold mb-2'>🎉 Special Offers Today!</h3>
              <p className='text-white/90 text-sm md:text-base'>Get up to 50% off on selected items</p>
            </div>
            <button className='bg-white text-orange-600 hover:bg-gray-100 px-6 py-2.5 rounded-lg font-bold transition-colors shadow-md active:scale-95'>
              View Offers
            </button>
          </div>
        </div>
      </div> */}

      {/* Products by Category Sections */}
      <div className='mt-8 md:mt-12 space-y-8 md:space-y-12 pl-2 pr-2'>
        {categoryData?.map((c, index) => (
          <div
            key={c?._id + "CategoryProductSection"}
            className='bg-white'
          >
            <CategoryWiseProductDisplay
              id={c?._id}
              name={c?.name}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Why Choose Us Section - Optional */}
      <div className='container mx-auto px-4 mt-16 mb-8'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
          <div className='bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='text-3xl mb-3'>⚡</div>
            <h4 className='font-bold text-gray-900 mb-1'>Fast Delivery</h4>
            <p className='text-xs text-gray-500'>In 12 minutes</p>
          </div>
          <div className='bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='text-3xl mb-3'>🌟</div>
            <h4 className='font-bold text-gray-900 mb-1'>Best Quality</h4>
            <p className='text-xs text-gray-500'>Fresh products</p>
          </div>
          <div className='bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='text-3xl mb-3'>💰</div>
            <h4 className='font-bold text-gray-900 mb-1'>Best Prices</h4>
            <p className='text-xs text-gray-500'>Lowest rates</p>
          </div>
          <div className='bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='text-3xl mb-3'>🎁</div>
            <h4 className='font-bold text-gray-900 mb-1'>Daily Offers</h4>
            <p className='text-xs text-gray-500'>Great deals</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home