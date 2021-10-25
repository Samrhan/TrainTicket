const dotenv = require('dotenv')
const Client = require("./src/client.js")

dotenv.config()

const app = new Client()

module.exports = app.server


