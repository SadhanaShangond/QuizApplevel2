const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String },
  options: [
    {
      id: Number,
      value: String,
    },
  ],
  answer: {
    id: Number,
    value: String,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
