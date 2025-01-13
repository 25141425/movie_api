const jwtSecret = process.env.SecretKey; // Needs to be the same key used in JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

// user.Username - username that's encoded in the JWT
// alogrithm:'H256' - algorithm used to sign or encode the values of the JWT
/**
 * Generates a JWT token for the authenticated user.
 * 
 * @param {Object} user - The user object, containing at least _id and Username.
 * @returns {string} The generated JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(
    { _id: user._id, Username: user.Username }, // Putting only userId and username inside token to hide sensitive data
    jwtSecret, 
    { subject: user.Username, expiresIn: '7d', algorithm: 'HS256' }
  );
};


/**
 * POST route to handle user login and return a JWT token upon successful authentication.
 * 
 * This route uses passport authentication with the 'local' strategy to verify the user's credentials.
 * If the authentication is successful, a JWT token is generated and returned in the response along with
 * the user object.
 * 
 * @param {Object} router - The Express router object to define the route.
 * @returns {void} Sends a JSON response containing the user data and JWT token on success, or an error message on failure.
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}
  