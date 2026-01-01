export async function executeJob(job:any){
    switch(job.type){
        case 'email':
            await sendEmail(job.payload);
            break;

        case 'log':
            console.log('LOG: JOB:', job.payload);
            break;

        default:
            throw new Error(`unknown job type: ${job.type}`)
    }

}

async function sendEmail(payload:any){

    await new Promise(res=> setTimeout(res,200));

    console.log('Email sent to:', payload.to)

}