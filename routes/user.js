const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const { saveredirectURL } = require('../middleware.js')
const userController = require('../controllers/users.js')


router.route('/signup')
    .get(userController.signup )
    .post( wrapAsync(userController.signupUser))

router.route('/login')
    .get(userController.login)
    .post(saveredirectURL, passport.authenticate('local',{failureRedirect: '/login',failureFlash: true}) ,wrapAsync(userController.loginUser))

//signup
// router.get('/signup',userController.signup )

// router.post('/signup', wrapAsync(userController.signupUser))

//login

// router.get('/login',userController.login)

// router.post('/login',saveredirectURL, passport.authenticate('local',{failureRedirect: '/login',failureFlash: true}) ,wrapAsync(userController.loginUser))

//logout

router.get('/logout',userController.logout)

module.exports = router