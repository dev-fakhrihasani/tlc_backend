import express from 'express';
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'
import SequelizeStore from "connect-session-sequelize"
import FileUpload from "express-fileupload"
import db from './config/Database.js';

// import MODELS for create DB
import Users from './models/UserModel.js';
import Counters from './models/CounterModel.js';
import Programs from './models/ProgramModel.js';
import Finances from './models/FinanceModel.js';
import Blogs from './models/BlogModel.js';
import Partners from './models/PartnerModel.js';
import Testimony from './models/TestimonyModel.js';
import Volunteer from './models/VolunteerModel.js';

// import ROUTES
import UserRoute from './routes/UserRouter.js';
import CounterRoute from './routes/CounterRoute.js'
import ProgramRoute from './routes/ProgramRoute.js'
import FinanceRoute from './routes/FinanceRoute.js'
import AuthRoute from './routes/AuthRoute.js'
import BlogRoute from './routes/BlogRoute.js'
import PartnerRoute from './routes/PartnerRoute.js'
import TestimonyRoute from './routes/TestimonyRoute.js'
import VolunteerRoute from './routes/VolunteerRoute.js'

dotenv.config()
const app = express();

const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({
  db: db
})

// //command for create table
// (async () => {
//   await db.sync()
// })()

// // command for drop table
// (async () => {
//   await Finances.drop()
// })()

// try {
//   await db.authenticate();
//   console.log('Database connected...');
//   // await Users.sync();
//   // await Blogs.sync();
//   await Finances.sync();
// } catch (error) {
//   console.error('Connection error:', error);
// }

app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: 'auto'
  }
}))

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))


app.use(express.json())

app.use(FileUpload())
app.use(express.static("public"))

app.use(UserRoute)
app.use(CounterRoute)
app.use(ProgramRoute)
app.use(FinanceRoute)
app.use(AuthRoute)
app.use(BlogRoute)
app.use(PartnerRoute)
app.use(TestimonyRoute)
app.use(VolunteerRoute)

// store.sync()

app.listen(process.env.APP_PORT, () => {
  console.log('Server up and running in port 5000....');
})