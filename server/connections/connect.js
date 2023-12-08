const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log("Database Server Connected")
    } catch (error) {
        console.log("ERROR: " + error.message )
    }
}

module.exports = connectDB