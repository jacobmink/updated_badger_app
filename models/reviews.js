const mongoose = require('mongoose');

 const reviewSchema = mongoose.Schema({
     reviewer_id:       {type: String, required: true},
     reviewee_id:       {type: String, required: true},
     text:              {type: String, required: true},
     stars:             {type: String, required: true}
 });

 module.exports = mongoose.model('Review', reviewSchema);