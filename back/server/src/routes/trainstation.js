const Route = require("../route");
const {getStation} = require('../../utils/sncf')


module.exports = class getAddress extends Route {
    constructor(client) {
        super(client, {
            route: '/trainstation',
            method: 'GET',
            params: [{name: 'query', needed: false}],
            body: [],
            auth: false
        });
    }

    async run(req, res) {
        if (this.query) {
            this.success(await getStation(this.query));
        } else {
            this.success([]);

        }
    }
}
