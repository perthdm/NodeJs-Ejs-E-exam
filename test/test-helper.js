//inside tests/test_helper.js
const mongoose = require('mongoose');
//tell mongoose to use es6 implementation of promises
mongoose.Promise = global.Promise;
const uri = "mongodb+srv://test:p@ssw0rd@cluster0-muae2.mongodb.net/EXAMTEST?retryWrites=true";
mongoose.connect(uri, {
    useNewUrlParser: true
});
mongoose.connection
    .once('open', () => console.log('Connected!'))
    .on('error', (error) => {
        console.warn('Error : ', error);
});