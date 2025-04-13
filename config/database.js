// config/database.js
const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();


// PostgreSQL configuration
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    logging: false
  }
);

// Test PostgreSQL connection
(async () => {
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL connected...');
    } catch (err) {
      console.error('Unable to connect to PostgreSQL:', err.message);
    }
  })();


// MongoDB configuration
const mongoConnection = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err.message));


module.exports = {
  sequelize,
  mongoConnection: mongoose.connection
};