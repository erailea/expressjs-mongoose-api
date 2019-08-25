const mongoose = require('mongoose');
module.exports = () => {
    mongoose.connect('mongodb://movie_user:Aa1234@ds026558.mlab.com:26558/movieapi', {
        useCreateIndex: true,
        useNewUrlParser: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('MongoDB connected');
    });
}