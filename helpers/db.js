const mongoose = require('mongoose');
module.exports = () => {
    mongoose.connect('mongodb+srv://erailea:gjqWG4L3SoYqAHfC@cluster0.1ghqd.mongodb.net/movieapi?retryWrites=true&w=majority', {
        useCreateIndex: true,
        useNewUrlParser: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('MongoDB connected');
    });
}
