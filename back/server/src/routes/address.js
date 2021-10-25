const Route = require("../route");
const {getAdresses} = require('../../utils/address')

module.exports = class getAddress extends Route {
    constructor(client) {
        super(client, {
            route: '/address',
            method: 'GET',
            params: [{name: 'query', needed: true}],
            body: [],
            auth: false
        });
    }

    async run(req, res) {
        if (this.query) {
            this.success(await getAdresses(this.query));
        } else {
            this.success([]);
        }
    }


}
