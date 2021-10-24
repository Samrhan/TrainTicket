module.exports = class Utils {
    /***
     * Get Date object from SNCF formated date
     * @param date : string
     * ***/

    static parseDate(date) {
        let year = date.substr(0, 4)
        let month = date.substr(4, 2) - 1
        let day = date.substr(6, 2)
        let hour = date.substr(9, 2)
        let minutes = date.substr(11, 2)
        let seconds = date.substr(13, 2)
        return new Date(year, month, day, hour, minutes, seconds)
    }

    /**
     * Get duration between two date
     * @param departure : Date
     * @param arrival : Date
     * */

    static getDuration(departure, arrival) {
        let diffTime = Math.abs(arrival - departure)
        const hours = Math.floor(diffTime / 1000 / 3600)
        diffTime -= hours * 3600 * 1000
        let minutes = Math.floor(diffTime / 1000 / 60)
        if (minutes < 10)
            minutes = `0${minutes}`
        return `${hours}h:${minutes}m`
    }

    /**
     * Convert seconds to hh:mm
     * @param seconds : number
     * */

    static convertToHHMM(seconds) {
        let hours = Math.floor(seconds / 3600)
        seconds -= hours * 3600
        let minutes = Math.floor(seconds / 60)
        if (minutes < 10)
            minutes = `0${minutes}`
        return `${hours}h:${minutes}m`
    }
}
