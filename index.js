const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId ;
require('dotenv').config()
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json())

// database connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8uu4i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

 async function run(){
     try{
        await client.connect();
        const database = client.db("tourism_agencies");
        const tourPackage = database.collection("travel");
        const orderPackage = database.collection("order");

        app.get('/travels', async(req, res)=>{
            const cursor = tourPackage.find({});
            const travel= await cursor.toArray();
            res.send(travel)
        })
     
         // load service details use get api
        app.get('/travels/:id', async(req, res)=>{
            const id = req.params.id ;
            console.log('hitting data', id)
            const query = {_id:ObjectId(id)}
            const details = await tourPackage.findOne(query);
            res.send(details)
        })
      
        // delete api
        app.delete('/travels/:id', async(req, res)=>{
            const Id = req.params.id;
            const query ={_id:ObjectId(Id)}
            const result= await tourPackage.deleteOne(query)
            res.json(result);
        })

        app.post('/travel', async(req, res)=>{
            const travel = req.body; 
            console.log('hitting data', travel)
            const result = await orderPackage.insertOne(travel);
            console.log(result)
            res.json(result)
        })




     }
     finally{
        // await client.close();
     }
 }
 run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Hello this is server')
})

app.listen(port, ()=>{
    console.log('Running port server', port)
})