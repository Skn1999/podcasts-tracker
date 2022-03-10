import { User } from "@prisma/client";
import { db } from "./db.server";

type ManualPodcast = {
  title: string;
  description: string;
  link: string;
  loggedInUser: User | null;
};

export async function createNewManualPodcast({
  title,
  description,
  link,
  loggedInUser,
}: ManualPodcast) {
  if (loggedInUser == null) {
    return null;
  }

  const newPodcast = await db.podcastLinks.create({
    data: {
      title,
      description,
      link,
      userId: loggedInUser.id,
      listened: false,
    },
  });

  return newPodcast;
}

export async function deletePodcast({ podcastId }: { podcastId: string }) {
  const deletedPodcast = await db.podcastLinks.delete({
    where: { id: podcastId },
  });

  return deletedPodcast;
}

export async function togglePodcastAsPlayed({
  podcastId,
  playStatus,
}: {
  podcastId: string;
  playStatus: boolean;
}) {
  if (!podcastId || !playStatus) {
    return null;
  }
  const updatedPodcast = await db.podcastLinks.update({
    where: { id: podcastId },
    data: {
      listened: playStatus,
    },
  });

  return updatedPodcast;
}
