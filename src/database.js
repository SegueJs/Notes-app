const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes-db-app')
    .then(db => console.log('db is connected'))
    .catch(err => console.log(err))