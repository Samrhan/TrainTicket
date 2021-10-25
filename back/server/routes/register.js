const Route = require("../route");

module.exports = class getAddress extends Route {
    constructor(client) {
        super(client, {
            route: '/register',
            method: 'POST',
            params: [],
            body: [
                {name: 'mail', type: 'string'},
                {name: 'password', type: 'string'},
                {name: 'firstname', type: 'string'},
                {name: 'lastname', type: 'string'},
                {name: 'birthdate', type: 'string'},
                {name: 'address', type: 'string'}],
            auth: false
        });
    }

    async run(req, res) {
        try {
            await this.client.db.registerUser(this.mail, this.password, this.firstname, this.lastname, this.birthdate, this.address)
            return this.success({message: "ok"})
        } catch (e) {
            this.alreadyExist()
        }


    }

}
