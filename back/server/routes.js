class Route {

    static METHODS = ['GET', 'POST', 'DELETE', 'PUT']

    constructor(client, options) {
        this.constructor.validateOptions(client, options)
        this.client = client
        this.route = options.route
        this.method = options.method
        this.params = options.params
    }

    static validateOptions(client, options) {
        if (!client) throw new TypeError('No client was found')
        if (typeof options !== 'object') throw new TypeError('Route options is not an Object');
        if (typeof options.route !== 'string') throw new TypeError('Route name is not a string');
        if (options.route !== options.route.toLowerCase()) throw new Error('Route name is not lowercase');
        if (typeof options.method !== 'string') throw new TypeError('Route method is not a string');
        if (this.METHODS.indexOf(options.method) === -1) throw new TypeError('Route method is not valid');
        if (options.method !== options.method.toUpperCase()) throw new Error('Route method is not uppercase');
        if (!Array.isArray(options.params)) throw new Error('Route params is not an Array');
        if (!options.params.every(i => (typeof i === "object"))) throw new Error('Route params is not an Array of object');
    }

    run(req, res) {
        throw new Error(`The ${this.route} route has no run() method`);
    }
}

module.exports = Route
