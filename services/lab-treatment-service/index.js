import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import entryRoutes from './routes/entry.routes.js';
import labRoutes from './routes/lab.routes.js';

const port = process.env.PORT || 3003;
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

dotenv.config();

app.get('/', (req, res) => {
  res.send('Lab and Treatment Service API');
});

app.get('/api/v1/labtreatment', (req, res) => {
  res.send('Lab and Treatment Service API');
});

app.get('/api/v1/labtreatment/entrys', (req, res) => {
  res.send('Lab and Treatment Service API');
});

app.use('/api/v1/labtreatment/entry', entryRoutes);
app.use('/api/v1/labtreatment/', labRoutes);

app.use

app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
