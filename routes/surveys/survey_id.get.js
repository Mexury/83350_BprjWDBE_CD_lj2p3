module.exports.routes = ["/surveys/:uuid"]
module.exports.register = async (req, res) => {
    const { params, session } = req
    const { surveys } = global
    
    if (surveys.has(params.uuid)) {
        res.render('filling-out', {
            currentStep: 0,
            questions: surveys.get(params.uuid)
        })
    } else {
        res.redirect('/')
    }
}