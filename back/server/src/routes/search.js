const Route = require("../route");
const {getJourneys} = require('../../utils/sncf')

module.exports = class getAddress extends Route {
    constructor(client) {
        super(client, {
            route: '/search',
            method: 'GET',
            params: [{name: 'from', needed: true}, {name: 'to', needed: true}, {name: 'datetime', needed: false}],
            body: [],
            auth: false

        });
    }

    async run(req, res) {
        this.success(await getJourneys(this.from, this.to, this.datetime));
    }
}
