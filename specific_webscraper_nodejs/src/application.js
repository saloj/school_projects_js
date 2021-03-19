import { Scraper } from './scraper.js'
import validator from 'validator'
import colors from 'colors'
import logger from './logger.js'

/**
 * Runs the business logic of the application and executes all the required steps in order.
 *
 * @param {string} url - URL to start scraping.
 */
const run = async (url) => {
  // validate url
  if (!validator.isURL(url) || url.length === 0) {
    logger.failure('URL error: Please try again with a valid URL.')
  }

  // creates an instance of the scraper and initializes it
  const scraper = new Scraper()
  await scraper.init()

  logger.inLine('Scraping links...')
  const scrapedLinks = await scraper.getLinks(url)

  if (scrapedLinks.length === 0) {
    logger.failure('Scraper: Link error. No links found.')
  }

  logger.info('OK')

  let days, movies, dinner

  // start working the 3 tasks: calendar, movies and dinner
  for (const link of scrapedLinks) {
    if (link.toUpperCase().includes('CALENDAR')) {
      logger.inLine('Scraping available days...')

      // scrape the friends' calendars
      days = await scraper.scrapeCalendar(link)

      if (days.length === 0) {
        logger.failure('Scraper: Available days error. No day where all friends are available.')
      }

      logger.info('OK')
    } else if (link.toUpperCase().includes('CINEMA')) {
      logger.inLine('Scraping showtimes...')

      // scrape the movies available to watch on the possible days
      movies = await scraper.scrapeMovies(link, days)

      if (movies.length === 0) {
        logger.failure('Scraper: Showtimes error. No movies available on the possible days.')
      }

      logger.info('OK')
    } else if (link.toUpperCase().includes('DINNER')) {
      logger.inLine('Scraping possible reservations...')

      // scrape the possible reservations
      dinner = await scraper.scrapeReservations(link, days)

      if (dinner.length === 0) {
        logger.failure('Scraper: Reservations error. No available reservations for the given criteria.')
      }

      logger.info('OK')
    }
  }

  await scraper.exit()

  // match the available reservations with the movies
  const analyzedResults = _matchMoviesAndDinner(movies, dinner)

  // print the resulting suggestions to the user
  _printSuggestions(analyzedResults)
}

/**
 * Takes all the scraped movies and dinner reservations fitting the groups schedule, analyzes them and returns suitable suggestions.
 *
 * @param {object[]} movies - Array containing all the suitable movies.
 * @param {string[]} reservations - Array containing all available dinner reservations for the appropriate day(s).
 * @returns {object[]} - An array of objects containing possible matches between movies and dinner.
 */
const _matchMoviesAndDinner = (movies, reservations) => {
  const suggested = []

  // the group wants to have dinner at the earliest 2 hours from when the movie started
  const earliestDinner = movies.map(movie => _getEarliestDinnerTime(movie.time))

  // analyze the reservations to find matching timeslots that align with the movies
  const matchingDinnerStarts = reservations.filter(booking => {
    return earliestDinner.indexOf(_getDinnerStart(booking) >= 0)
  })

  // for every movie, compare the matching dinner times to see if they fit in with the determined criteria. create and add an object containing all necessary data to the array
  for (const movie of movies) {
    for (const booking of matchingDinnerStarts) {
      if ((_compareMovieVsBookingDays(movie.day, booking)) && (_getEarliestDinnerTime(movie.time) <= _getDinnerStart(booking))) {
        suggested.push({
          day: movie.day,
          movieTitle: movie.movie,
          movieTime: movie.time,
          dinnerStart: `${booking.substring(3, 5)}:00`,
          dinnerEnd: `${booking.substring(5, 7)}:00`
        })
      }
    }
  }

  return suggested
}

/**
 * Helper function to compare movie days vs. dinner booking days.
 *
 * @param {string} movieDay - The day of the movie.
 * @param {string} bookingDay - The day of the dinner reservation.
 * @returns {boolean} - Boolean if equal.
 */
const _compareMovieVsBookingDays = (movieDay, bookingDay) => {
  return movieDay.substring(0, 3) === bookingDay.substring(0, 3)
}

/**
 * Helper function to evaluate when the group can have dinner earliest.
 *
 * @param {string} movieTime - When the movie starts.
 * @returns {number} - Integer representing the earliest hour to have dinner.
 */
const _getEarliestDinnerTime = (movieTime) => {
  return parseInt(movieTime.substring(0, 2)) + 2
}

/**
 * Helper function to parse a string to integer. Reads when the dinner starts from the reservation entered.
 *
 * @param {string} time - Dinner string to parse.
 * @returns {number} - Integer representing the entered start time.
 */
const _getDinnerStart = (time) => {
  return parseInt(time.substring(3, 5))
}

/**
 * Prints the requested ouput formatted in the desired way.
 *
 * @param {object[]} suggestions - Array of objects containing all the necessary data for the groups activities.
 */
const _printSuggestions = (suggestions) => {
  logger.info('\nSuggestions')
  logger.info('===========')

  for (const option of suggestions) {
    const day = option.day.substring(0, 1).toUpperCase() + option.day.substring(1, option.day.length)
    const text = `* On ${day}, "${colors.red(option.movieTitle)}" begins at ${option.movieTime}, and there is a free table to book between ${option.dinnerStart}-${option.dinnerEnd}.`

    logger.info(text)
  }
}

export default { run }
