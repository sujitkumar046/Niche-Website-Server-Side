
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectID = require('mongodb').ObjectId;



const app = express ()


app.use (cors ())
app.use (express.json())


const port = process.env.PORT ||5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.63xhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const nicheWebsite = client.db('Coffeeniche');
    const coffeemachines = nicheWebsite.collection('Coffeemachines');
    const orderCollection = nicheWebsite.collection("orders");
    const reviewCollection = nicheWebsite.collection("reviews");
    const usersCollection = nicheWebsite.collection('user')
    


    app.get ('/products', async (req,res) => {
        const coursor = coffeemachines.find({})
        const query = await coursor.toArray();
        res.send(query)
        console.log ('getting the data from server')

    })

      //Get a single data
      app.get ('/products/:id', async (req,res) => {
        const id = req.params.id
        console.log ('getting ID')
        const query = {_id: ObjectID (id)}
        const result = await coffeemachines.findOne(query)
        res.json(result)
  })

   app.get ('/orders', async (req,res) => {
    const coursor = orderCollection.find({})
    const query = await coursor.toArray();
    res.send(query)
    console.log ('getting the data from server')

}),

  app.get ('/reviews', async (req,res) => {
  const coursor = reviewCollection.find({})
  const query = await coursor.toArray();
  res.send(query)
  console.log ('getting the data from server')

}),

app.get ('/users/:email', async (req, res) => {
  const email = req.params.email;
  const query = {email: email};
  const user = await usersCollection.findOne(query);
  let isAdmin = false;
  if (user?.role === 'admin'){
    isAdmin =true

  } 
  res.json({admin:isAdmin})

} )
// app.get ('/users', async (req,res) => {
//   const coursor = userCollection.find({})
//   const query = await coursor.toArray();
//   res.send(query)
  

// }),

//Post some orders
    app.post ('/orders', async (req,res) => {
    const ordered = req.body 
    const orderresult = await orderCollection.insertOne(ordered);
    console.log('order placed')
    res.json (orderresult)
  })

    //Post a review
    app.post ('/users', async (req,res) => {
      const reviewed = req.body 
      const reviewresult = await usersCollection.insertOne(reviewed);
      console.log('new users added')
      res.json (reviewresult)
    })
  

  //Post a review
    app.post ('/reviews', async (req,res) => {
    const reviewed = req.body 
    const reviewresult = await reviewCollection.insertOne(reviewed);
    console.log('order placed')
    res.json (reviewresult)
  })

  //Add a new product
    app.post ('/products', async (req,res) => {
    const newproduct = req.body 
    const addedproduct = await coffeemachines.insertOne(newproduct);
    console.log('new product added to eplore page')
    res.json (addedproduct)
  })
  


  //Deleting a order

  app.delete ('/orders/:id', async (req, res) => {
    const id = req.params.id
    const query = {_id: ObjectID(id)}
    const result = await orderCollection.deleteOne(query)
    console.log('deleting user with id', result)
    res.json(result)

    
})

//deleting a product
  app.delete ('/products/:id', async (req, res) => {
    const id = req.params.id
    const query = {_id: ObjectID(id)}
    const result = await coffeemachines.deleteOne(query)
    console.log('deleting user with id', result)
    res.json(result)

    
})

//update an user

app.put ('/users', async (req, res) => {
 const user = req.body;
  const filter = {email: user.email};
  const updateDoc = {$set : {role: 'admin'}};
  const result = await usersCollection. updateOne(filter, updateDoc);
  res.json(result);

 })
app.put ('/orders/:id', async (req, res) => {
  const id = req.params.id
  const filter = {_id: ObjectID(id)}
  const updateDoc = {$set : {status: 'approved'}};
  const result = await orderCollection.updateOne(filter, updateDoc);
  res.json(result);

 })




    
    
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);

app.get ('/',(req, res) => {
    res.send ('something is sending')

} )

app.listen (port, () => {
    console.log('running in port', port)
})