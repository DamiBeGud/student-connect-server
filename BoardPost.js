const mongoose = require('mongoose')

const boardPostSchema = new mongoose.Schema({
    userID:{
        type: String,
    },
    firstname:{
        type: String,
        default: null
    },
    lastname:{
        type: String,
        default: null
    },
    profileImageUrl:{
        type:String,
        default:null
    },
    postText:{
        type:String,
        default:null,
    },
    imageUrl:{
        type:String,
        default:null
    },
    comments:{
        type: Array
    }

  
})


module.exports = mongoose.model("BoardPost", boardPostSchema)