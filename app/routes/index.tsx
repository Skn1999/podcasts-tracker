import { User } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import FullPageLayout from "~/components/FullPageLayout";
import Menubar from "~/components/Menubar";
import { getUser } from "~/utils/user";

type LoaderData = {
  user?: User | null;
};

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const data: LoaderData = {
    user,
  };
  return data;
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <FullPageLayout wrapperClasses="bg-indigo-900 text-indigo-200 leading-5">
      <Menubar user={data.user} />

      <section className="w-full py-28 flex items-center  justify-around">
        <div className="w-7/12 flex-grow-0 flex items-start flex-col space-y-6">
          <h1 className="text-7xl font-bold text-white ">
            Track your podcasts without any hassle
          </h1>
          <p className="text-base leading-snug text-white opacity-80 w-3/4">
            Are you tired of listening and managing your podcasts across
            different platforms. Well, look no further. Click the button below
            to track now.
          </p>
          <Link
            to="/tracks"
            className="bg-white rounded-md p-4 text-lg text-indigo-900 hover:shadow-lg transition-all duration-150 transform hover:-translate-y-1"
          >
            Start Tracking Now -&gt;
          </Link>
        </div>
        <div className="w-5/12 flex-shrink-0">
          <img
            src="/assets/icons/Headphones.png"
            className="w-full h-full object-contain transform scale-110 origin-right"
            alt=""
          />
        </div>
      </section>
    </FullPageLayout>
  );
}
