const mongoose = require('mongoose');

const URL = 'mongodb+srv://yanatska:yoOi3mxnL5e9q9eO@cluster0.dhyuhhv.mongodb.net/shop?retryWrites=true&w=majority';

const mongooseConnect = async () => {
    return await mongoose.connect(URL);
};

module.exports = mongooseConnect;