
/**
 * Error handler for when an action failed.
 *
 * @param {string} message - Text to include in the error message.
 */
const failure = (message) => {
  console.error('FAILURE')
  throw new Error(message)
}

/**
 * Outputs the passed in message to the console.
 *
 * @param {string} message - Text to output.
 */
const info = (message) => {
  if (message.length > 0) {
    console.log(message)
  }
}

/**
 * Outputs the passed in message in-line. Any subsequent console.log will appear on the same line.
 *
 * @param {string} message - Text to output.
 */
const inLine = (message) => {
  if (message.length > 0) {
    process.stdout.write(message)
  }
}

export default { failure, info, inLine }
