/**
 * Module for the UsersController.
 */

import { User } from '../models/user.js'

/**
 * Encapsulates a controller.
 */
export class UsersController {
  /**
   * Returns a HTML form for logging in.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async login (req, res, next) {
    // user should not be able to access this if already signed in
    if (req.session.user || req.session.signedIn) {
      req.session.flash = { type: 'success', text: 'You are already signed in!' }
      res.redirect(process.env.BASE_URL)
    } else {
      res.render('users/loginform')
    }
  }

  /**
   * Attempts to authenticate the current user, will result in login if successful.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async authenticate (req, res, next) {
    const { username, password } = req.body

    try {
      const user = await User.authenticate(username, password)

      // regenerate the session and redirect the user
      req.session.regenerate(() => {
        req.session.signedIn = true
        req.session.user = user.username
        req.session.flash = { type: 'success', text: 'Login successful!' }

        res.redirect(process.env.BASE_URL)
      })
    } catch (error) {
      req.session.flash = { type: 'negative', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Returns a HTML form for registering a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - next middleware.
   */
  async new (req, res, next) {
    // user should not be able to access this if already signed in
    if (req.session.user || req.session.signedIn) {
      req.session.flash = { type: 'success', text: 'You are already signed in!' }
      res.redirect(process.env.BASE_URL)
    } else {
      res.render('users/registerform')
    }
  }

  /**
   * Creates a new user.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   */
  async register (req, res) {
    const { username, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      req.session.flash = { type: 'negative', text: 'Passwords do not match.' }
      res.redirect('./new')
      return
    }

    try {
      const user = new User({
        username,
        password,
        date: new Date()
      })

      await user.save()

      req.session.flash = { type: 'success', text: 'Registration successful!' }

      res.redirect('./login')
    } catch (error) {
      req.session.flash = { type: 'negative', text: error.message }
      res.redirect('./new')
    }
  }

  /**
   * Logs the current user out from the application.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async logout (req, res, next) {
    try {
      // user should receive a 404 if not signed in
      await User.isSignedIn(req.session.user, req.session.signedIn)

      req.session.destroy(() => {
        res.redirect(process.env.BASE_URL)
      })
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        next(error)
      } else {
        req.session.flash = { type: 'negative', text: error.message }
        res.redirect('.')
      }
    }
  }
}
