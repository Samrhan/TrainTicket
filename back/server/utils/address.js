const axios = require("axios");
module.exports = class Address {
    /**
     * Autocomplete address
     * @param query : string
     * */

    static async getAdresses(query) {
        query = encodeURIComponent(query)
        const result = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`)
        let addresses = []
        if (result.data.features)
            for (let address of result.data.features) {
                addresses.push({label: address.properties.label, context: address.properties.context})
            }
        return addresses
    }
}
