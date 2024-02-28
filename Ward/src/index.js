const express = require('express');
const wardRouter = require('./routes/ward.routes');
const connectToDbFunc = require('./config/dbConnect');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

setTimeout(() => {
    connectToDbFunc();
}, 2000);


app.use(wardRouter)

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})