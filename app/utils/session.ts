import { createCookieSessionStorage, redirect } from "remix";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET could not be found");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "Podcasts Tracker",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();

  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function destorySession(request: Request) {
  const session = await getUserSession(request);
  let cookie = await storage.destroySession(session);
  return cookie;
}

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);

  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") return null;

  return userId;
};

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getUserSession(request);

  const userId = await session.get("userId");

  //   console.log({ userId });

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect("/login?" + searchParams);
  }

  return userId;
};
