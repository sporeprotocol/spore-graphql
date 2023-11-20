import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { createContext, createApolloServer } from 'spore-graphql';

export default startServerAndCreateNextHandler(
  createApolloServer({
    introspection: true,
  }),
  {
    context: async () => createContext(),
  },
);
