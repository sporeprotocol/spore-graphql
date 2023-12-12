import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { CreateApolloServerOptions, createApolloServer, createContext } from '.';
import { SporeConfig } from '@spore-sdk/core';

export function startSporeServerNextHandler(
  config: SporeConfig<string>,
  options: CreateApolloServerOptions = {},
): ReturnType<typeof startServerAndCreateNextHandler> {
  return startServerAndCreateNextHandler(createApolloServer(options), {
    context: async () => createContext(config),
  });
}
