module.exports = async (req, res, client) => {
    if (req.session.userId) {

        let sql = "SELECT * FROM full_user WHERE id=?"

        let data = await client.query(sql, [req.session.userId])
        let result = Object.values(JSON.parse(JSON.stringify(data[0])))[0]// Convertir le résultat de client.query en objet manipulable

        res.status(200).json(result);

    } else {
        res.status(401).json({message: "no user logged in."});
    }
}
