import { PodcastLinks, User } from "@prisma/client";
import { Form, Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { ExternalLinkIcon, PlusIcon } from "@heroicons/react/solid";
import { getUserId, requireUserId } from "~/utils/session";
import { DotsVerticalIcon, TrashIcon, PlayIcon } from "@heroicons/react/solid";
import { PlayIcon as PlayIconOutlined } from "@heroicons/react/outline";
import { MouseEventHandler } from "react";

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
          <li
            className={`rounded-md overflow-hidden bg-white bg-opacity-5 border-b border-slate-600 p-8 flex items-start space-x-8 backdrop-blur-lg ${
              link.listened ? "opacity-50" : ""
            } `}
            key={link.id}
          >
            <div
              className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                link.listened ? "" : "shadow-xl"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1643260669988-31da7ec61233?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"
                alt="podcast image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <a
                href={link.link}
                className="text-lg text-indigo-100 font-semibold flex items-center space-x-2"
              >
                <span>{link.title}</span>
                <ExternalLinkIcon className="w-4 h-4 text-current" />
              </a>
              <p className="mt-2 text-sm font-normal leading-snug w-3/4">
                {link.description}
              </p>
            </div>
            <div className="flex-shrink-0 -mt-4 -mr-4 flex">
              <Form action="" method="post">
                <input type="hidden" value="delete" name="_method" />
                <button
                  title="Delete podcast"
                  className="cursor-pointer p-2 hover:bg-indigo-100 hover:bg-opacity-25 rounded-full transition-all duration-150"
                >
                  {/* <DotsVerticalIcon className="w-6 h-6 text-white" /> */}
                  <TrashIcon className="w-5 h-5 text-white opacity-70" />
                </button>
              </Form>
              <button
                title={`Mark as ${link.listened ? "unplayed" : "played"}`}
                className="cursor-pointer p-2 hover:bg-indigo-100 hover:bg-opacity-25 rounded-full transition-all duration-150"
              >
                {/* <DotsVerticalIcon className="w-6 h-6 text-white" /> */}
                {link.listened ? (
                  <PlayIcon className="w-5 h-5 text-white opacity-70" />
                ) : (
                  <PlayIconOutlined className="w-5 h-5 text-white opacity-70" />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
