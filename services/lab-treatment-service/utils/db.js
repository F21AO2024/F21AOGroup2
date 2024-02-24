import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.DATABASE_URL;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

export default mongoose;