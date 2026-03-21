const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

let mongoose = require('mongoose');

const server = process.env.DB_SERVER;
const database = process.env.DATABASE;

class Database {
  constructor() {
    this._connect()
  }

  _connect() {
    mongoose.connect(`${server}/${database}`)
      .then(() => {
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error('Database connection error')
        console.log(err)
      })
  }
}

module.exports = new Database()

