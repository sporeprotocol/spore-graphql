import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { createContext, createApolloServer } from 'spore-graphql';

export const config = {
  dynamic: 'force-dynamic',
  revalidate: false,
  fetchCache: 'force-no-store',
  maxDuration: 300,
};

export default startServerAndCreateNextHandler(
  createApolloServer({
    introspection: true,
  }),
  {
    context: async () => createContext(),
  },
);
