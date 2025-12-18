import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/connectDB.js";

import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import addressRouter from "./route/address.route.js";
import orderRouter from "./route/order.route.js";

/* ------------------ ESM __dirname FIX ------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------ APP INIT ------------------ */
const app = express();

/* ------------------ MIDDLEWARES ------------------ */
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://js.stripe.com",
          "https://apis.google.com",
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://accounts.google.com",
          "https://apis.google.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "*"],
        fontSrc: ["'self'", "data:"],
      },
    },
  })
);

/* ------------------ API ROUTES ------------------ */
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

/* ------------------ SERVE VITE DIST ------------------ */
// const clientDistPath = path.join(__dirname, "../client/dist");

// app.use(express.static(clientDistPath));

// /* React Router fallback */
// app.get("*", (req, res) => {
//   res.sendFile(path.join(clientDistPath, "index.html"));
// });
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // Self-ping to keep alive
    const SELF_URL = process.env.SELF_URL || `https://katabanjicommerce-2.onrender.com`;


    setInterval(async () => {
      try {
        // await   (`${SELF_URL}/api/ping`);
        // await axios.get(`${SELF_URL}/api/ping`);//run without axios
        await fetch(`${SELF_URL}/api/ping`);

        console.log("Self-ping OK:", new Date().toISOString());
      } catch (err) {
        console.log("Self-ping FAILED:", err.message);
      }
    }, 5 * 60 * 1000); // every 5 minutes


  });
});

