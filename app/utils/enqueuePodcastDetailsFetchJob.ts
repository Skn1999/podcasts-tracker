import queue, { PODCAST_DETAILS_FETCH_QUEUE } from "./worker.server";

export const enqueuePodcastDetailsFetchJob = async () => {
  if (queue == undefined) return;

  const id = queue.enqueue(
    PODCAST_DETAILS_FETCH_QUEUE,
    "podcastDetailsFetchJob",
    ["I'm sumit"]
  );

  console.log({ id });

  process.exit();
};

enqueuePodcastDetailsFetchJob();
