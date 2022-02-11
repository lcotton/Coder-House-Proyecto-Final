import mongoose from "mongoose";

const User = mongoose.model("Users", {
  email: String,
  password: String,
  nombre: String,
  edad: Number,
  telefono: String,
  avatar: String
});

export { User };
