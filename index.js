const express = require('express')
const cors = require('cors')
const session = require('express-session')
const dotenv = require('dotenv')
const SequelizeStore = require("connect-session-sequelize")
const FileUpload = require("express-fileupload")
const db = require('./config/Database.js')
const Sequelize = require('sequelize')

// import MODELS for create DB
const Users = require('./models/UserModel.js')
const Counters = require('./models/CounterModel.js')
const Programs = require('./models/ProgramModel.js')
const Finances = require('./models/FinanceModel.js')
const Blogs = require('./models/BlogModel.js')
const Partners = require('./models/PartnerModel.js')
const Testimony = require('./models/TestimonyModel.js')
const Volunteer = require('./models/VolunteerModel.js')

// import ROUTES
const UserRoute = require('./routes/UserRouter.js')
const CounterRoute = require('./routes/CounterRoute.js')
const ProgramRoute = require('./routes/ProgramRoute.js')
const FinanceRoute = require('./routes/FinanceRoute.js')
const AuthRoute = require('./routes/AuthRoute.js')
const BlogRoute = require('./routes/BlogRoute.js')
const PartnerRoute = require('./routes/PartnerRoute.js')
const TestimonyRoute = require('./routes/TestimonyRoute.js')
const VolunteerRoute = require('./routes/VolunteerRoute.js')

dotenv.config()
const app = express();

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

db.define("sessions", {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  userId: Sequelize.STRING,
  expires: Sequelize.DATE,
  data: Sequelize.TEXT,
});

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId,
  };
}

const sessionStore = SequelizeStore(session.Store)
var store = new sessionStore({
  db: db,
  table: "sessions",
  extendDefaultFields: extendDefaultFields
})


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

db.sync()

app.listen(process.env.APP_PORT, () => {
  console.log('Server up and running in port 5000....');
})