import prisma from '@/services/prismaClient';
// import createUsers from './staticUsers';

const main = async () => {
  // ? one time scripts
  // await createUsers();
};

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('error', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
