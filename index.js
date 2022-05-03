const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


// port
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(express.json());
app.use(cors());

// mongodb server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irqio.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('mongo db runinng');
    client.close();
});



// server root
app.get('/', (req, res) => {
    res.send('drone war-house server is running...');
})

app.listen(port, () => {
    console.log('listening port: ', port);
})