import express from 'express';
import db from './config/Database.js';
// import Users from './models/UserModel.js';
import Counters from './models/CounterModel.js';
import UserRoute from './routes/index.js';
import CounterRoute from './routes/CounterRoute.js'

const app = express();

try {
  await db.authenticate();
  console.log('Database connected...');
  // await Counters.sync();
} catch (error) {
  console.error('Connection error:', error);
}

app.use(express.json())
app.use(UserRoute)
app.use(CounterRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(5000, () => {
  console.log('Server running on port 5000');
})