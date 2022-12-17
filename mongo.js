const {MongoClient} = require('mongodb')
require('dotenv').config()
const {ObjectId} = require('mongodb')


const URI = process.env.MONGO_URI


const client = new MongoClient(URI,{useNewUrlParser: true, useUnifiedTopology: true,})
const getDbUsers = async() => {
    try {
        await client.connect()
        console.log('connected to database')
        const data = await getUsers()
        console.log(data)
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

async function getReferrals() {
    try {
      await client.connect()
      console.log('connected to database')
      const db = await client.db('test_data').collection('referrals')
      const referrals = await db.find().toArray()
      return referrals

    }
    catch(err) {
      console.log(err)
    }
}

async function getListings() {
  try {
    await client.connect()
    console.log('connected to database')
    const db = await client.db('test_data').collection('listings')
    const listings = await db.find().toArray()
    return listings

  }
  catch(err) {
    console.log(err)
  }
}

async function insertReferral(agent,type,location,financing,budget,email,number,fee,name,notes) {
  try {
    const db = await client.db('test_data').collection('referrals')
    // create a document to insert
    const doc = {
        Agent: agent,
        Type: type,
        Location: location,
        Financing: financing,
        Budget: budget,
        Email: email,
        Number: number,
        Fee: fee,
        Name: name,
        Notes: notes
  }
    const result = await db.insertOne(doc);
    return `A document was inserted with the _id: ${result.insertedId}`;
  } catch(err) {
      console.log(err)
      return 'referral insert failed'
  } finally {
    await client.close();
  }
}

async function deleteReferral(referral) {
  try {
    await client.connect()
    const db = await client.db('test_data').collection('referrals')
    // Query for a movie that has title "Annie Hall"
    const query = {_id: ObjectId(referral._id)};
    const result = await db.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
      return 'referral deleted'
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
      return 'delete failed'
    }
  } finally {
    await client.close();
  }
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
        leads: leadsArray
      }
      const result = await db.insertOne(doc);
      return `A document was inserted with the _id: ${result.insertedId}`;
    } catch(err) {
      return 'user insert failed'
        console.log(err)
    } finally {
      await client.close();
    }
}

async function updateUserLeads(referral,Id) {
  try {
    await client.connect()
    const db = await client.db('test_data').collection('users')
    const updateDoc = {
      $push: {
        leads: referral
      },
    };
    const result = await db.updateOne({_id: ObjectId(Id)}, updateDoc);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

    return result.modifiedCount
  } finally {
    await client.close();
  }
}

async function updateListingComments(listingId,comment) {
  try {
    await client.connect()
    const db = await client.db('test_data').collection('listings')
    const filter = { _id: ObjectId(listingId)};
    const updateDoc = {
      $push: {
        comments: comment
      },
    };
    const result = await db.updateOne(filter, updateDoc);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

    return result.modifiedCount
  } finally {
    await client.close();
  }
}

async function insertListing(IMG,ADDRESS,PRICE,BEDS,BATHS,SQFT,TAX,COND,LIKES,DISLIKES,AGENT,WEBSITE) {
  try {
    const db = await client.db('test_data').collection('listings')
    // create a document to insert
    const doc = {
      img: IMG,
      address: ADDRESS,
      price: PRICE,
      bedrooms: BEDS,
      bathrooms: BATHS,
      squarefeet: SQFT,
      taxes: TAX,
      condition: COND,
      likes: LIKES,
      dislikes: DISLIKES,
      agent: AGENT,
      comments: [],
      website:WEBSITE
  }
    const result = await db.insertOne(doc);
    return `A document was inserted with the _id: ${result.insertedId}`;
  } catch(err) {
      console.log(err)
      return 'listing insert failed'
  } finally {
    await client.close();
  }
}


module.exports.getDbUsers = getDbUsers
module.exports.insertUser = insertUser
module.exports.insertReferral = insertReferral
module.exports.getReferrals = getReferrals
module.exports.deleteReferral = deleteReferral
module.exports.updateUserLeads = updateUserLeads
module.exports.getListings = getListings
module.exports.updateListingComments = updateListingComments
module.exports.insertListing = insertListing
