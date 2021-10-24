const axios = require("axios")
const Route = require("../route");

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
        let query = req.params.query;
        if (query) {
            query = encodeURIComponent(query)
            const result = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`)
            let addresses = []
            if (result.data.features)
                for (let address of result.data.features) {
                    addresses.push({label: address.properties.label, context: address.properties.context})
                }
            res.status(200).json(addresses);
        } else {
            res.status(200).json([]);
        }
    }
}
