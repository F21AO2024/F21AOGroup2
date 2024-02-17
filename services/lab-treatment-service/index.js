import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

const port = process.env.PORT || 3002;
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

dotenv.config();

app.get('/', (req, res) => {
  res.send('Lab and Treatment Service API');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
