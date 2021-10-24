const axios = require("axios")
const Route = require("../routes");
const {parseDate, getDuration, convertToHHMM} = require('../utils')

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

        this.from = encodeURIComponent(this.from)
        this.to = encodeURIComponent(this.to)

        const result = await axios.get(`https://${process.env.SNCF_TOKEN}@api.sncf.com/v1/coverage/sncf/journeys?from=${this.from}&to=${this.to}&count=5` + (this.datetime ? `&datetime=${this.datetime}` : ''))
        const journeys = []
        for (let journey of result.data.journeys) {
            let tmp_journey = {
                departure: parseDate(journey["departure_date_time"]),
                arrival: parseDate(journey["arrival_date_time"]),
                sections: []
            }
            for (let section of journey.sections) {
                if (section.type === "public_transport") {
                    const tmp_section = {
                        type: 'train',
                        from: section.from["stop_point"].name,
                        to: section.to["stop_point"].name,
                        mode: section["display_informations"].network,
                        departure: parseDate(section["base_departure_date_time"]),
                        arrival: parseDate(section["base_arrival_date_time"]),
                    }
                    tmp_section.duration = getDuration(tmp_section.departure, tmp_section.arrival)
                    tmp_journey.sections.push(tmp_section)

                } else if (section.type === "transfer") {
                    tmp_journey.sections.push({
                        type: 'transfer',
                        duration: convertToHHMM(section.duration)
                    })
                }
            }
            journeys.push(tmp_journey)
        }
        this.success(journeys);
    }


}
