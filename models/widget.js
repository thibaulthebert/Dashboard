// Call the dependence.
const mongoose = require('mongoose');

// Descrition of the widget schema
var widget = mongoose.Schema({
    widgetName: String,
    userName: String,
    description: String,
    url: String
});

// Export the schema to use it in different files.
var widget = module.exports = mongoose.model('widget', widget);

