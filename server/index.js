import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const allowedOrigins = ["http://localhost:5173", "https://real-estate-usfd.onrender.com"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const __dirname = path.resolve();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
