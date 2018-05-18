const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const User = require('@model').User;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  User.findById(jwt_payload.id).then(user => {
    if(user){
      next (null, user);
    } else {
      next(null,null);
    }
  })
    .catch(err => {
      next(err);
    });
});

passport.use(strategy);

const getToken = (payload) => { 
  return jwt.sign(payload, jwtOptions.secretOrKey);
};

const checkAdmin = (req,res,next) =>{
  if(req.user.role && req.user.role === 'admin')
    next();
  else
    res.status(400).send({error: 'no access'});
};
module.exports = {
  passport,
  getToken,
  checkAdmin,  
};