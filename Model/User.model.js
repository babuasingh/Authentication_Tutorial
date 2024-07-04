const mongoose =require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')




const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    }
})


//mongoose middlewares 
// pre is fired before the middleware('save' in this case)
// post is fired after the middleware('save' in this case)
UserSchema.pre('save',async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password,salt)
        this.password=hashPassword
        next()
    } catch (error) {
        next(error.message)
    }
})


UserSchema.methods.isValidPassword = async function (password){
    try {
        return await bcrypt.compare(password,this.password)
    } catch (error) {
        throw(error)
    }
}



const User=mongoose.model('User',UserSchema);
module.exports = User