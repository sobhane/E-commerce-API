require("dotenv").config();
require("express-async-errors");
//router
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const OrderRouter = require("./routes/orderRoutes");

const express = require("express");
//database
const connectDB = require("./db/connect");
//Erorr handlers
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFounds = require("./middleware/not-found");

const { authenticatedUser } = require("./middleware/authentication");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLImiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(
  rateLImiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

app.use("/api/v1/orders", OrderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticatedUser, userRouter);

app.use(notFounds);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    app.listen(PORT, console.log(`Server is listening to port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
