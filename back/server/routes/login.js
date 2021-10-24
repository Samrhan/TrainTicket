const bcrypt = require('bcrypt')
const Route = require("../routes");

module.exports = class getAddress extends Route {
    constructor(client) {
        super(client, {
            route: '/login',
            method: 'POST',
            params: []
        });
    }

    async run(req, res) {
        const mail = req.body.mail
        const password = req.body.password

        if (req.session.userId) {
            res.status(403).json({message: "already logged in"})
            return;
        }

        if (!(mail && password !== undefined)) {
            res.status(400).json({message: "bad request - request must include mail and password"});
            return;
        }

        let data = await this.client.query("SELECT * FROM user WHERE mail = ?", [mail])

        let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
        if (data[0].length === 1) {
            if (await bcrypt.compare(password, result.password)) {
                req.session.userId = result.id;
                res.status(200).json({message: "ok"})
            } else {
                return res.status(401).json({message: "wrong credentials"});
            }
        } else {
            return res.status(403).json({message: "You can't connect anymore"});
        }
    }
}
