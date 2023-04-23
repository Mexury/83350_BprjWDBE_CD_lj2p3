const db = require("../../utils/Database.js")

module.exports.routes = ["/api/submit"]
module.exports.register = async (req, res) => {
    const { session, body } = req
    const { data } = body
    const { surveys } = global

    for (const question of data) {
        const result = await db.sql("surveys/create_entry", {
            survey_token: session.token,
            question: question.name,
            answer: question.value
        })

        console.log(result);
    }
    
    session.destroy()

    res.json({
        success: true,
        data: {
            message: "Survey successfully submitted!"
        }
    })
}