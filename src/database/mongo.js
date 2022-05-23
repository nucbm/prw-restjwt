// ./src/database/mongo.js


var mongoose = require('mongoose');

let database = null;

async function startDatabase() {
  mongoose.connect('mongodb://localhost:27017/dbads', {useNewUrlParser: true, useUnifiedTopology: true});
  database = mongoose.connection;

  database.on('connected', function() {
    console.log('database is connected successfully');
  });

  database.on('disconnected',function(){
    console.log('database is disconnected successfully');
  })

  database.on('error', console.error.bind(console, 'connection error:'));

}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  mongoose,
  getDatabase,
  startDatabase,
};

/*

// create schema
var userSchema = new mongoose.Schema({
            student: String,
            account: String
});
var students = mongoose.model('users', userSchema);
students.find({}, function(err, data) {
console.log(err,'\n\n', data, '\n\n', data.length, ' inregistrari afisate\n');
})
*/