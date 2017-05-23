var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

var Chance = require('chance');
var chance = new Chance();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = require('../models/user');
var User = mongoose.model('User', UserModel.UserSchema);

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in');
    var userInfo = {
      username : req.user.username,
      recipes : req.user.recipes
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.post('/forgotpassword', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('forgotpassword route', req.body);

  User.findOne({ 'username': req.body.username }, function(err, foundUser){
        if(err){
          console.log(err);
          res.sendStatus(500);
        } else {
          var code = chance.string({pool: 'abcdefghijklmnopqrstuvwxyz1234567890', length:20});
          // You 'should' check for collision
          var baseUrl = 'http://localhost:5000/' // Or environment variable
          console.log('Password reset link: ' + baseUrl + '#/confirmreset/' + code );
          // TODO: mail out that link with node mailer NOT to client.

          foundUser.code = code;
          // TODO: Set expiration date.
          // foundUser.expiration = 'some time in the future'

          foundUser.save(function(err, savedGroup){
            if(err){
              console.log(err);
              res.sendStatus(500);
            } else {
              res.send(foundUser);
            }
          });
        }
    });
});

router.put('/resetpassword', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('resetpassword route', req.body);

  User.findOne({ 'username': req.body.username }, function(err, foundUser){
        // TODO: Should also check expiration here and
        // throw 500 if expired.
        var expired = false;

        if(err){
          console.log(err);
          res.sendStatus(500);
        } else if(req.body.code != foundUser.code || expired) {
          res.sendStatus(500);
        } else {
          foundUser.password = req.body.password;
          // foundUser.expiration = 'Set expiration to now'
          foundUser.save(function(err, savedGroup){
            if(err){
              console.log(err);
              res.sendStatus(500);
            } else {
              res.send(foundUser);
            }
          });
        }
    });
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});


module.exports = router;
