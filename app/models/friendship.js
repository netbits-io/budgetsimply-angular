var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FriendshipSchema = new Schema({
    users: [{ email: String, name: String, accepted: Boolean }],
    date: Date,
    accepted: Boolean,
    rejected: Boolean
});

module.exports = mongoose.model('Friendship', FriendshipSchema);
