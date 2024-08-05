const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
});


sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.log('Error: ' + err));


module.exports = sequelize;