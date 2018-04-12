var mongoose = require('mongoose');

// var questionObj = {

//   question = "",
//   mc_options = ["A.", "B.", "C.", "D."],
//   answer = ""

// };

var Quiz = mongoose.model('Quiz', {
  title: {
    type: String,
    //required: true,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    minlength: 1
  },

  participants:{
     type : Array ,
     "default" : []
   },
  questions:[{
    question:{
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    key: {
      type: Number
    }
  }],
  // questions:{
  //    type : Array ,
  //    "default" : []
  // },  

   completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: String,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
});

module.exports = {Quiz};

