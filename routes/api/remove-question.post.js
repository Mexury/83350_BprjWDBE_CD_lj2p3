module.exports.routes = ["/api/remove-question"]
module.exports.register = async (req, res) => {
    const { session, body } = req

    if (session.token) {
        let found = session.questions.find(question => question.slug == body.slug)

        if (found) {
            session.questions.splice(session.questions.indexOf(found), 1)

            res.json({
                success: true,
                data: {
                    token: session.token,
                    message: "Question successfully removed!",
                    questions: session.questions
                }
            })
        } else {
            res.json({
                success: true,
                data: {
                    token: session.token,
                    message: "Passed: question not found",
                    questions: session.questions
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