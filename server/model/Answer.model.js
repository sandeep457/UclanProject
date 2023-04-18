import mongoose from "mongoose";

const AnswerMongoDBSchema = new mongoose.Schema({
  answer: String,
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions",
  },
  createdAt: String,
  likes: Number,
  user: String,
});

export default mongoose.model.Answers || mongoose.model("Answers", AnswerMongoDBSchema);