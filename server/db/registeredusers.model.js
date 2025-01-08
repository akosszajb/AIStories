import mongoose from "mongoose";

const { Schema } = mongoose;

const RegisteredUserSchema = new Schema({
  users: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const RegisteredUserModel = mongoose.model(
  "RegisteredUser",
  RegisteredUserSchema
);

export default RegisteredUserModel;
