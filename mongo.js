require('dotenv').config()
const {MongoClient} = require('mongodb')

const uri = process.env.MONGO_uri

const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true,})
const getDbUsers = async() => {
    try {
        await client.connect()
        console.log('connected to database')
        const data = await getUsers()
        return data

    }
    catch(err) {
        console.log(err)
    }
}

async function getUsers() {
    //const dbs = await client.db().admin().listDatabases()
    const db = await client.db('test_data').collection('users')
    const users = await db.find().toArray()
    return users
}


async function insertUser(name,username,email,password,photo,bio,state,tagsArray,leadsArray) {
    try {
      const db = await client.db('test_data').collection('users')
      // create a document to insert
      const doc = {
        Name: name,
        Username: username,
        Email: email,
        Password: password,
        Photo: photo,
        Bio: bio,
        State: state,
        Tags: tagsArray,
        Leads: leadsArray
    }
      const result = await db.insertOne(doc);
      return `A document was inserted with the _id: ${result.insertedId}`;
    } catch(err) {
        console.log(err)
    } finally {
      await client.close();
    }
  }

module.exports.getDbUsers = getDbUsers
module.exports.insertUser = insertUser
