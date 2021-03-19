import express from 'express'
import hbs from 'express-hbs'
import session from 'express-session'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import { connectDB } from './config/mongodb.js'
import { flashMessages, errorHandler } from './middleware.js'

/**
 * Main function of the app.
 */
const main = async () => {
  await connectDB()

  const app = express()
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // helmet security configuration
  app.use(helmet())
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'style-src': ["'self'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com'] // explicitly allow the required styles
      }
    })
  )

  // morgan
  app.use(logger('dev'))

  // view engine
  app.engine('hbs', hbs.express4({
    defaultLayout: join(directoryFullName, 'views', 'layouts', 'default'),
    partialsDir: join(directoryFullName, 'views', 'partials')
  }))
  app.set('view engine', 'hbs')
  app.set('views', join(directoryFullName, 'views'))

  // parse requests of the content type application/x-www-form-urlencoded.
  // populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }))

  // static files
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // session options
  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false, // re-save even if a request is not changing the session.
    saveUninitialized: false, // don't save a created, but not modified session.
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax'
    }
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
  }

  app.use(session(sessionOptions))
  app.use(flashMessages)

  // load routes
  app.use('/', router)

  app.use(errorHandler)

  app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`)
  })
}

main().catch(console.error)
