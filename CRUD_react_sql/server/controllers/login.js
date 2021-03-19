const { OAuth2Client } = require('google-auth-library');
const loginRouter = require('express').Router();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE);
const db = require('../db');
const logger = require('../utils/logger');

loginRouter.post('/google', async (request, response) => {
  const token = request.token;

  const { userId, email } = await verify(token);

  if (!userId) {
    return response.status(401).json({
      error: 'invalid credentials'
    });
  }

  // checks if user exists in the database
  let user = await findUser(userId);

  // registers new user if didn't previously exist
  if (!user) {
    user = {
      id: userId,
      email,
      created_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    insertUser(user);
  }

  response.status(200).send(user.id);
});

// called by the google login route, verifies the user token and deconstructs the userId to be associated with the account
const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_GOOGLE // Specify the CLIENT_ID of the app that accesses the backend
  });

  const payload = ticket.getPayload();

  const userId = payload['sub'];
  const email = payload['email'];

  return { userId, email };
};

verify().catch(console.error);

const findUser = (id) => {
  return new Promise((resolve, reject) => {
    let findUser_sql = 'SELECT * FROM users WHERE id = ?';

    db.conn.query(findUser_sql, id, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result[0]);
    });
  });
};

const insertUser = (user) => {
  return new Promise((resolve, reject) => {
    let saveUser_sql = 'INSERT INTO users SET ?';

    db.conn.query(saveUser_sql, user, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result[0]);
      }
    });
  });
};

module.exports = loginRouter;
