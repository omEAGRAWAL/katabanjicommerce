import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'
import { motion } from "framer-motion"

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)

  // Data tracking
  const [filteredData, setFilteredData] = useState([])
  const [displayedData, setDisplayedData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1) // For infinite scroll logic on local data

  const params = useLocation()
  const searchText = new URLSearchParams(params.search).get('q') || ""

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch ALL products (or a large batch) to enable local search
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: 1,
          limit: 1000,
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
    fetchData()
  }, []) // Fetch once on mount

  useEffect(() => {
    if (!data.length) return

    const searchLower = searchText.toLowerCase()
    const searchTerms = searchLower.split(" ").filter(Boolean)

    // Filter locally
    const results = data.filter(product => {
      const name = product.name?.toLowerCase() || ""
      const description = product.description?.toLowerCase() || ""

      // Check categories and subcategories
      const categoryNames = product.category?.map(c => c.name?.toLowerCase()).join(" ") || ""
      const subCategoryNames = product.subCategory?.map(s => s.name?.toLowerCase()).join(" ") || ""

      const combinedText = `${name} ${description} ${categoryNames} ${subCategoryNames}`

      // Check if EVERY search term is present in the product data (AND logic)
      // Switch to SOME for broader "similar" results if desired, but EVERY is standard for specific queries.
      // Given "similar something available", users might want broad matches. 
      // Let's try matching if ANY term is in the name, OR if ALL terms are in the combined text.
      // Actually, standard partial match: verify if the search text is a substring of combined text? 
      // Or checking words.

      // Implementation: Check if match 
      const match = searchTerms.every(term => combinedText.includes(term))
      return match
    })

    setFilteredData(results)

    // Reset display for new search
    setDisplayedData(results.slice(0, 15))
    setPage(1)
    setHasMore(results.length > 15)

  }, [searchText, data])

  const handleFetchMore = () => {
    const nextPage = page + 1
    const itemsPerPage = 15
    const endIndex = nextPage * itemsPerPage

    const newDisplayData = filteredData.slice(0, endIndex)

    setDisplayedData(newDisplayData)
    setPage(nextPage)

    if (newDisplayData.length >= filteredData.length) {
      setHasMore(false)
    }
  }

  return (
    <section className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-4 py-6'>
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between sticky top-20 z-10 border border-gray-100">
          <h2 className='font-bold text-lg text-gray-800'>Search Results</h2>
          <span className='bg-primary-100 text-primary-200 px-3 py-1 rounded-full text-sm font-semibold'>{filteredData.length} Items</span>
        </div>

        <InfiniteScroll
          dataLength={displayedData.length}
          hasMore={hasMore}
          next={handleFetchMore}
          loader={
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {loading && loadingArrayCard.map((_, index) => <CardLoading key={"loadingsearchpage" + index} />)}
            </div>
          }
          className='overflow-hidden p-1'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {
              displayedData.map((p, index) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={p?._id + "searchProduct" + index}
                  >
                    <CardProduct data={p} />
                  </motion.div>
                )
              })
            }
          </div>
        </InfiniteScroll>

        {
          //no data 
          !filteredData[0] && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex flex-col justify-center items-center w-full mx-auto py-20'
            >
              <img
                src={noDataImage}
                className='w-full max-w-xs block opacity-80'
                alt="No data found"
              />
              <p className='font-bold text-xl my-4 text-gray-700'>No results found</p>
              <p className='text-gray-600'>Try searching for something else</p>
            </motion.div>
          )
        }
      </div>
    </section>
  )
}

export default SearchPage
