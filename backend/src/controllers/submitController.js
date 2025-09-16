const {
  UserQuiz: UserQuizModel,
  QUIZ_STATUS_PENDING,
  QUIZ_STATUS_COMPLETED,
} = require("../models/userQuizModel");

const Question = require("../models/questionModel.js");
const User = require("../models/userModel.js");

const submitQuiz = async(req,res)=>{
    try{
        //Find the current Quiz
        let userCurrentQuiz = await UserQuizModel.findOne({
            user_id:req.user._id,
            quiz_status:QUIZ_STATUS_PENDING,
        })
        if(!userCurrentQuiz){
            return res.status(500).json({success:false,message:"NO active quiz for the user"});
        }

        //Mark the Quiz as completed and save it
        userCurrentQuiz.quiz_status = QUIZ_STATUS_COMPLETED;

        //Increase the attempts count
        const user = await User.findOne({_id:req.user._id});
        user.quiz_attempts= user.quiz_attempts +1;
         user.save();
        userCurrentQuiz.save();

        //Create two arrays for showing what questions we selected wrong what is there correct answer

        let incorrect_questions = [];
        let correct_questions =[];

        //loop through all Quiz questions
        for(const userQuestion of userCurrentQuiz.questions){
            const questionModel = await Question.findById(userQuestion.question_id);
            //Build Data object for each question
            let _data =
            {
                question_id:userQuestion.question_id,
                question:questionModel.question,
                answer:questionModel.answer,
                attempted:userQuestion.attempted,
                answer_status:userQuestion.answer_status,
                submitted_answer:userQuestion.submitted_answer,
            }
            //check answer are correct or not and close the loop
            if(questionModel.answer.id === userQuestion.submitted_answer.id && questionModel.answer.value === userQuestion.submitted_answer.value){
                correct_questions.push(_data);
            }else{
                incorrect_questions.push(_data);
            }
        }

        return res.send({
            status:true,
            result:userCurrentQuiz.result,
            incorrect_questions,correct_questions,
        })
    }
    catch(error)
    {
         console.error("Error,fetching Quiz: ",error);
         return res.status(500).json({success:false,    
             message:error.message});
    }
}

const completedQuizQuestions = async (req, res) => {
  try {
    //Find the current Quiz
    let userCurrentQuiz = await UserQuizModel.find({
      user_id: req.user._id,
      quiz_status: QUIZ_STATUS_COMPLETED,
    }).sort({ createdAt: -1 });

    let incorrect_questions = [];
    let correct_questions = [];
    console.log(userCurrentQuiz);

    if (userCurrentQuiz.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "No  quiz for the user Found" });
    }

    //Loop through all Quiz questions
    for (const userQuestion of userCurrentQuiz[0].questions) {
      const questionModel = await Question.findById(userQuestion.question_id);

      //Build Data object for each question

      let _data = {
        question_id: userQuestion.question_id,
        question: questionModel.question,
        answer: questionModel.answer,
        attempted: userQuestion.attempted,
        answer_status: userQuestion.answer_status,
        submitted_answer: userQuestion.submitted_answer,
      };

      //Check answers are correct or not and close the loop.

      if (
        questionModel.answer.id === userQuestion.submitted_answer.id &&
        questionModel.answer.value === userQuestion.submitted_answer.value
      ) {
        correct_questions.push(_data);
      } else {
        incorrect_questions.push(_data);
      }
    }

    return res.send({
      success: true,
      result: userCurrentQuiz[0].result,
      incorrect_questions,
      correct_questions,
    });
  } catch (error) {
    console.error("Error, Fetching Quiz");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { submitQuiz, completedQuizQuestions };
