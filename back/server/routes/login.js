const bcrypt = require('bcrypt')
const Route = require("../routes");

module.exports = class getAddress extends Route {
    constructor(client) {
        super(client, {
            route: '/login',
            method: 'POST',
            params: [],
            body: [{name: 'mail', type: 'string'}, {name: 'password', type: 'string'}],
            auth: false
        });
    }

    async run(req, res) {

        let data = await this.client.query("SELECT * FROM user WHERE mail = ?", [this.mail])

        let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]
        if (data[0].length === 1) {
            if (await bcrypt.compare(this.password, result.password)) {
                req.session.userId = result.id;
                return this.success({message: "ok"})
            } else {
                return this.forbidden()
            }
        } else {
            return this.forbidden()
        }
    }
}
