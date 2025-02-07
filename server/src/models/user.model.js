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
  plotCharacter: [
    {
      type: Schema.Types.ObjectId,
      ref: "PlotCharacter",
      required: true,
    },
  ],
  gameCharacter: [
    {
      type: Schema.Types.ObjectId,
      ref: "GameCharacter",
      required: true,
    },
  ],
  currentProfilePicture: {
    type: String,
    required: true,
    default:
      "https://image.pollinations.ai/prompt/avatarboy%20picture%20default?width=500&height=500&seed=1234&enhance=true&model=flux",
  },
  profilepictureURL: {
    type: Array,
    required: true,
    default: [
      "https://image.pollinations.ai/prompt/avatarboy%20picture%20default?width=500&height=500&seed=1234&enhance=true&model=flux",
    ],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
