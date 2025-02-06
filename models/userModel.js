const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate:{
            validator: function (email) {
              return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(email);
            },
            message: "Email must end with @____.com",
        }
      },
      password: {
        type: String,
        required: true
      }
})

const UserModel = mongoose.model("user",userSchema);

module.exports=UserModel;