const express = require('express');
const connectToDbFunc = require('./config/dbConnect');
const router = require('./routes/ward.route');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

setTimeout(() => {
    connectToDbFunc();
}, 2000);


app.use(router)

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})