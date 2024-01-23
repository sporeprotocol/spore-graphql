import { ApolloServer, ApolloServerOptions } from '@apollo/server';
import { ContextValue, createContext } from './context';
import { resolvers } from './resolvers';
import { typeDefs } from './type-defs';

export * from './resolvers-types';
export type { ContextValue };
export { createContext };

export type CreateApolloServerOptions = Partial<
  Omit<ApolloServerOptions<ContextValue>, 'typeDefs' | 'resolvers' | 'schema' | 'gateway'>
>;

export function createApolloServer<Context extends ContextValue>(
  options?: CreateApolloServerOptions,
): ApolloServer<Context> {
  return new ApolloServer<Context>({
    ...(options ?? {}),
    typeDefs,
    resolvers,
  });
}
