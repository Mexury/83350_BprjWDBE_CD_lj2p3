module.exports.routes = ["/api/add-question"]
module.exports.register = async (req, res) => {
    const { session, body } = req

    if (session.token) {
        session.questions.push(body.question)
        res.json({
            success: true,
            data: {
                token: session.token,
                message: "Question successfully added!"
            }
        })
    } else {
        res.json({
            success: false,
            errors: [
                "Authentication failed."
            ],
            data: {
                token: session.token
            }
        })
    }
}