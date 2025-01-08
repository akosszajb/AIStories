import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\S+@\S+\.\S+$/,
      "Please use a valid email address. (xyz@example.com)",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
