const express = require('express')
require('dotenv').config()
const app = express()
const {getDbUsers, insertUser} = require('./mongo')
const cors = require('cors')

const port = 5000


app.use(cors())

app.get('/', (req,res) => {
    res.send('You are connected to the Brokersphere Api')
    console.log('api is working')
})

app.get('/users', async (req,res) => {
    const data = await getDbUsers()
    res.json(data)
})

app.post('/users', async(req,res) => {
    let {Name,Username,Email,Password,Bio,Photo,Tags,State,Leads} = await req.body
    let result = await insertUser(Name,Username,Email,Password,Photo,Bio,State,Tags,Leads)
    console.log(result)
    
})
app.use(express.json())

app.listen(process.env.PORT | port,() => {
    console.log('Listening on port 5000')
})