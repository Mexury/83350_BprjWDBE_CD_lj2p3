const bodyParser = require("body-parser")
const express = require("express")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const crypto = require("crypto")

const app = express()

app.set("view engine", "ejs")
app.set("trust proxy", 1)
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.json())
app.use(bodyParser.raw())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

const surveys = new Map()

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

let questions = [
    {
        slug: "first_name",
        value: "What's your first name?",
        type: "text"
    },
    {
        slug: "student_number",
        value: "What's your studentnumber?",
        type: "text"
    },
    {
        slug: "age",
        value: "How old are you?",
        type: "number"
    },
    {
        slug: "course",
        value: "What course are you following?",
        type: "text"
    },
]

app.get(["/"], async (req, res) => {
    const { session } = req

    if (!session.token) {
        session.token = crypto.randomUUID()
        session.questions = []
    }

    res.render("home", {
        questions,
        session
    })
})

app.get(["/survey"], async (req, res) => {
    const { session } = req

    let currentStep = session.currentStep | 0

    res.render("filling-out", {
        currentStep: currentStep,
        questions
    })
})

app.post(["/api/add-question"], async (req, res) => {
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
})

app.post(["/api/remove-question"], async (req, res) => {
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
})

app.post(["/api/publish"], async (req, res) => {
    const { session, body } = req

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
})

app.get(['/surveys/:uuid'], async (req, res) => {
    const { params, session } = req

    session.destroy()
    
    if (surveys.has(params.uuid)) {
        res.render('filling-out', {
            currentStep: 0,
            questions: surveys.get(params.uuid)
        })
    } else {
        res.redirect('/')
    }
})

app.post(["/api/submit"], async (req, res) => {

    res.json({
        
    })
})

app.listen(3000, () => console.log("Server running at http://localhost:3000"))