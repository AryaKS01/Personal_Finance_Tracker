const express = require('express');
const app = express();
require('dotenv').config();
const dbserver=require('./config')
const UserRouter=require('./routes/userRoutes');
const TsRouter=require('./routes/transactionRoutes')
const authMw=require('./middleware/Auth');
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/user",UserRouter);
app.use("/transaction",authMw(),TsRouter);

const PORT= process.env.PORT;
app.listen(PORT, async()=>{
    try{
        await dbserver();
        console.log(`server started on ${PORT}`)
    }catch(err){
        console.log("server failed to run...",err)
    }
})