const router = require('express').Router()
const {where} = require('sequelize')

//master Model
const masterlist = require('../db/models/masterlist.model')

const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));







module.exports = router;