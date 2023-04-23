module.exports.routes = ["/api/publish"]
module.exports.register = async (req, res) => {
    const { session, body } = req
    const { surveys } = global

    if (session.token) {
        if (session.questions.length > 0) {
            surveys.set(session.token, session.questions)

            res.json({
                success: true,
                data: {
                    token: session.token,
                    message: "Survey successfully published!"
                }
            })
        } else {
            res.json({
                success: false,
                errors: [
                    "Surveys require at least one question."
                ],
                data: {
                    token: session.token
                }
            })
        }
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