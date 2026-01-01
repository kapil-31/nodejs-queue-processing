import "dotenv/config";

import http from 'http';
import {submitJob} from './api/submitJob'

console.log(process.env)


const server = http.createServer((req,res)=>{
    if(req.method ==='POST' && req.url ==='/jobs'){
        submitJob(req,res);
        return ;
    }

    res.writeHead(404);
    res.end()
})


server.listen(3000,()=>{
    console.log("Server listening at 3000")
})