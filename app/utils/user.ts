import { db } from "./db.server";
import bcrypt from "bcryptjs";
import { destorySession, getUserId } from "./session";
import { redirect } from "remix";

type LoginForm = {
  email: string;
  password: string;
};

type RegisterForm = {
  fullname: string;
  email: string;
  password: string;
};

const SALT = 12;

export async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) return null;

  return user;
}

export async function logout(request: Request) {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destorySession(request),
    },
  });
}

export async function register({ fullname, email, password }: RegisterForm) {
  const isEmailAlreadyPresent = await db.user.findUnique({
    where: { email: email },
  });

  if (isEmailAlreadyPresent) {
    return null;
  }

  const passwordhash = await bcrypt.hash(password, SALT);

  return db.user.create({
    data: {
      fullName: fullname,
      email,
      password: passwordhash,
      role: "MEMBER",
    },
  });
}

export const getSumitAsUser = async () => {
  const sumit = await db.user.findFirst({ where: { role: "ADMIN" } });

  if (sumit) {
    return sumit;
  } else return null;
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);

  if (!userId || typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (err) {
    throw "Error occured while retrieving user from database";
  }
};
