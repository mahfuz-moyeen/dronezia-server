const express = require('express');
const cors = require('cors');

// port
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(express.json());
app.use(cors());


// server root
app.get('/', (req, res) => {
    res.send('drone war-house server is running...');
})

app.listen(port, () => {
    console.log('listening port: ', port);
})