const mongoose = require('mongoose')



mongoose.connect(process.env.db_URL,{
    dbName : process.env.db_Name,
    user : process.env.User_name,
    pass : process.env.User_pass,
    
})
.then(()=>{
    console.log('Mongo DB is connected');
})
.catch(err=>{
    console.log(err.message);
})



mongoose.connection.on('connected',()=>{
    console.log('Mongoose is connected to DB');
})



mongoose.connection.on('error',(err)=>{
    console.log(err.message);
})



mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose connection is disconnected');
})



process.on('SIGINT',async()=>{
    await mongoose.connection.close()
    process.exit(0)
})