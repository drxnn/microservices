import mongoose from "mongoose";
import { Password } from "../services/password";
// An interface that describes the properties
// that are required to create a new User

interface UserAttributes {
  email: string;
  password: string;
}

// an interface that describes the properties that a User model has:
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttributes): UserDoc;
}

// an interface that describes the properties that a Users document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// using function keyword so I can access this keyword
// a pre hook runs before a document is saved to a database
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
