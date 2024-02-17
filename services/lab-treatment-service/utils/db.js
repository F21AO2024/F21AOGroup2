import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.MONGODB_URI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

export default mongoose;