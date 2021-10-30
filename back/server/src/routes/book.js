const Route = require("../route");
const moment = require('moment-timezone');
const {capitalize} = require('../../utils/utils');
moment.locale('fr')

module.exports = class postBook extends Route {
    constructor(client) {
        super(client, {
            route: '/book',
            method: 'POST',
            params: [],
            body: [{name: 'journey', type: 'object'}],
            auth: true,
        });
    }

    async run() {
        try {
            const user = await this.client.db.getUserById(this.session.userId)
            await this.client.sendTicket(user.mail, this.formatData(user, this.journey))
            return this.success({message: "ok"})
        } catch (e) {
            console.error(e)
            this.error(400, e.message)
        }


    }

    formatData(user, journey) {
        return {
            date: capitalize(moment(journey.departure).format('dddd Do MMMM')),
            departure: journey.sections[0].from.toUpperCase().replace(/ /g, "&nbsp;"),
            departure_hour: moment(journey.departure).tz('UTC').format('LT'),
            arrival: journey.sections[journey.sections.length - 1].to.replace(/ /g, "&nbsp;").toUpperCase(),
            arrival_hour: moment(journey.arrival).tz('UTC').format('LT'),
            voiture: Math.ceil(Math.random() * 18),
            place: Math.ceil(Math.random() * 150),
            mode: this.formatMode(journey.sections),
            classe: `CLASSE&nbsp;${Math.ceil(Math.random() * 2)}`,
            travel_time: moment(new Date(journey.arrival) - new Date(journey.departure) - 3600000).format('LT'),
            lastname: user.lastname,
            firstname: user.firstname,
            dossier: (Math.random() + 1).toString(36).substring(5).toUpperCase(),
            ref: (Math.random() + 1).toString().substring(2).toUpperCase(),
            numero_billet: (Math.random() + 1).toString().substring(8).toUpperCase(),
            price: this.calcPrice(journey)
        }
    }

    formatMode(sections) {
        let mode = ""
        for (let i of sections) {
            mode += `${i.mode} ${(Math.random() + 1).toString().substring(14).toUpperCase()} ⇒ `
        }
        return mode.substr(0, mode.length - 3)
    }

    calcPrice(journey) {
        let travel_time = new Date(journey.arrival) - new Date(journey.departure) - 3600000
        let minutes = travel_time / 1000 / 60
        return `${(minutes * 0.5).toFixed(2)}€`
    }

}
