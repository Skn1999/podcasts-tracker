import { ActionFunction, LoaderFunction, redirect } from "remix";
import { logout } from "~/utils/user";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/");
};

export default function LogoutIndex() {
  return null;
}
