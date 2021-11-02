const Route = require("../route");
const {getStation} = require('../../utils/sncf')


class GetTrainStation extends Route {

    /**
     * @param [client] Client
     * */

    constructor(client) {
        super(client, {
            route: '/trainstation',
            method: 'GET',
            params: [{name: 'query', needed: false}],
            body: [],
            auth: false
        });
    }

    async run() {
        if (this.query) {
            this.success(await getStation(this.query));
        } else {
            this.success([]);
        }
    }
}

////////////

module.exports = GetTrainStation;
