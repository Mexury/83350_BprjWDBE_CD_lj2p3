const crypto = require("crypto")

module.exports.routes = ["/"]
module.exports.register = async (req, res) => {
    const { session } = req

    if (!session.token) {
        session.token = crypto.randomUUID()
        session.questions = []
    }

    res.render("home", {
        questions: session.questions || [],
        session
    })
}