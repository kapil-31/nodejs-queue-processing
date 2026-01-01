import {pool} from '../db/pool';


export async function renewLease(jobId:string,workerId:string){
    const res = await pool.query(`
        UPDATE jobs
         SET lease_expires_at = NOW() + INTERVAL '30 seconds',
         updated_at = NOW()
         WHERE id = $1 AND lease_owner = $2 AND status = 'IN_PROGRESS'
        `,[jobId,workerId])

}