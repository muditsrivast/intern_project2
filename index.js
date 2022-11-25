
const mongoose = require("mongoose");
const router = require("express");
const express = require("express");

const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("./models/verifytoken");

const app = router();
const User = require("./models/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
app.use(express.json());


mongoose.connect("mongodb+srv://mudit:mudit@cluster0.yeytv7c.mongodb.net/?retryWrites=true&w=majority").then(() => console.log("db successful")).catch((err) => {
    console.log("getting error");
});



const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{ 
        user: 'mudit0462@gmail.com',
        pass: 'sbehfuyefcggzslg'
    }
})



// REGISTER

app.post("/register", async (_req, res) => {
  console.log("workijg");
  const newUser = new User({
   first_name: _req.body.first_name,
    email: _req.body.email,
    age: _req.body.age,
    
    password: CryptoJS.AES.encrypt(
      _req.body.password,
      "Mudit"
    ).toString(),
  });
 
  try {
    const savedUser = await newUser.save();
    const details = {
      form: "Registered sucessfully <mudit@gmail.com> ",
      to: newUser.email,
      subject: "Signup Verification mail",
      text: "U have successfully created an account"
  }
    mailTransporter.sendMail(details,err =>{
        if(err)
        {
         console.log("Error Found",err);
        }
        else
        console.log("email has sent");
     });
     const accessToken = jwt.sign(
      {
          id: newUser._id, 
      },
      "Mudit",
          {expiresIn:"1d"}
      );
    console.log("yes its done");
    res.status(201).json({"status":200,"message": "success","token":accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN

app.post('/login', async (req, res) => {
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
            {expiresIn:"1d"}
        );
        // console.log(accessToken);
        
        res.status(200).json({"status":200,"message": "success","token":accessToken});

    }catch(err){
        res.status(500).json(err);
    }

});


app.get("/about" , (req,res) => {
    res.send("This is a RESTAPI for an ecommerce website u may have various options   1./api/users 2.  /api/auth 3. /api/products 4. /api/carts 5. /api/orders/order 6. /api/checkout ");
    
});

app.listen(5000,"localhost", () => { 
    console.log("backend is running");
})
