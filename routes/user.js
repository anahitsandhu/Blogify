const express = require('express');  
const router = express.Router();     

const User=require('../models/user');

router.get('/signin',(req,res)=>{
    return res.render("signin");
}); 

router.get('/signup',(req,res)=>{
    return res.render("signup");
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Check if response is already sent (just in case)
    if (res.headersSent) {
      console.log("Response already sent before redirect.");
      return;
    }

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error("Error during signin:", error);

    if (res.headersSent) return; // prevent double send

    return res.render("signin", {
      error: "Incorrect Email and Password",
    });
  }
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect("/");
})


router.post('/signup',async(req,res)=>{
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});

module.exports=router;