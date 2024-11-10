import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

export interface User extends Document {
    username: string;
    email: string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessage:boolean;
    message:Message[]
    isVerified:boolean;
  }

const userSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,'Username must me required'],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,'Email must be required'],
        unique:true,
        match:[/.+\@.+\..+/,'Please enter valid email']
    },
    password:{
        type:String,
        required:[true,'Password must be required'],   
    },
    verifyCode:{
        type:String,
        required:[true,'verify code is required'],   
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'verify code Expiry is required'],   
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    message:[messageSchema]
})


const User  = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",userSchema))
// const Message  = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>("Message",messageSchema))
export default User