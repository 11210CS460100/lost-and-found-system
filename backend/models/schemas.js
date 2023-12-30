const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define the schema for items
const itemSchema = new Schema({
    description: { type: String, required: true },
    picture: { type: String, required: true }, // the url for the image
    dateLost: { type: Date }, // This can be optional
    locationFound: { type: String },
    status: { type: String, default: 'Unclaimed' }, // e.g., 'Claimed', 'Unclaimed'
    finder_name: { type: String, default: 'Anonymous' }
});

const Items = mongoose.model('Items', userSchema, 'items')
const mySchemas = {'Items':Items}

module.exports = mySchemas
