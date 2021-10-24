const Route = require("../routes");

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

    async run(req, res) {
        req.session.destroy(() => {
            res.status(200).send();
        });
    }
}
