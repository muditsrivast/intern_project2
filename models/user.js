
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(   
  {
    first_name: { type: String},
    last_name: { type: String,},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age:{ type: Number,required:true},
    city:{ type: String},
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);

