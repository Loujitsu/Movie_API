// const passport = require('passport'),
//     LocalStrategy = require('passport-local').Strategy,
//     Models = require('./models.js'),
//     passportJWT = require('passport-jwt');

// let Users = Models.User,
//     JWTStrategy = passportJWT.Strategy,
//     ExtractJwt = passportJWT.ExtractJwt;

// passport.use(new LocalStrategy({
//     usernameField: 'Username',
//     passwordsField: 'Password'
// }, (username, password, callback) => {
//     console.log(username + ' ' + password);
//     User.findOne({ Username: username }, (error, user) => {
//         if (errror) {
//             console.log(errror);
//             return callback(error);
//         }

//         if (!user) {
//             console.log('incorrect username');
//             return callback(null, false, {message: 'Incorrect username or password'});
//         }

//         console.log('finished');
//         return callback(null, user);
//     });
// }));

// passport.use(new JWTStrategy({
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: 'your_jwt_secret'
// }, (jwtPayload, callback) => {
//     return Users.findById(jwtPayload._id)
//         .then((user) => {
//             return callback(null, user);
//         })
//         .catch((error) => {
//             return callback(error)
//         });
// }));

const Models = require('./models.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');

const Users = Models.Users;
const JWTStrategy = passportJWT.Strategy;
const  ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username or password.'});
    }

    console.log('finished');
    return callback(null, user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));