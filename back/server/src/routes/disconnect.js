const Route = require("../route");

module.exports = class postDisconnect extends Route {
    constructor(client) {
        super(client, {
            route: '/disconnect',
            method: 'POST',
            params: [],
            body: [],
            auth: true
        });
    }

    async run() {
        this.session.destroy()
        this.success()
    }
}
