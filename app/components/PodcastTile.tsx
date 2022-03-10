import { PodcastLinks } from "@prisma/client";
import { ExternalLinkIcon, TrashIcon, PlayIcon } from "@heroicons/react/solid";
import { PlayIcon as PlayIconOutlined } from "@heroicons/react/outline";

import { Form, useFetcher } from "remix";

type Props = {
  link: PodcastLinks;
};

export default function PodcastTile({ link }: Props) {
  const fetcher = useFetcher();
  return (
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
        <fetcher.Form action="" method="post">
          <input type="hidden" value="delete" name="_method" />
          <input type="hidden" value={link.id} name="podcastId" />
          <button
            title="Delete podcast"
            className="cursor-pointer p-2 hover:bg-indigo-100 hover:bg-opacity-25 rounded-full transition-all duration-150"
          >
            {/* <DotsVerticalIcon className="w-6 h-6 text-white" /> */}
            <TrashIcon className="w-5 h-5 text-white opacity-70" />
          </button>
        </fetcher.Form>
        <fetcher.Form>
          <input type="hidden" name="_method" value="markPlayed" />
          <input type="hidden" value={link.id} name="podcastId" />
          <input
            type="hidden"
            name="playStatus"
            value={link.listened.toString()}
          />
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
        </fetcher.Form>
      </div>
    </li>
  );
}
