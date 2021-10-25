const axios = require("axios");
const {parseDate, getDuration, convertToHHMM} = require("../utils/utils");

module.exports = class SNCF {
    static async getStation(query) {
        query = encodeURIComponent(query)
        const result = await axios.get(`https://${process.env.SNCF_TOKEN}@api.sncf.com/v1/coverage/sncf/places?q=${query}&`)
        let stations = []
        if (result.data.places)
            for (let station of result.data.places) {
                stations.push({name: station.name, id: station.id})
            }
        return stations
    }

    static async getJourneys(from, to, datetime) {
        from = encodeURIComponent(from)
        to = encodeURIComponent(to)
        const result = await axios.get(`https://${process.env.SNCF_TOKEN}@api.sncf.com/v1/coverage/sncf/journeys?from=${from}&to=${to}&count=5` + (datetime ? `&datetime=${datetime}` : ''))
        const journeys = []
        if (Array.isArray(result.data.journeys))
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
        return journeys
    }
}
