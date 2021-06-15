let redis = require('redis') ;
let client = redis.createClient() ;

client.on("error",(err)=>{
    console.log("redis error->" , err) ;
}) ;

module.exports = client ;