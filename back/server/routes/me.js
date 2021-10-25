const Route = require("../route");

module.exports = class postDisconnect extends Route {
    constructor(client) {
        super(client, {
            route: '/me',
            method: 'GET',
            params: [],
            body: [],
            auth: true
        });
    }

    async run(req, res) {
        try {
            const user = await this.client.db.getUserById(this.session.userId);
            res.status(200).json(user);
        } catch (e) {
            return this.notFound();
        }
    }
}
