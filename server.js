const express = require('express')
require('dotenv').config()
const app = express()
const {getDbUsers, insertUser, getReferrals,insertReferral,deleteReferral,updateUserLeads, getListings, updateListingComments,insertListing} = require('./mongo')
const cors = require('cors')
const AWS = require('aws-sdk')
const fileUpload = require('express-fileupload')
const fs = require('fs')

const multer = require('multer')

app.use(cors())

const port = 3000

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null,'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')


app.post('/uploadImage', async function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        //console.log(req.file)
        //console.log(req.file.path)

        //
        const fsStream = fs.createReadStream(req.file.path)
        const uploadParams = {
            Bucket: 'brokersphere-images',
            Key: req.file.originalname,
            Body:fsStream,
            ContentType: req.file.mimetype
        }

        s3.upload(uploadParams).promise()
        .then(data => {
            console.log({location: data.Location})
            res.json({ url: data.Location})
        })
        .catch(err => res.status(400).send(err))
        //res.json({ url: `https://brokersphere-images.s3.amazonaws.com/${uploadParams.Key}` });
    })

});


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


app.post('/api/users', async(req,res) => {
    let {Name,Username,Email,Password,Bio,Photo,Tags,State,leads} = await req.body
    let result = await insertUser(Name,Username,Email,Password,Photo,Bio,State,Tags,leads)
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
    let {img,address,taxes,price,bedrooms,bathrooms,squarefeet,condition,likes,dislikes,agent,website} = await req.body
    let result = await insertListing(img,address,price,bedrooms,bathrooms,squarefeet,taxes,condition,likes,dislikes,agent,website)
    console.log(result)
    res.json(result) 
})

app.put('/api/listings/comment', async (req,res) => {
    let result = await updateListingComments(req.body.data.listing._id,req.body.data.comment)
    res.json(result)
})


app.delete('/api/referrals', async (req,res) => {
    let result = await deleteReferral(req.body.Referral)
    res.json(result)
})

app.put('/api/users/leads', async (req,res) => {
    let {id,Referral} = req.body.data
    let result = await updateUserLeads(Referral,id)
    res.json(result)
})




app.listen(port, "0.0.0.0",() => {
    console.log('Listening on port 3000')
})
