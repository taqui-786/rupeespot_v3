import cron from 'node-cron';
import { getTrackingProductAndNotify } from '../CustomServerFunctions';


let job: cron.ScheduledTask | null = null;

async function runTaskWithTimeout(task: () => Promise<void>, timeout: number): Promise<void> {
  return Promise.race([
    task(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Task timed out')), timeout)
    )
  ]) as Promise<void>;
}

async function cronTask() {
  console.log('Running cron job:', new Date().toISOString());
  await getTrackingProductAndNotify()
 
}

export function initCronJob() {
  if (job) {
    console.log('Cron job already running');
    return;
  }

  job = cron.schedule('0 */2 * * *', async () => {
    try {
      await runTaskWithTimeout(cronTask, 5000); // 5 second timeout
      console.log('Cron job completed successfully');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Cron job failed:', error.message);
      } else {
        console.error('Cron job failed with an unknown error');
      }
      // Here you could implement additional error handling or alerting
    }
  });

  console.log('Cron job initialized');
}

export function stopCronJob() {
  if (job) {
    job.stop();
    job = null;
    console.log('Cron job stopped');
  } else {
    console.log('No cron job running');
  }
}

