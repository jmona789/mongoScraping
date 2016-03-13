var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataSchema = new Schema({
  data: {
    type:String
  },
  //Have the Schema take an array named "notes" which consists of an array of ObjectIds from the Note Collection
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

var Data = mongoose.model('Data', DataSchema);
module.exports = Data;