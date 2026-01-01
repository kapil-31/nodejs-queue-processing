import {pool } from '../db/pool';
import {randomUUID} from 'crypto'


export async function createJob(
    type:string,payload:unknown,idempotencyKey?:string
){
    const id  = randomUUID();
    await pool.query(`
        INSERT INTO
         jobs (id,type,payload,status,idempotency_key) VALUES ($1,$2,$3,'PENDING',$4) 
         ON CONFLICT (idempotency_key) DO NOTHING`,
        [id,type,payload,idempotencyKey])
        return id;
}