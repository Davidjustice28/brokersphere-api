const express = require('express')
require('dotenv').config()
const app = express()
const {getDbUsers, insertUser, getReferrals,insertReferral,deleteReferral,updateUserLeads, getListings} = require('./mongo')
const cors = require('cors')

const port = 5000

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions))

app.get('/api', (req,res) => {
    res.send('You are connected to the Brokersphere Api')
    console.log('api is working')
})

app.get('/api/users', async (req,res) => {
    const data = await getDbUsers()
    res.json(data)
})

app.get('/api/referrals', async (req,res) => {
    const data = await  getReferrals()
    res.json(data)  
})

app.get('/api/listings', async (req,res) => {
    const data = await getListings()
    res.json(data)
})

app.post('/api/users', async(req,res) => {
    let {Name,Username,Email,Password,Bio,Photo,Tags,State,Leads} = await req.body
    let result = await insertUser(Name,Username,Email,Password,Photo,Bio,State,Tags,Leads)
    console.log(result)
    res.json(result) 
})

app.post('/api/referrals', async(req,res) => {
    let {Agent,Type,Location,Financing,Budget,Email,Number,Fee,Name,Notes} = req.body
    let data = req.body
    console.log(data)
    let result = await(insertReferral(Agent,Type,Location,Financing,Budget,Email,Number,Fee,Name,Notes))
    console.log(result)
    res.json(result)
})

app.delete('/api/referrals', async (req,res) => {
    const Referral = req.body.Referral
    let result = await deleteReferral(Referral)
    res.json(result)
})

app.put('/api/users/leads', async (req,res) => {
    let {user,referral} = req.body
    let result = await updateUserLeads(user,referral)
    res.json(result)
})

app.use(express.json())

app.listen(process.env.PORT || port,() => {
    console.log('Listening on port 5000')
})