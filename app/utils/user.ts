import { db } from "./db.server";

export const getSumitAsUser = async () => {
  const sumit = await db.user.findFirst({ where: { role: "ADMIN" } });

  if (sumit) {
    return sumit;
  } else return null;
};
