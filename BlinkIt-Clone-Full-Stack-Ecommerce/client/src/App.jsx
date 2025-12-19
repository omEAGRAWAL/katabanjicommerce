import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNavigation from "./components/BottomNavigation";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";
// import { handleAddItemCart } from "./store/cartProduct";
import GlobalProvider from "./provider/GlobalProvider";
// import { FaCartShopping } from "react-icons/fa6";
import CartMobileLink from "./components/CartMobile";
import InstallAppButton from "./components/InstallAppButton";
import LoginPromptModal from "./components/LoginPromptModal";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state?.user);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    if (userData?.data) {
      dispatch(setUserDetails(userData.data));
    }
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(
          setAllCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(
          setAllSubCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
    // fetchCartItem()
  }, []);

  // Show login prompt for non-logged in users after a delay
  useEffect(() => {
    // Don't show on login or register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
      return;
    }

    // Check if user is not logged in
    if (!user._id) {
      // Show modal after 2 seconds delay
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, location.pathname]);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh] pb-32 lg:pb-0">
        <Outlet />
      </main>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />

      {/* <Toaster /> */}
      {/* {location.pathname !== "/checkout" && <CartMobileLink />} */}
      <>
        {/* <InstallAppButton /> */}
        {/* rest of your app */}
      </>
      {/* <BottomNavigation /> */}
    </GlobalProvider>
  );
}

export default App;
