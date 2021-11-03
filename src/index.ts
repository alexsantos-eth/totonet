// IMPORTS
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// DB
import startDb from 'utils/db'

// CONTROLLERS
import modelController from 'controllers/model'
import dataController from 'controllers/data'
import authController from 'controllers/auth'
import userController from 'controllers/user'
import depController from 'controllers/department'

// APP
const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())
startDb()

dotenv.config()

// CONTROLADORES
modelController(app)
dataController(app)
authController(app)
userController(app)
depController(app)

// INICIAR APP
app.listen(5000, () => {
	console.log('Start on localhost:5000')
})