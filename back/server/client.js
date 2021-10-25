const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("morgan");
const session = require("express-session");
const fs = require("fs");
const {resolve, join} = require("path");
const db = require("./db.js")


module.exports = class Client extends express {

    constructor() {
        super();
        this.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']); // Trust Nginx proxy
        const corsOptions = {
            origin: process.env.CORS_URL,
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
            credentials: true,
        };

        this.use(helmet());
        this.use(cors(corsOptions))
        this.use(logger('dev'))
        this.use(express.json())
        this.use(express.urlencoded({extended: false}))
        this.use(session({
            secret: process.env.SECRET,
            name: 'sessionId',
            saveUninitialized: false,
            resave: false,
            cookie: {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // Un mois
            },
        }))

        this.expressRouter = Client.Router()

        fs.readdir('./server/routes', (err, files) => {
            files = files.filter(f => f.split('.').pop() === 'js');
            if (files.length === 0) return console.log('No routes found');
            files.forEach(f => {

                const Route = require(resolve(__dirname, join('./routes/', f)))
                const route = new Route(this)
                let params = ''
                for (let i of route.params) {
                    params += `/:${i.name}${i.needed ? '' : '?'}`
                }

                this.expressRouter.route(route.route + params)
                    .all((req, res, next) => route.validateQuery(req, res, next))
                    [route.method.toLowerCase()](async (req, res) => route.run(req, res));

            })

        })

        this.db = new db({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD
        });

        this.use('/api/', this.expressRouter)
    }

}
