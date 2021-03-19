import puppeteer from 'puppeteer'
import axios from 'axios'
import logger from './logger.js'

/**
 * Class representing an instance of a web scraper.
 *
 * @class Scraper
 */
export class Scraper {
  /**
   * Initializes the scraper and creates an instance of Puppeteer.
   *
   * @memberof Scraper
   */
  async init () {
    try {
      this.browser = await puppeteer.launch()
      this.page = await this.browser.newPage()
    } catch (err) {
      console.error(err.message)
    }
  }

  /**
   * Closes the current scraper instance and exits gracefully.
   *
   * @memberof Scraper
   */
  async exit () {
    try {
      await this.browser.close()
    } catch (err) {
      console.error(err.message)
    }
  }

  /**
   * Scrapes all unique links from the provided URL.
   *
   * @param {string} url - The URL to scrape for links.
   * @returns {string[]} - The links that have been scraped.
   * @memberof Scraper
   */
  async getLinks (url) {
    try {
      await this.page.goto(url)
    } catch (err) {
      logger.failure('Could not navigate to the URL: ' + url)
    }

    // scrapes all the links (hrefs) from the URL and destructs them into an array
    const links = await this.page.evaluate(() => Array.from(document.querySelectorAll('li > a')).map(link => link.href))
    return [...new Set(links)]
  }

  /**
   * Scrapes calendar to find which days all friends are available to meet up.
   *
   * @param {string} url - URL to the main calendar page to scrape.
   * @returns {object[]} - The days where all friends are available to meet up.
   * @memberof Scraper
   */
  async scrapeCalendar (url) {
    // get the links to each of the friends' calendars
    const links = await this.getLinks(url)

    // initialize an object to keep track of which friend is available on a certain day
    const day = {
      friday: [],
      saturday: [],
      sunday: []
    }

    // visit each persons calendar and add them to the day-object on the appropriate day if available
    for (const link of links) {
      try {
        await this.page.goto(link)
      } catch (err) {
        logger.failure('Could not navigate to the link: ' + link)
      }

      // the name of the person which calendar is currently being scraped
      const name = await this.page.evaluate(() => document.querySelector('h2').textContent)

      // get the status of each day for the currently evaluated person
      const evaluatedDays = await this.page.evaluate(() => Array.from(document.querySelectorAll('tbody > tr > td')).map(day => day.textContent))

      for (let i = 0; i < evaluatedDays.length; i++) {
        if (evaluatedDays[i].toUpperCase() === 'OK') {
          switch (i) {
            case 0:
              day.friday.push(name)
              break
            case 1:
              day.saturday.push(name)
              break
            case 2:
              day.sunday.push(name)
              break
          }
        }
      }
    }

    const availableDays = []

    // evaluate the days to find which day(s) has all friends available
    for (const key in day) {
      if (day[key].length === links.length) {
        availableDays.push(`${key}`)
      }
    }

    return availableDays
  }

  /**
   * Scrapes movies with tickets available for booking on the specified days.
   *
   * @param {string} url - URL to the movie site.
   * @param {string[]} days - The days which should be checked for available movies.
   * @returns {object[]} - An array containing the available movies.
   * @memberof Scraper
   */
  async scrapeMovies (url, days) {
    try {
      await this.page.goto(url)
    } catch (err) {
      logger.failure('Could not navigate to the URL: ' + url)
    }

    const queryURL = url + '/check'

    // query codes for the days of the week to check for availability
    const friday = '05'
    const saturday = '06'
    const sunday = '07'

    // day, time and movies available for the group of friends to choose from
    let availableMovies = []

    // get all movies that have sites available on the days that suit the group
    for (const day of days) {
      if (day.toUpperCase() === 'FRIDAY') {
        const theMovies = await this._getAvailableMovies(friday, queryURL)
        theMovies.forEach(movie => { movie.day = 'friday' })
        availableMovies = [...availableMovies, ...theMovies]
      } else if (day.toUpperCase() === 'SATURDAY') {
        const theMovies = await this._getAvailableMovies(saturday, queryURL)
        theMovies.forEach(movie => { movie.day = 'saturday' })
        availableMovies = [...availableMovies, ...theMovies]
      } else if (day.toUpperCase() === 'SUNDAY') {
        const theMovies = await this._getAvailableMovies(sunday, queryURL)
        theMovies.forEach(movie => { movie.day = 'sunday' })
        availableMovies = [...availableMovies, ...theMovies]
      }
    }

    return availableMovies
  }

  /**
   * Fetches all the available movies with corresponding start times on the given day(s).
   *
   * @param {string} day - The day which should be checked for availability.
   * @param {string} queryURL - The URL to which we should send the API request.
   * @returns {object[]} - Array of objects containting the available movies.
   * @memberof Scraper
   */
  async _getAvailableMovies (day, queryURL) {
    // according to the movies website, the number of movies displayed is always 3
    const NUMBER_OF_MOVIES = 3

    const movieArray = []

    // object for query params
    const params = {
      day: '',
      movie: ''
    }

    params.day = day

    // check the availability for each movie using an API request to the cinema
    for (let i = 1; i <= NUMBER_OF_MOVIES; i++) {
      params.movie = '0' + i

      try {
        const response = await axios.get(queryURL, { params })
        // querySelector to find the name of the movie
        const queryString = `#movie > option[value="${'0' + i}"]`
        const title = await this.page.evaluate((queryString) => {
          return document.querySelector(queryString).textContent
        }, queryString)

        // if the movie is not fully booked, add it to the array of available movies
        response.data.map(movie => {
          if (movie.status === 1) {
            const newObj = {
              day: movie.day,
              time: movie.time,
              movie: title
            }
            movieArray.push(newObj)
          }
          return 0
        })
      } catch (err) {
        logger.failure(err.message)
      }
    }

    return movieArray
  }

  /**
   * Uses an URL passed in as argument to login to the restaurants booking site and scrapes all available dinner reservation time slots.
   *
   * @param {string} url - URL to the restaurant.
   * @param {string[]} days - The days that should be searched for availability.
   * @returns {string[]} - Array containing the possible reservations.
   * @memberof Scraper
   */
  async scrapeReservations (url, days) {
    try {
      await this.page.goto(url)
    } catch (err) {
      logger.failure('Could not navigate to the URL: ' + url)
    }

    const USERNAME = 'zeke'
    const PASSWORD = 'coys'

    try {
    // fill in the login form and follow the re-direct
      await this.page.type('input[name="username"]', USERNAME)
      await this.page.type('input[name="password"]', PASSWORD)
      await this.page.click('input[value=login]')

      // wait until the booking page has loaded
      await this.page.waitForNavigation()
    } catch (err) {
      logger.failure('Form Error: Could not login to the restaurants site.')
    }

    // at the booking page, parse all available dinner reservations
    const allFreeBookings = await this.page.evaluate(() => Array.from(document.querySelectorAll('div > p > input[name="group1"]')).map(day => day.value))

    // match the data format scraped from the page
    const shortDays = days.map(day => day.substring(0, 3))

    // return only the days that matches the friend groups' schedule
    const matchingBookings = allFreeBookings.filter(booking => {
      return shortDays.indexOf(booking.substring(0, 3).toLowerCase()) >= 0
    })

    return matchingBookings
  }
}
