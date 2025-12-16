import { useForm } from "react-hook-form";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from "../provider/GlobalProvider";
import { motion } from "framer-motion"

const AddAddress = ({ close }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      addressline: "",
      city: "Kantabanji",
      state: "Orissa",
      pincode: "767039",
      country: "India",
      mobile: "",
      name: "",
      landmark: "",
      area: ""
    }
  });
  const { fetchAddress } = useGlobalContext();

  const onSubmit = async (data) => {
    console.log("data", data);

    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          name: data.name,
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
          landmark: data.landmark,
          area: data.area,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 right-0 bottom-0 z-50 h-screen overflow-auto flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-8 w-full max-w-lg mx-auto rounded-2xl shadow-xl relative"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
          <h2 className="font-bold text-xl text-gray-800">Add New Address</h2>
          <button onClick={close} className="hover:text-red-500 text-gray-400 transition-colors p-1 rounded-full hover:bg-gray-50">
            <IoClose size={24} />
          </button>
        </div>
        <div className="mb-6">
          <button
            type="button"
            className="w-full text-sm font-semibold bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 flex items-center justify-center gap-2 transition-colors border border-green-100"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords
                  const latInput = document.getElementById("lat");
                  const lonInput = document.getElementById("lon");
                  if (latInput) latInput.value = latitude;
                  if (lonInput) lonInput.value = longitude;
                  toast.success("Location fetched!");
                }, (error) => {
                  toast.error("Failed to get location: " + error.message);
                })
              } else {
                toast.error("Geolocation is not supported by this browser.");
              }
            }}
          >
            📍 Use Current Location
          </button>
        </div>
        <form className="grid gap-5" onSubmit={handleSubmit(async (data) => {
          const lat = document.getElementById("lat")?.value;
          const lon = document.getElementById("lon")?.value;

          try {
            const response = await Axios({
              ...SummaryApi.createAddress,
              data: {
                name: data.name,
                address_line: data.addressline,
                city: data.city,
                state: data.state,
                country: data.country,
                pincode: data.pincode,
                mobile: data.mobile,
                landmark: data.landmark,
                area: data.area,
                lat: lat,
                lon: lon
              },
            });

            const { data: responseData } = response;

            if (responseData.success) {
              toast.success(responseData.message);
              if (close) {
                close();
                reset();
                fetchAddress();
              }
            }
          } catch (error) {
            AxiosToastError(error);
          }
        })}>
          <input type="hidden" id="lat" />
          <input type="hidden" id="lon" />

          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm font-semibold text-gray-800">Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
              {...register("name", { required: true })}
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="addressline" className="text-sm font-semibold text-gray-800">Address Line</label>
            <input
              type="text"
              id="addressline"
              placeholder="House No, Building, Street"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
              {...register("addressline", { required: true })}
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="area" className="text-sm font-semibold text-gray-800">Area</label>
            <input
              type="text"
              id="area"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
              {...register("area")}
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="landmark" className="text-sm font-semibold text-gray-800">Landmark</label>
            <input
              type="text"
              id="landmark"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
              {...register("landmark")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label htmlFor="city" className="text-sm font-semibold text-gray-800">City</label>
              <input
                type="text"
                id="city"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
                {...register("city", { required: true })}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="state" className="text-sm font-semibold text-gray-800">State</label>
              <input
                type="text"
                id="state"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
                {...register("state", { required: true })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label htmlFor="pincode" className="text-sm font-semibold text-gray-800">Pincode</label>
              <input
                type="text"
                id="pincode"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
                {...register("pincode", { required: true })}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="country" className="text-sm font-semibold text-gray-800">Country</label>
              <input
                type="text"
                id="country"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
                {...register("country", { required: true })}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="mobile" className="text-sm font-semibold text-gray-800">Mobile No.</label>
            <input
              type="text"
              id="mobile"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary-200 focus:ring-2 focus:ring-primary-200/20 transition-all font-semibold"
              {...register("mobile", { required: true })}
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-primary-200 to-primary-100 w-full py-3 rounded-lg font-bold mt-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-white"
          >
            Save Address
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default AddAddress;
