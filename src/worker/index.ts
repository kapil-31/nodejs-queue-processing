import "dotenv/config"
import { claimJob } from "./claimJob";
import { executeJob } from "./executeJob";
import { completeJob, failJob } from "./jobResult";
import { renewLease } from "./heartbeat";

const WORKER_ID = `worker-${process.pid}`;
const HEARTBEAT_INTERVAL = 10_000; // 10 seconds

async function run() {
  while (true) {
    const job = await claimJob(WORKER_ID);
    console.log('RUNING...',WORKER_ID)

    if (!job) {
      await sleep(2000);
      continue;
    }

    let heartbeatTimer: NodeJS.Timeout | null = null;

    try {
    
      heartbeatTimer = setInterval(() => {
        renewLease(job.id, WORKER_ID).catch(err => {
          console.error(" Lost lease, exiting worker", err);
          process.exit(1); 
        });
      }, HEARTBEAT_INTERVAL);

      await executeJob(job);

      await completeJob(job.id, WORKER_ID);
    } catch (err: any) {
      await failJob(job.id, WORKER_ID, err.message);
    } finally {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
      }
    }
  }
}

run();

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
