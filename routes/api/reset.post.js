const db = require("../../utils/Database.js")

module.exports.routes = ["/api/reset"]
module.exports.register = async (req, res) => {
    const { session, body } = req

    if (session.token) {
        const result = await db.sql("surveys/truncate")
        session.destroy()
        global.surveys = new Map()
    
        res.json({
            success: true,
            data: {
                message: "Surveys successfully truncated!"
            }
        })
    } else {
        res.json({
            success: false,
            errors: [
                "Not authorized."
            ]
        })
    }
}