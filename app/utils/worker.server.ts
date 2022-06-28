import { Worker, Queue, Plugins } from "node-resque";

declare global {
  var _queue: Queue;
}

let q: Queue;

const PODCASTDETAIL_FETCH_JOB = {
  plugins: [Plugins.JobLock],
  pluginOptions: {
    JobLock: { reEnqueue: true },
  },
  perform: async (a: unknown, b: unknown) => {
    console.log({ a, b });

    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(""), 1000);
    });

    return "Job finished";
  },
};

export const PODCAST_DETAILS_FETCH_QUEUE = "podcastDetailsFetchQueue";

async function bootPodcastDetailsFetcher() {
  const connectionDetails = {
    pkg: "ioredis",
    host: "127.0.0.1",
    password: null,
    port: 6379,
    database: 0,
  };

  const jobs = {
    podcastDetailsFetchJob: PODCASTDETAIL_FETCH_JOB,
  };

  //   start the worker
  const podcastDetailsFetchWorker = new Worker(
    { connection: connectionDetails, queues: [PODCAST_DETAILS_FETCH_QUEUE] },
    jobs
  );

  await podcastDetailsFetchWorker.connect();
  podcastDetailsFetchWorker.start();

  podcastDetailsFetchWorker.on("start", () => {
    console.log("worker started");
  });

  podcastDetailsFetchWorker.on("poll", (queue) => {
    console.log(`worker polling on ${queue}`);
  });

  podcastDetailsFetchWorker.on("job", (queue, job) => {
    console.log(`worker working job ${queue} ${JSON.stringify(job)}`);
  });

  const queue = new Queue({ connection: connectionDetails }, jobs);
  queue.on("error", (error) => {
    console.log(error);
  });

  await queue.connect();
  await queue.enqueue(
    PODCAST_DETAILS_FETCH_QUEUE,
    "podcastDetailsFetchJob",
    [1, 3]
  );

  await podcastDetailsFetchWorker.end();
  //   process.exit();

  if (!global._queue === undefined) {
    global._queue = queue;
  }

  q = global._queue;
}

bootPodcastDetailsFetcher();

export default global._queue;
