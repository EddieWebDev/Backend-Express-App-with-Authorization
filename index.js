const express = require("express")

const db = require("./db.js")
const utils = require("./utils.js")

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    const token = req.headers.authorization

    if(token && utils.verifyJWT(token)) {
        const tokenData = utils.decodeJWT(token)
        req.user = tokenData
        req.user.isLoggedIn = true
    } else {
        req.user =  {isLoggedIn: false}
    }

    next()
})

// ----------- CHECK IF LOGGEDIN ----------------
const forceAuthorize = (req, res, next) => {
    if(req.user.isLoggedIn) {
        next()
    } else {
        res.sendStatus(401)
    }
}

// ----------- LANDINGPAGE ----------------
app.get("/", (req, res) => {
    res.send(req.user)
})

// ----------- GET USERS ----------------
app.get("/users", forceAuthorize, (req, res) => {
    db.getUsers((error, users) => {
        if(error) {
            console.log(error)
            res.status(500).send(error)
        } else {
            res.send(users)
        }
    })
})

// ----------- POST/REGISTER USER ----------------
app.post("/register", (req, res) => {
    const {name, username, motto, password} = req.body

    const hashedPassword = utils.hashPassword(password)

    db.registerUser(name, username, motto, hashedPassword, (error) => {
        if(error) {
            console.log(error)
            res.status(500).send(error)
        } else {
            res.sendStatus(200)
        }
    })

})

// ----------- POST LOGIN -------------------
app.post("/login", (req, res) => {
    const {username, password} = req.body

    db.getAccountByUsername(username, (error, account) => {
        if (error) {
            res.status(500).send(error)
        } 
        else if (account) {
            const hashedPassword = account.hashedPassword
            const correctPassword = utils.comparePassword(password, hashedPassword) 
            if (correctPassword) {
                const jwtToken = utils.getJWTToken(account)
                res.send(jwtToken)
            } 
            else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
    })
})

// -----------GET CARS------------------------
app.get("/cars", forceAuthorize, (req, res) => {
    db.getCars((error, cars) => {
        if(error) {
            console.log(error)
            res.status(500).send(error)
        } else {
            // res.sendStatus(200)
            res.send(cars)
        }
    })
})

// ----------- POST CARS ----------------
app.post("/cars", forceAuthorize, (req, res) => {
    const {make, model} = req.body

    db.registerCar(make, model, (error) => {
        if(error) {
            console.log(error)
            res.status(500).send(error)
        } else {
            res.sendStatus(200)
        }
    })
})

app.listen(8000, console.log("http://localhost:8000/"))
