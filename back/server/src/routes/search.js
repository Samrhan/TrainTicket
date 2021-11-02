const Route = require("../route");
const {getJourneys} = require('../../utils/sncf')

class getSearch extends Route {

    /**
     * @param [client] Client
     * */

    constructor(client) {
        super(client, {
            route: '/search',
            method: 'GET',
            params: [{name: 'from', needed: true}, {name: 'to', needed: true}, {name: 'datetime', needed: false}],
            body: [],
            auth: false

        });
    }

    async run() {
        this.success(await getJourneys(this.from, this.to, this.datetime));
    }
}

////////////

module.exports = getSearch;
