const axios = require("axios")


module.exports = async (req, res) => {


    let query = req.body.query;
    query = encodeURIComponent(query)
    const result = await axios.get(`https://${process.env.SNCF_TOKEN}@api.sncf.com/v1/coverage/sncf/places?q=${query}&`)
    let stations = []
    for (let station of result.data.places) {
        stations.push({name: station.name, id: station.id})
    }
    res.status(200).json(stations);

}
