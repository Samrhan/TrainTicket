module.exports = async (req, res) => {
    req.session.destroy(() => {
        res.status(200).send();
    });
}