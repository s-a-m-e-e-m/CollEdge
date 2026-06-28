const express = require('express')
const { signUp, signIn, signOut, getloggedInUser } = require('../controllers/user.controller')

const router = express.Router()

// user routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.delete('/signout', signOut);
router.get('/get', getloggedInUser);

// task routes
router

module.exports = router