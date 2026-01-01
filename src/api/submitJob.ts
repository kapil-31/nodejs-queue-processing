import {
    IncomingMessage,ServerResponse
} from 'http'
import { createJob } from '../jobs/job.repository';
export async function submitJob(req:IncomingMessage,res:ServerResponse){

    let body ="";

    req.on('data',chunk=> (body +=chunk));
    req.on('end',async()=>{
        const  {type,payload,idempotencyKey}= JSON.parse(body)
        const jobId = await createJob(type,payload,idempotencyKey);

        res.writeHead(201,{"Content-Type":"application/json"});
        res.end(JSON.stringify({jobId}))
    })

}