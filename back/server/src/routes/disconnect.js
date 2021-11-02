const Route = require("../route");

class PostDisconnect extends Route {

    /**
     * @param [client] Client
     * */

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


////////////

module.exports = PostDisconnect
