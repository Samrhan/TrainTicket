const mysql = require("mysql2/promise")
const User = require('./user')
const bcrypt = require("bcrypt")

module.exports = class Database {
    connection;

    constructor(options) {
        this.connection = mysql.createPool(options)
    }

    static formatData(data) {
        return data[0]
    }

    /**
     * Get user by Mail
     * @param mail : string
     * @return user;
     * */
    async getUserPasswordByMail(mail) {
        const data = await this.connection.query('SELECT id, password FROM user WHERE mail = ?', [mail])
        const formatted_data = Database.formatData(data)
        if (formatted_data.length === 0) {
            throw new Error("Utilisateur Introuvable")
        }
        return new User(formatted_data[0])
    }

    async checkUserExistence(mail) {
        const data = await this.connection.query('SELECT id FROM user WHERE mail = ?', [mail])
        const formatted_data = Database.formatData(data)
        return formatted_data.length !== 0;

    }

    async getUserById(id) {
        const data = await this.connection.query('SELECT id, mail, lastname, firstname, address FROM user WHERE id = ?', [id])
        const formatted_data = Database.formatData(data)
        if (formatted_data.length === 0) {
            throw new Error("Utilisateur Introuvable")
        }
        return new User(formatted_data[0])
    }

    async registerUser(mail, password, firstname, lastname, address) {
        if (!await this.checkUserExistence(mail)) {
            password = await bcrypt.hash(password, 10)
            await this.connection.query('INSERT INTO user(mail, lastname, firstname, password, address) VALUES (?,?,?,?,?)', [mail, lastname, firstname, password, address])

        } else {
            throw new Error("L'utilisateur existe déjà")
        }
    }

}
