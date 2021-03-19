import mongoose from 'mongoose'

/**
 * Establishes a database connection.
 *
 */
export const connectDB = async () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.error('error connecting to MongoDB', error.message)
    })

  // if the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })
}
