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
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData((preve) => {
            return [
              ...preve,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalPage)
        console.log(responseData)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  console.log("page", page)

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(preve => preve + 1)
    }
  }

  return (
    <section className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-4 py-6'>
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between sticky top-20 z-10 border border-gray-100">
          <h2 className='font-bold text-lg text-gray-800'>Search Results</h2>
          <span className='bg-primary-100 text-primary-200 px-3 py-1 rounded-full text-sm font-semibold'>{data.length} Items</span>
        </div>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
          className='overflow-hidden p-1'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {
              data.map((p, index) => {
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

            {/***loading data */}
            {
              loading && (
                loadingArrayCard.map((_, index) => {
                  return (
                    <CardLoading key={"loadingsearchpage" + index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>

        {
          //no data 
          !data[0] && !loading && (
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
