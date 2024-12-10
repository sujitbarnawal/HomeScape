const express = require('express')
const router= express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedIn, isOwner,validateListing} = require('../middleware.js')
const listingController = require('../controllers/listings.js')


router.route('/')
  .get(wrapAsync(index))
  .post(isLoggedIn, validateListing, wrapAsync(listingController.createNew))

  //create new routes
  router.get('/new',isLoggedIn,listingController.new)
  
  // router.post('/',isLoggedIn, validateListing, wrapAsync(listingController.createNew))
  
router.route('/:id')
  .put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.update))
  .delete(isLoggedIn,isOwner,  wrapAsync(listingController.delete))
  .get( wrapAsync(listingController.show))

//index route

// router.get('/', wrapAsync(index))


//edit and update routes
router.get('/:id/edit',isLoggedIn,isOwner, validateListing, wrapAsync(listingController.edit))

// router.put('/:id',isLoggedIn,isOwner, validateListing, wrapAsync(listingController.update))

//Delete Route
// router.delete('/:id',isLoggedIn,isOwner,  wrapAsync(listingController.delete))


//show route
// router.get('/:id', wrapAsync(listingController.show))


module.exports = router
