import { PodcastLinks, User } from "@prisma/client";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session";
import { PlusIcon } from "@heroicons/react/solid";
import PodcastTile from "~/components/PodcastTile";

type LoaderData = {
  podcastLinks: Array<PodcastLinks>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = (await getUserId(request)) as string;

  const podcastLinks = await db.podcastLinks.findMany({
    where: { userId: userId },
  });
  const data: LoaderData = { podcastLinks };

  return data;
};

export const action: ActionFunction = async ({}) => {
  // TOASK: why do we need Action function for index
  return {};
};

export default function TracksIndexRoute() {
  const { podcastLinks } = useLoaderData<LoaderData>();

  // first sort by created at and then listened
  podcastLinks
    .sort((a, b) => {
      if (a.createdAt < b.createdAt) return -1;
      else return 1;
    })
    .sort((a, b) => {
      if (a.listened) return 1;
      else return -1;
    });

  return (
    <>
      <section className="w-full pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-white font-bold">Saved Podcasts</h1>
          <Link
            to="new"
            className="bg-white rounded-md p-2 px-3 font-medium text-base text-indigo-900 hover:shadow-lg flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4 text-current " />
            <span>Add New</span>
          </Link>
        </div>
      </section>
      <ul className=" my-6 flex flex-col items-stretch justify-start space-y-4">
        {podcastLinks.map((link) => (
          <PodcastTile key={link.id} link={link} />
        ))}
      </ul>
    </>
  );
}
