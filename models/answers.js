import mongoose from mongoose

const answerSchema = new mongoose.Schema({
   exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
   },
   candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   },
   question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
   },
   answer: String,
   answerSet: String,   
})

export default mongoose.model("Answer", answerSchema)