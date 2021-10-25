const Route = require("../route");

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
        try {
            let user = await this.client.db.getUserPasswordByMail(this.mail)
            if (!await user.checkPassword(this.password))
                return this.forbidden()

            req.session.userId = user.id;
            return this.success(await this.client.db.getUserById(user.id))

        } catch (e) {
            this.notFound()
        }


    }

}
