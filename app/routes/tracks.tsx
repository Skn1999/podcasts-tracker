import { User } from "@prisma/client";
import { Link, LoaderFunction, Outlet, useLoaderData, useMatches } from "remix";
import FullPageLayout from "~/components/FullPageLayout";
import Menubar from "~/components/Menubar";
import { getUser } from "~/utils/user";
import useIsPathLoaderLoading from "../hooks/useIsPathLoaderLoading";

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

export default function TrackIndex() {
  // const matches = useMatches();
  // console.log({ matches });
  // const isLoading = useIsPathLoaderLoading(
  //   matches[matches.length - 1].pathname
  // );
  // console.log({ isLoading });
  let isLoading = false;
  const data = useLoaderData<LoaderData>();
  return (
    <FullPageLayout wrapperClasses="bg-indigo-900 text-indigo-200 leading-5">
      <Menubar user={data.user} />

      {/* may be add filters here */}
      <div className="mt-6">
        <Outlet />
      </div>
      <div
        className={`absolute hidden bottom-6 right-6 rounded bg-white text-indigo-900 ${
          isLoading ? "flex" : ""
        } text-sm p-4 shadow-2xl`}
      >
        <p>Something is happening</p>
      </div>
    </FullPageLayout>
  );
}
