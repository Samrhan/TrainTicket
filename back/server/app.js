const dotenv = require('dotenv')
const Client = require("./client.js")

dotenv.config()

const app = new Client()

module.exports = app


