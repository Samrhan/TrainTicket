const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("morgan");
const session = require("express-session");
const fs = require("fs");
const {resolve, join} = require("path");
const db = require("./db.js")
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const puppeteer = require("puppeteer")


module.exports = class Client {

    constructor() {
        this.server = express()
        this.server.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']); // Trust Nginx proxy
        const corsOptions = {
            origin: process.env.CORS_URL,
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
            credentials: true,
        };

        this.server.use(helmet());
        this.server.use(cors(corsOptions))
        this.server.use(logger('dev'))
        this.server.use(express.json())
        this.server.use(express.urlencoded({extended: false}))
        this.server.use(session({
            secret: process.env.SECRET,
            name: 'sessionId',
            saveUninitialized: false,
            resave: false,
            cookie: {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000, // Un mois
            },
        }))

        this.router = express.Router()

        fs.readdir('./server/src/routes', (err, files) => {
            files = files.filter(f => f.split('.').pop() === 'js');
            if (files.length === 0) return console.error('No routes found');
            files.forEach(f => {

                const Route = require(resolve(__dirname, join('./routes/', f)))
                const route = new Route(this)
                let params = route.params.map(e => `/:${e.name}${e.needed ? '' : '?'}`).join('')
                // We register all the routes
                this.router.route(route.route + params)
                    .all((req, res, next) => route.validateQuery(req, res, next))
                    [route.method.toLowerCase()](async () => await route.run());

            })

        })

        this.db = new db({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD
        });

        this.mailgunClient = mailgun.client({
            username: 'api',
            key: process.env.MAILGUNAPI,
            url: 'https://api.eu.mailgun.net'
        });


        this.server.use('/api/', this.router)

    }

    async initPuppeteer() {
        this.browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
        this.page = await this.browser.newPage();
        await this.page.goto(`file://${__dirname}/../../ressources/ticket/ticket_mail.html`, {waitUntil: 'networkidle0'});
    }

    async sendTicket(mail, data) {
        if (!this.browser)
            await this.initPuppeteer()
        await this.page.evaluate((data) => {
            for (let i of Object.keys(data))
                document.getElementById(i.toUpperCase()).innerHTML = data[i]
        }, data)

        let attached = {
            data: await this.page.pdf({format: 'A4'}),
            filename: 'test.pdf'
        }

        await this.mailgunClient.messages.create(process.env.DOMAIN, {
            from: `TrainTicket <noreply@mg.train.sbader.fr>`,
            to: [mail],
            subject: "Votre e-billet",
            text: "Merci pour votre achat, vous trouverez votre E-Billet ci joint",
            attachment: attached
        }).catch(err => console.log(err));
    }

}
