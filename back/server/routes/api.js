const express = require('express')
const router = express.Router()
const mysql = require("mysql2/promise")

const dotenv = require('dotenv')
dotenv.config()

const client = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: "liveefrei",
    password: process.env.DB_PASSWORD
});

/**
 * Middleware pour vérifier si l'utilistateur a les droits d'admin
 */

let auth_restricted_route = async function (req, res, next) {
    if (req.session.userId) {
        next()
    } else {
        res.status(401).json({message: "Vous ne pouvez pas utiliser cette route"}).send();
    }
}

router.post("/login", async (req, res) => require('./login.js')(req, res, client))
router.post("/disconnect", (req, res) => require('./disconnect.js')(req, res, client))
router.get("/me", async (req, res) => require('./me.js')(req, res, client))
router.get('/test', async (req, res) => {
    res.status(200).json({message: "ok"});
})
router.get('/search/:from/:to/:datetime?', async (req,res)=>require('./search.js')(req,res))
router.get("/trainstation/:query?", async (req, res) => require('./trainstation.js')(req, res))
router.get("/address/:query?", async (req, res) => require('./address.js')(req, res))

module.exports = router
