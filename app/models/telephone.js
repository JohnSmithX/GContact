var schema = require('../../config/database')
  , Schema = require('jugglingdb').Schema;


var Telephone = module.exports = schema.define('Telephone', {
  user_id:    { type: Number },
  concat:     { type: String, length: 255 },
  type:       { type: String, limit: 45 },
  is_deleted: { type: Boolean }
}, {
  table: 'telephones'
});
//relation
var User = require('./user');
Telephone.belongsTo(User, { as: 'owner', foreignKey: 'user_id' });