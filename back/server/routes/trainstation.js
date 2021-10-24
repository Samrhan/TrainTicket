const axios = require("axios")
const Route = require("../routes");

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
        let query = req.params.query;
        if (query) {
            query = encodeURIComponent(query)
            const result = await axios.get(`https://${process.env.SNCF_TOKEN}@api.sncf.com/v1/coverage/sncf/places?q=${query}&`)
            let stations = []
            if (result.data.places)
                for (let station of result.data.places) {
                    stations.push({name: station.name, id: station.id})
                }
            this.success(stations);
        } else {
            this.success([]);

        }
    }
}
