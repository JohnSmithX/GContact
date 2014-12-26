var schema = require('../../config/database')
  , Schema = require('jugglingdb').Schema;


var Organization = module.exports = schema.define('Organization', {
  org_name:   { type: String, length: 255 },
  org_code:   { type: String, length: 255 },
  created_at: { type: Date, null: false },
  updated_at: { type: Date, null: false },
  father_id:  { type: Number, null: false },
  layer:      { type: Number }
}, {
  table: 'organizations'
});


