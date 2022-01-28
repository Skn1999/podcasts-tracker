import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import FullPageLayout from "~/components/FullPageLayout";
import Menubar from "~/components/Menubar";
import { PlusIcon } from "@heroicons/react/solid";

export default function TrackIndex() {
  return (
    <FullPageLayout wrapperClasses="bg-indigo-900 text-indigo-200 leading-5">
      <Menubar />

      {/* may be add filters here */}

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
        <div className="mt-6">
          <Outlet />
        </div>
      </section>
    </FullPageLayout>
  );
}
