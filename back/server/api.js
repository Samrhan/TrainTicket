const express = require('express')
const router = express.Router()
const mysql = require("mysql2/promise")
const {join, resolve} = require('path');

const dotenv = require('dotenv')
const fs = require("fs");
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
fs.readdir('./server/routes', (err, files) => {
    files = files.filter(f => f.split('.').pop() === 'js');
    if (files.length === 0) return console.log('No routes found');
    files.forEach(f => {

        const Route = require(resolve(__dirname, join('./routes/', f)))
        const route = new Route(client)
        let params = ''
        for (let i of route.params) {
            params += `/:${i.name}${i.needed ? '' : '?'}`
        }

        router.route(route.route + params)
            .all((req, res, next) => route.validateQuery(req, res, next))
            [route.method.toLowerCase()](async (req, res) => route.run(req, res));

    })

})

module.exports = router
