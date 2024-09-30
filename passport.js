const passport = require('passport'), // Main passport library
  LocalStrategy = require('passport-local').Strategy, // Passport strategy for authentication
  Models = require('./models.js'),
  passportJWT = require('passport-jwt'); // Passport strategy for JWT authentication

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;


 // Defining "LocalStrategy" (HTTP authentication for login request) 
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({Username: username})
      .then((user) => {
        if(!user) {
          console.log('Incorrect username');
          return callback(null,false, {message: 'Incorrect username or password!'});
        }
        if(!user.validatePassword(password)) {
          console.log('Wrong password!');
          return callback(null, false, {message:'Wrong password!'});
        }
        console.log('finished');
        return callback(null, user);
      })
      .catch((error) => {
        if(error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);

// JWT authentication code - verifying the token
passport.use(
  new JWTStrategy(
    {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret' // Secret key to verify signature of JWT
}, async (jwtPayload, callback) => {
  return await Users.findById(jwtPayload._id)
  .then((user) => {
    return callback(null, user);
  })
  .catch((error) => {
    return callback(error)
  });
}));




