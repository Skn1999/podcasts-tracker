import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import FullPageLayout from "~/components/FullPageLayout";
import Menubar from "~/components/Menubar";

export default function TrackIndex() {
  return (
    <FullPageLayout wrapperClasses="bg-indigo-900 text-indigo-200 leading-5">
      <Menubar />

      {/* may be add filters here */}
      <div className="mt-6">
        <Outlet />
      </div>
    </FullPageLayout>
  );
}
