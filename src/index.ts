import { ApolloServer, ApolloServerOptions } from '@apollo/server';
import { typeDefs } from './type-defs';
import { resolvers } from './resolvers';
import { ContextValue, createContext } from './context';

export * from './resolvers-types';
export type { ContextValue };
export { createContext };

export type CreateApolloServerOptions = Partial<
  Omit<ApolloServerOptions<ContextValue>, 'typeDefs' | 'resolvers' | 'schema' | 'gateway'>
>;

export function createApolloServer<Context extends ContextValue>(
  options?: CreateApolloServerOptions,
) {
  const server = new ApolloServer<Context>({
    ...(options ?? {}),
    typeDefs,
    resolvers,
  });
  return server;
}
