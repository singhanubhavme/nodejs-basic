import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
