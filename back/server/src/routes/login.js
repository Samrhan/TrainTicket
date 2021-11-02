const Route = require("../route");

class PostLogin extends Route {

    /**
     * @param [client] Client
     * */

    constructor(client) {
        super(client, {
            route: '/login',
            method: 'POST',
            params: [],
            body: [{name: 'mail', type: 'string'}, {name: 'password', type: 'string'}],
            auth: false
        });
    }

    async run() {
        try {
            let user = await this.client.db.getUserPasswordByMail(this.mail)
            if (!await user.checkPassword(this.password))
                return this.forbidden()

            this.session.userId = user.id;
            return this.success(await this.client.db.getUserById(user.id))

        } catch (e) {
            this.notFound()
        }


    }

}


////////////

module.exports = PostLogin
