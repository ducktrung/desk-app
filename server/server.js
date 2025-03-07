const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const connectDB = require('./config/db')
const ProductRoutes = require('./routes/productRoutes')


dotenv.config()

const app = express()
const corsOptions = {
    origin: 'http://localhost:3001',  // Chỉ cho phép yêu cầu từ localhost:3001
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Thêm PUT vào methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Các header cho phép
};


connectDB()


app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(express.json())


app.use('/api', ProductRoutes)
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})