import { ApolloServer, ApolloServerOptions } from '@apollo/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';

export { createContext };

export function createApolloServer(
  options: Pick<ApolloServerOptions<ContextValue>, 'introspection'>,
) {
  const server = new ApolloServer<ContextValue>({
    ...options,
    typeDefs,
    resolvers,
  });
  return server;
}
