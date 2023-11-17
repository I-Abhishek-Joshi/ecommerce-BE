const express = require("express")
const app = express();
const cors = require('cors')
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")


dotenv.config()
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute)

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB connection sucessfull"))
.catch((err) => console.log("error while connecting to db ", err))

app.listen(process.env.PORT, () => {
    console.log("server is running on port", process.env.PORT, "!!!")
})