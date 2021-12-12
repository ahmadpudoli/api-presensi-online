'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const db = require('../config/database');
const user_model = require('../app/models/user.model');
const {config_app} = require('../config/application');
let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config_app.secret_jwt;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done){
     try{   
          var user = await user_model.getUserById( jwt_payload.id_user);
          if(user){
               return done(null, user);
          }else{
              return done(null, null);
          }
     }catch(e){
          return done(e, null);
     }
}))