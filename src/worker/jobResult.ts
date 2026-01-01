import { pool } from "../db/pool";

export async function completeJob(jobId: string, workerId: string) {
  await pool.query(
    `
    UPDATE jobs
    SET status = 'COMPLETED',
        lease_owner = NULL,
        lease_expires_at = NULL,
        updated_at = NOW()
    WHERE id = $1
      AND lease_owner = $2
    `,
    [jobId, workerId]
  );
}


export async function failJob(
  jobId: string,
  workerId: string,
  error: string
) {
  await pool.query(
    `
    UPDATE jobs
    SET
      retry_count = retry_count + 1,
      status = CASE
        WHEN retry_count + 1 >= max_retries
        THEN 'DEAD_LETTER'
        ELSE 'RETRYABLE'
      END,
      next_run_at = CASE
        WHEN retry_count + 1 >= max_retries
        THEN NULL
        ELSE NOW() + (INTERVAL '1 second' * POWER(2, retry_count))
      END,
      last_error = $3,
      lease_owner = NULL,
      lease_expires_at = NULL,
      updated_at = NOW()
    WHERE id = $1
      AND lease_owner = $2
    `,
    [jobId, workerId, error]
  );
}