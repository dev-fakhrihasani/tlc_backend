import express from 'express';
import db from './config/Database.js';
// import Users from './models/UserModel.js';
import Counters from './models/CounterModel.js';
import Programs from './models/ProgramModel.js';
import Finances from './models/FinanceModel.js';


import UserRoute from './routes/UserRouter.js';
import CounterRoute from './routes/CounterRoute.js'
import ProgramRoute from './routes/ProgramRoute.js'
import FinanceRoute from './routes/FinanceRoute.js'

const app = express();

try {
  await db.authenticate();
  console.log('Database connected...');
  // await Finances.sync();
} catch (error) {
  console.error('Connection error:', error);
}

app.use(express.json())
app.use(UserRoute)
app.use(CounterRoute)
app.use(ProgramRoute)
app.use(FinanceRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(5000, () => {
  console.log('Server running on port 5000');
})