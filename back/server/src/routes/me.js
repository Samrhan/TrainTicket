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

    async run() {
        try {
            const user = await this.client.db.getUserById(this.session.userId);
            this.success(user);
        } catch (e) {
            return this.notFound();
        }
    }
}
