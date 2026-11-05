const express = require("express");
const path = require("path");

const {connection} = require("./db");
const {userRouter} = require("./routes/user.route");
const {auth} = require("./middleware/auth.middleware");
const { noteRouter } = require("./routes/note.route");



const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user",userRouter);
app.use("/notes", auth, noteRouter);



app.get("/home", (req,res)=>{
    res.send({msg:"Welcome to note application"});
});


//auth middlewere
app.use(auth);


//private route
app.get("/dashboard", (req,res)=>{
    res.send({msg:"Welcome to dashboard"});
});


app.listen(8080,async()=>{

    try{
        await connection;
        console.log("DB connected");

    } catch(error){
        console.log("error", error.message);
    }
    console.log("Server connected");
});