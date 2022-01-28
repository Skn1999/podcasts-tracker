import { PodcastLinks } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { ExternalLinkIcon } from "@heroicons/react/solid";

type LoaderData = {
  podcastLinks: Array<PodcastLinks>;
};

export const loader: LoaderFunction = async ({ request }) => {
  // currently for testing fetching my details
  // TODO: check for user session and try to fetch details later
  const sumit = await db.user.findFirst({ where: { role: "ADMIN" } });

  const podcastLinks = await db.podcastLinks.findMany({
    where: { userId: sumit?.id },
  });
  const data: LoaderData = { podcastLinks };

  return data;
};

export default function TracksIndexRoute() {
  const { podcastLinks } = useLoaderData<LoaderData>();
  return (
    <ul className=" flex flex-col items-stretch justify-start space-y-4">
      {podcastLinks.map((link) => (
        <li
          className={`rounded-md overflow-hidden bg-white bg-opacity-5 border-b border-slate-600 p-4 flex items-start space-x-8 backdrop-blur-lg ${
            link.listened ? "opacity-50" : ""
          } `}
          key={link.id}
        >
          <div
            className={`w-20 h-20 rounded-md overflow-hidden ${
              link.listened ? "" : "shadow-xl"
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1643260669988-31da7ec61233?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80"
              alt="podcast image"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <a
              href={link.link}
              className="text-lg text-indigo-100 font-semibold flex items-center space-x-2"
            >
              <span>{link.title}</span>
              <ExternalLinkIcon className="w-4 h-4 text-current" />
            </a>
            <p className="mt-2 text-sm font-normal leading-snug">
              {link.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
