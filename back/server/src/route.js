class Route {

    static METHODS = ['GET', 'POST', 'DELETE', 'PUT']

    /**
     * Build route
     * @param [client] client
     * @param {{route: string, method: string, params: Array<{name: string, needed: boolean}>, body: Array<{name: string, type: string}>,  auth: boolean}} options
     * */

    constructor(client, options) {
        Route.validateOptions(client, options)
        this.client = client
        this.route = options.route
        this.method = options.method
        this.params = options.params
        this.body = options.body
        this.auth = options.auth

    }

    /**
     * Validate params
     * @param client : Client
     * @param {{route: string,
     *          method: string,
     *          params: Array<{name: string, needed: boolean}>,
     *          body: Array<{name: string, type: string}>,
     *          auth: boolean}} options
     * */

    static validateOptions(client, options) {
        if (typeof options !== 'object') throw new TypeError('Route options is not an Object');
        if (typeof options.route !== 'string') throw new TypeError('Route name is not a string');

        if (options.route !== options.route.toLowerCase()) throw new Error('Route name is not lowercase');
        if (typeof options.method !== 'string') throw new TypeError('Route method is not a string');

        if (this.METHODS.indexOf(options.method) === -1) throw new TypeError('Route method is not valid');
        if (options.method !== options.method.toUpperCase()) throw new Error('Route method is not uppercase');

        if (!Array.isArray(options.params)) throw new Error('Route params is not an Array');
        if (!options.params.every(i => (typeof i === "object"))) throw new Error('Route params is not an Array of object');

        if (!Array.isArray(options.body)) throw new Error('Route body is not an Array');
        if (!options.body.every(i => (typeof i === "object"))) throw new Error('Route body is not an Array of object');

        if (typeof options.auth !== 'boolean') throw new TypeError('Route auth is not a boolean');


    }

    /**
     * Check query and add all args to the class
     * @param req : object
     * @param res : object
     * @return boolean
     * */

    validateQuery(req, res) {
        this.res = res;

        if (this.auth) {
            if (!req.session.userId) {
                this.forbidden()
                return false
            }
        }
        if (req.session) {
            this.session = req.session
        }
        for (let i of this.body) {
            if (!req.body[i.name] || typeof req.body[i.name] !== i.type) {
                this.badFormed()
                return false
            }
            this[i.name] = req.body[i.name]
        }
        for (let i of this.params) {
            if (!req.params[i.name] && i.needed) {
                this.badFormed()
                return false
            }
            this[i.name] = req.params[i.name]
        }
        return true
    }

    /**
     * Execute method
     * */

    async run() {
        throw new Error(`The ${this.route} route has no run() method`);
    }

    /**
     * Send back data with success
     * @param {object} [data]
     * */

    success(data) {
        return this.res.status(200).json(data)
    }

    error(code, message) {
        return this.res.status(400).json({message: message})
    }

    notFound() {
        return this.res.status(404).json({message: "Not found"}).send()
    }

    forbidden() {
        return this.res.status(403).json({message: "forbidden"}).send()
    }

    badFormed() {
        return this.res.status(400).json({message: "missing or bad formed body properties"}).send()
    }

    alreadyExist() {
        return this.res.status(409).json({message: "conflict"}).send()
    }
}

module.exports = Route
