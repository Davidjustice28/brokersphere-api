const {MongoClient} = require('mongodb')

const uri = 'mongodb+srv://brokersphere-data:realestate-agent@brokersphere.gudt4.mongodb.net/?retryWrites=true&w=majority' 


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
    const db = await client.db('test_data').collection('referrals')
    // Query for a movie that has title "Annie Hall"
    const query = {_id:referral.id };
    const result = await movies.deleteOne(query);
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
        Leads: leadsArray
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

async function updateUserLeads(user,referral) {
  try {
    const db = await client.db('test_data').collection('users')
    const filter = { _id: user._id };
    const options = { upsert: true };
    const updateDoc = {
      $push: {
        leads: referral
      },
    };
    const result = await db.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

    return result.modifiedCount
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