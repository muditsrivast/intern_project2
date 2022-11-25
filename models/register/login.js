const router = require("express").Router();
const User = require("/models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
router.get("/",(req,res)=>{
  res.send("Welcome to Auth");
})

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{ 
        user: 'mudit0462@gmail.com',
        pass: 'xcothyxarfjolfcs'
    }
})
const details = {
    form: "mudit0462@gmail.com",
    to: "kaushikey945022@gmail.com",
    subject: "signup verification mail",
    text: "U have created an account"
}
mailTransporter.sendMail(details,err =>{
   if(err)
   {
    console.log("Error Found",err);
   }
   else
   console.log("email has sent");
})

//REGISTER

router.post("/register", async (req, res) => {
  const newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    age: req.body.age,
    city: req.body.city,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      "Mudit"
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    mailTransporter.sendMail(details,err =>{
        if(err)
        {
         console.log("Error Found",err);
        }
        else
        console.log("email has sent");
     })
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne(
            {
                email: req.body.email
            }
        );

        !user && res.status(401).json("Wrong Email");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            "Mudit"
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        
        originalPassword != inputPassword && 
            res.status(401).json("Wrong Password");
 
        const accessToken = jwt.sign(
        {
            id: user._id, 
        },
        "Mudit",
            {expiresIn:"3d"}
        );
        console.log(accessToken);
        
        res.status(200).json(accessToken);

    }catch(err){
        res.status(500).json(err);
    }

});

module.exports = router;