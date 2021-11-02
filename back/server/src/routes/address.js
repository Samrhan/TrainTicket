const Route = require("../route")
const {getAdresses} = require('../../utils/address')

class GetAddress extends Route {

    /**
     * @param [client] Client
     * */

    constructor(client) {
        super(client, {
            route: '/address',
            method: 'GET',
            params: [{name: 'query', needed: true}],
            body: [],
            auth: false
        });
    }

    async run() {
        if (this.query !== undefined) {
            this.success(await getAdresses(this.query));
        } else {
            this.success([]);
        }
    }
}


////////////

module.exports = GetAddress
