import { pool } from "../db/pool";

export async function claimJob(workerId: string) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      WITH job AS (
        SELECT id
        FROM jobs
        WHERE status IN ('PENDING', 'RETRYABLE')
        AND next_run_at <= NOW()
        ORDER BY created_at
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      UPDATE jobs
      SET
        status = 'IN_PROGRESS',
        lease_owner = $1,
        lease_expires_at = NOW() + INTERVAL '30 seconds',
        updated_at = NOW()
      WHERE id = (SELECT id FROM job)
      RETURNING *;
      `,
      [workerId]
    );

    await client.query("COMMIT");

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
