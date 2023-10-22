const express = require('express')
const mongoose = require('mongoose')
const bycrypt = require('bcryptjs')
const User = require('./User')
const Profile = require('./Profile')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const PORT = 8080;

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
const connectDB = async ()=>{
    try {
      const connect = await mongoose.connect('mongodb://localhost:27017/StudentConnect')
      // || 'mongodb://localhost:27017/test'
      console.log(`Mongo DB conneced: ${connect.connection.host}`)
    } catch (error) {
      console.log(`Error: ${error.message}`)
      process.exit(1)
    }
}

app.post("/register",cors(), async (req, res)=>{
    try {     
        // get all data from Body
        const {firstname, lastname, email, password} = req.body
        // all the data should exist
        // console.log(firstName, lastName, email, password)
        if(!(firstname && lastname && email && password)){
            return res.status(404).send('One of the fields is missing')
        }
        // check if user already exists
        const existingUser = await User.findOne({email})
        if(existingUser){
           return res.status(404).send('User with this email already exists')
        }
        // encrypt the password
        const hashedPassword = await bycrypt.hash(password, 10)
        // save the user in DB 
            const user =  await User.create({
                firstname,
                lastname,
                email,
                hashedPassword
            })
        // save the profile in DB 
        
        await Profile.create({
            userID: user._id,
            firstname,
            lastname,
        })
        // generate a token for user and Send it
        const token = jwt.sign(
            {id: user._id, email},
            'shhhh', // later on change for process.env 
            {
                expiresIn: "2h"
            }
        )
        user.token = token
        user.hashedPassword = undefined


        res.status(200).json({
            success: true,
            registerd: true
        })
    } catch (error) {
        res.status(404).send('It seems something went wrong' + error)
        console.log(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        //get all data from frontend
        const {email, password} = req.body
        //all data should exist
        if(!(email && password)){
            return res.status(400).send('email or password is missing')
        }
        console.log('All Data exists')
        //find user in DB
        const user = await User.findOne({email})
        //if user does not exist
        if(!user){
            console.log(`User with ${email} doesnt exist. Pleas register first`)
            return res.status(300).send(`User with ${email} doesnt exist. Pleas register first`)
        }
        console.log('User exists')
        //match the password
        const passwordMatch = await bycrypt.compare(password, user.hashedPassword)
        
        console.log(passwordMatch)
        if(passwordMatch){
            const token = jwt.sign(
                {id: user._id},
                'shhhh',
                {
                    expiresIn:"24h"
                }
            )

            user.token = token
            user.password = undefined
            
            console.log('password matched')
            //cookie section
            const options = {
                expires: new Date(Date.now() + 2 * 60 * 1000),
                httpOnly: true
            }
            // send a token
            res.status(200).cookie("token", user.token, options).json({
                success: true,
                login:true,
                id:user._id,
                token:user.token
            })
        }
        else{
            return res.status(300).send('Password does not match')
        }

    } catch (error) {
        console.log(error)
    }
})

app.get("/profile/:id", async(req, res) => {
    const id = req.params.id
    //find profile with id
    const findProfile = await Profile.findOne({userID:id})
    //send profile data
    res.json(findProfile)
})
app.post('/profile/update/:id', async (req, res)=>{
    //recive data
    const {
            description,
            cityFrom,
            cityBorn,
            countryBorn,
            dateOfBirth,
            universityName,
            universityMajor
    } = req.body
    const id = req.params.id
    //find user in DB and update fields in DB
    await Profile.findOne({userID:id}).updateOne({            
        description,
        cityFrom,
        cityBorn,
        countryBorn,
        dateOfBirth,
        universityName,
        universityMajor})
    // response
    res.status(200).json({
        success: true
    })


})
connectDB().then(()=>{
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  
  })