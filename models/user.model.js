const {Schema, model} = require('mongoose');
const mongoose = require("mongoose");

const UserSchema = new Schema({
    id: { type: String, required: true, unique: true },
    phone:{type:String,unique:true,require:true},
    name:{type:String,require:true}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;