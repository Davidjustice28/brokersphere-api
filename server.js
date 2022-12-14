const express = require('express')
require('dotenv').config()
const app = express()
const {getDbUsers, insertUser, getReferrals,insertReferral,deleteReferral,updateUserLeads, getListings, updateListingComments,insertListing} = require('./mongo')
const cors = require('cors')
const AWS = require('aws-sdk')
const fileUpload = require('express-fileupload')
const fs = require('fs')

const multer = require('multer')
const uploadMiddleware = multer({dest: 'Images'})




const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
})

const port = 8000


app.use(cors())
app.use(express.json())
app.use(fileUpload())

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

app.get('/api/images',async (req,res) => {

    async function getImages() {
        const {Contents} = await s3.listObjectsV2({
            Bucket: 'brokersphere-images'
        }).promise()
        let data = Contents.map((item) => {
            return `https://brokersphere-images.s3.amazonaws.com/${item.Key}`
        })
        console.log(data)
        return data
    }

    let imageList = await getImages()
    res.json(imageList)
})

app.post('/images',uploadMiddleware('image') ,(req,res) => {
    console.log(req.file)
    const uploadParams = {
        Bucket: 'brokersphere-images',
        Key: req.file.originalname,
        Body:req.file.buffer,
        ContentType: req.file.mimetype
    }

    s3.upload(uploadParams,(err,data) => {
        if(err) {
            console.log("Error", err)
        }
        else {
            console.log("upload success", data.Location)
            let url = `https://brokersphere-images.s3.amazonaws.com/${uploadParams.Key}`
            return url
        }
    })
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

app.post('/api/listings', async (req,res) => {
    let {img,address,taxes,price,bedrooms,bathrooms,squarefeet,condition,likes,dislikes,agent} = await req.body
    let result = await insertListing(img,address,price,bedrooms,bathrooms,squarefeet,taxes,condition,likes,dislikes,agent)
    console.log(result)
    res.json(result) 
})

app.put('/api/listings/comment', async (req,res) => {
    let {listing,comment} = req.body
    let result = await updateListingComments(listing,comment)
    res.json(result)
})


app.delete('/api/referrals', async (req,res) => {
    const Referral = req.body.Referral
    let result = await deleteReferral(Referral)
    res.json(result)
})

app.put('/api/users/leads', async (req,res) => {
    let {user,Referral} = req.body
    let result = await updateUserLeads(user,Referral)
    res.json(result)
})


app.listen(process.env.PORT || port,() => {
    console.log('Listening on port 5000')
})


