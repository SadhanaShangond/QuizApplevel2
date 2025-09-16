const {UserQuiz:UserQuizModel, QUIZ_STATUS_PENDING, ANSWER_STATUS_PENDING, ANSWER_STATUS_RIGHT, ANSWER_STATUS_WRONG} = require("../models/userQuizModel.js");
const Question = require("../models/questionModel.js");

const MAX_QUESTION_COUNT = 30;

const getQuestions = async(req,res)=>{
    try {
        //Fing incomplete quiz for the user and populate questions details in one query

        let userQuiz = await UserQuizModel.findOne({
            user_id :req.user._id,
            quiz_status:QUIZ_STATUS_PENDING,
        }).populate("questions.question_id","question options");

        //if no incomplete quiz exists,create a new one
        if(!userQuiz){
            //get randon questions from the data base without answers
            const randomQuestions = await Question.aggregate([
                {$sample :{size:MAX_QUESTION_COUNT}},{$project:{question:1,options:1}},
            ])
            //format questions for user quiz document
            const quizQuestions = randomQuestions.map((question) => ({
              question_id: question._id,
              attempted: false,
              answer_status: ANSWER_STATUS_PENDING,
              submitted_answer: null,
            }));
            //Create a new quiz and Save
             userQuiz = await new UserQuizModel({
             user_id: req.user._id,
             quiz_status: QUIZ_STATUS_PENDING,
             questions: quizQuestions,
             }).save();

             
             //populate the newly created quiz with question details
             userQuiz = await userQuiz.populate("questions.question_id", "question options");
             
            }
            //Format the response data by combining question content with the user progress

            const questions = userQuiz.questions
              .map((q) => {
                if (!q.question_id) {
                  return null;
                }
                return {
                  _id: q.question_id._id,
                  question: q.question_id.question,
                  options: q.question_id.options,
                  attempted: q.attempted,
                  answer_status: q.answer_status,
                  submitted_answer: q.submitted_answer,
                };
              })
              .filter((q) => q !== null); //Remove all null entries

            res.status(200).json({
              success: true,
              questions,
            });

        
    } catch (error) {
         console.error(error.message);
    res.status(400).send("Something went wrong while fetching the Question");
  }
  }

//validate the answer

const validateAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    // Validate
    if (!questionId || !answer || !answer.id || !answer.value) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(400).json({ message: "Question doesn't exist" });
    }

    // Compare answer
    let answerStatus = false;
    if (
      question.answer.id === answer.id &&
      question.answer.value === answer.value
    ) {
      answerStatus = true;
    }

    // Update user quiz
    const updateUserQuiz = await UserQuizModel.findOneAndUpdate(
      {
        "questions.question_id": questionId,
        user_id: req.user._id,
        quiz_status: QUIZ_STATUS_PENDING,
      },
      {
        $set: {
          "questions.$.attempted": true,
          "questions.$.answer_status": answerStatus
            ? ANSWER_STATUS_RIGHT
            : ANSWER_STATUS_WRONG,
          "questions.$.submitted_answer": answer,
        },
      },
      { new: true }
    );

    // Update result if method exists
    await updateUserQuiz?.updateResult();

    return res.status(200).json({
      status: answerStatus ? 1 : 0,
      message: answerStatus ? "Correct answer" : "Wrong answer",
      submitted_answer: answer,
      correct_answer: question.answer,
    });
  } catch (error) {
    console.error("Error validating answer: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getQuestions, validateAnswer };
   
