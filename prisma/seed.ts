import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  await db.$connect();

  // const sumit = await db.user.create({
  //   data: {
  //     email: "sknayyar.sk@gmail.com",
  //     fullName: "Sumit Kumar",
  //     role: "ADMIN",
  //     podcastLinks: {
  //       createMany: {
  //         data: [
  //           {
  //             title: "Syntax Episode",
  //             description: "Some random description",
  //             link: "https://www.link.com",
  //             listened: false,
  //           },
  //         ],
  //       },
  //     },
  //   },
  // });

  const sumit = await db.user.findFirst({ where: { role: "ADMIN" } });

  const SUMIT_ID = "61f2ea38e76dd8f4ca31035d";

  await db.podcastLinks.createMany({
    data: [
      {
        title: "Transitions and Data Fetching with Suspence in React 18",
        description: "Some description",
        link: "https://open.spotify.com/episode/1dXXE0eGrlU307PZQ9KKHD?si=2b1c5333a9ee449e",
        userId: SUMIT_ID,
        listened: true,
      },
      {
        title: "Zayn talks Nobody is listening, to begin again",
        description: "Some description",
        link: "https://open.spotify.com/episode/0MOx9mSFNXdC2KacR0nG2w?si=88f5a1b8a15c4f40",
        userId: SUMIT_ID,
        listened: false,
      },
    ],
  });

  console.log(`Podcasts created succesfully`);
}

seed()
  .catch((err) => {
    console.error(`error occured. Full error is \n: ${err}`);
    throw err;
  })
  .finally(async () => {
    await db.$disconnect();
  });
