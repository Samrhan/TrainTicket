const bcrypt = require("bcrypt");
module.exports = class User {
    constructor(data) {
        this.id = data.id
        this.mail = data.mail
        this.lastname = data.lastname
        this.firstname = data.firstname
        this.password = data.password
        this.birthdate = data.birthdate
        this.address = data.address
    }

    async checkPassword(password) {
        if (this.password)
            return await bcrypt.compare(password, this.password);
        else return false;
    }
}
