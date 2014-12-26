var schema = require('../../config/database')
  , Schema = require('jugglingdb').Schema;


var Chat = module.exports = schema.define('Chat', {
  user_id:      { type: Number },
  chat_room_id: { type: Number },
  to_sb:        { type: Number },
  at_sb:        { type: Number },
  content:      { type: Schema.Text },
  created_at:   { type: Date, null: false }
}, {
  table: 'chat_messages'
});


//relation

var User = require('./user')
  , ChatRoom = require('./chat_room');

Chat.belongsTo(User, { as: 'creator', foreignKey: 'user_id' });
Chat.belongsTo(ChatRoom, { as: 'whichRoom', foreignKey: 'chat_room_id' });