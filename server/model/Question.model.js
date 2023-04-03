import mongoose from "mongoose";

const QuestionMongoDBSchema = new mongoose.Schema({
  questionName: String,
  questionUrl: String,
  category: String,
  createdAt: String,
  answers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answers",
  },
  user: Object,
});

export default mongoose.model.Questions || mongoose.model("Questions", QuestionMongoDBSchema);