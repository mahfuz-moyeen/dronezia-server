const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();

// port
const port = process.env.PORT || 5000;


//middleware
app.use(express.json());
app.use(cors());


// mongodb server

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r2ma4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const inventoriesCollection = client.db("droneZia").collection("inventory");

        // /////////////////////// //
        //  Inventory section API  //
        // /////////////////////// //

        // get // 

        // all inventory items  // local server >> http://localhost:5000/inventories
        app.get('/inventories', async (req, res) => {
            const query = {}
            const cursor = inventoriesCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories)
        })

        // 6 inventory items  // local server >> http://localhost:5000/inventory
        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = inventoriesCollection.find(query);
            const inventories = await cursor.limit(6).toArray();
            res.send(inventories)
        })

        // single inventory item by id /// local server >>  http://localhost:5000/inventory/:id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const inventory = await inventoriesCollection.findOne(query);
            res.send(inventory);
        })


        // delete //

        // single inventory item // local server >> http://localhost:5000/inventory/:id
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await inventoriesCollection.deleteOne(query);
            res.send(result);
        })


        // post //

        // add single inventory item // local server >>  http://localhost:5000/inventory
        app.post('/inventory', async (req, res) => {
            const addInventoryItem = req.body
            const result = await inventoriesCollection.insertOne(addInventoryItem)
            res.send(result)
        })


        // put //

        // update quantity inventory item   // local server >> http://localhost:5000/inventory/:id
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const updateInventory = req.body
            const query = { _id: ObjectId(id) };
            const inventory = await inventoriesCollection.findOne(query);
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateInventory.name ? updateInventory.name : inventory.name,
                    price: updateInventory.price ? updateInventory.price : inventory.price,
                    quantity: updateInventory.quantity,
                    supplier: updateInventory.supplier ? updateInventory.supplier : inventory.supplier,
                    description: updateInventory.description ? updateInventory.description : inventory.description
                },
            };
            const result = await inventoriesCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })
        
        // get 
        // get item by user email  
        // local server >> http://localhost:5000/myItem?email=${user.email}
        // get orders 
        app.get('/myItem', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = inventoriesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(console.dir);


// server root
app.get('/', (req, res) => {
    res.send('drone war-house server is running...');
})

app.listen(port, () => {
    console.log('listening port: ', port);
})