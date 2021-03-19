/**
 * Handles flash messages - only survives one "round trip".
 *
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {Function} next - next middleware.
 */
export const flashMessages = (req, res, next) => {
  // Flash messages - survives only a round trip.
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  // set the baseURL value and pass it to the views
  const baseURL = process.env.BASE_URL || '/'
  res.locals.baseURL = baseURL

  next()
}

/**
 * Error handler.
 *
 * @param {object} err - error object.
 * @param {object} req - request object.
 * @param {object} res - response object.
 * @param {Function} next - next middleware.
 * @returns {object} - error status and view to render.
 */
export const errorHandler = (err, req, res, next) => {
  // 403 Forbidden
  if (err.status === 403) {
    return res
      .status(403)
      .render('errors/403', { layout: false })
  }

  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .render('errors/404', { layout: false })
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .render('errors/500', { layout: false })
  }

  // render the error page, only during development.
  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
}
