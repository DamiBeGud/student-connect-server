const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userID:{
        type: String,
        default: null
    },
    firstname:{
        type: String,
        default: null
    },
    lastname:{
        type: String,
        default: null
    },
    profilePictureURL:{
        type:String,
        default: null
    },
    description:{
        type:String,
        default: null
    },
    cityFrom:{
        type:String,
        default: null
    },
    cityBorn:{
        type:String,
        default: null
    },
    countryBorn:{
        type:String,
        default: null
    },
    dateOfBirth:{
        type: String,
        default: null
    },
    universityName:{
        type:String,
        default: null
    },
    universityMajor:{
        type:String,
        default: null
    },
    interests:{
        sports:{
            type: Array
        },
        movies:{
            type: Array
        },
        music:{
            type: Array
        }
    },
    friends:{
        type:Array
    }

})


module.exports = mongoose.model("Profile", profileSchema)