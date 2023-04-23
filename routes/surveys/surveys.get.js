const db = require("../../utils/Database.js")

module.exports.routes = ["/surveys"]
module.exports.register = async (req, res) => {
    
    const surveys = await db.sql("surveys/get_all")
    
    res.render("components/surveys", {
        surveys: surveys.data
    })
}