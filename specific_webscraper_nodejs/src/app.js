import application from './application.js'

/**
 * Main function of the app. Executes the application.
 *
 */
const main = async () => {
  try {
    const [,, url] = process.argv

    await application.run(url)
  } catch (err) {
    console.error(err.message)
    process.exit()
  }
}

main()
