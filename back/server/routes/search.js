const axios = require("axios")
const Route = require("../routes");


module.exports = class getAddress extends Route {
    constructor(client) {
        super(client, {
            route: '/search',
            method: 'GET',
            params: [{name: 'from', needed: true}, {name: 'to', needed: true}, {name: 'datetime', needed: false}]
        });
    }

    async run(req, res) {
        let from = req.params.from;
        let to = req.params.to
        let datetime = req.params.datetime
        from = encodeURIComponent(from)
        to = encodeURIComponent(to)

        const result = await axios.get(`https://${process.env.SNCF_TOKEN}@api.sncf.com/v1/coverage/sncf/journeys?from=${from}&to=${to}&count=5` + (datetime ? `&datetime=${datetime}` : ''))
        const journeys = []
        for (let journey of result.data.journeys) {
            let tmp_journey = {
                departure: this.parseDate(journey["departure_date_time"]),
                arrival: this.parseDate(journey["arrival_date_time"]),
                sections: []
            }
            for (let section of journey.sections) {
                if (section.type === "public_transport") {
                    const tmp_section = {
                        type: 'train',
                        from: section.from["stop_point"].name,
                        to: section.to["stop_point"].name,
                        mode: section["display_informations"].network,
                        departure: this.parseDate(section["base_departure_date_time"]),
                        arrival: this.parseDate(section["base_arrival_date_time"]),
                    }
                    tmp_section.duration = this.getDuration(tmp_section.departure, tmp_section.arrival)
                    tmp_journey.sections.push(tmp_section)

                } else if (section.type === "transfer") {
                    tmp_journey.sections.push({
                        type: 'transfer',
                        duration: this.convertToHHMM(section.duration)
                    })
                }
            }
            journeys.push(tmp_journey)
        }
        res.status(200).json(journeys);
    }

    parseDate(date) {
        let year = date.substr(0, 4)
        let month = date.substr(4, 2) - 1
        let day = date.substr(6, 2)
        let hour = date.substr(9, 2)
        let minutes = date.substr(11, 2)
        let seconds = date.substr(13, 2)
        return new Date(year, month, day, hour, minutes, seconds)
    }

    getDuration(departure, arrival) {
        let diffTime = Math.abs(arrival - departure)
        const hours = Math.floor(diffTime / 1000 / 3600)
        diffTime -= hours * 3600 * 1000
        let minutes = Math.floor(diffTime / 1000 / 60)
        if (minutes < 10)
            minutes = `0${minutes}`
        return `${hours}h:${minutes}m`
    }

    convertToHHMM(seconds) {
        let hours = Math.floor(seconds / 3600)
        seconds -= hours * 3600
        let minutes = Math.floor(seconds / 60)
        if (minutes < 10)
            minutes = `0${minutes}`
        return `${hours}h:${minutes}m`
    }
}
