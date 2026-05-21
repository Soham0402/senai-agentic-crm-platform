type QueueJob = {
  emailId: string;
  messageId: string;
};

const processingQueue: QueueJob[] = [];

export const addToProcessingQueue = (job: QueueJob) => {
  processingQueue.push(job);

  console.log(
    `Email queued for processing: ${job.messageId}`
  );
};

export const getQueueSize = () => {
  return processingQueue.length;
};