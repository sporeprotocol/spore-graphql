import { startServerAndCreateNextHandler } from '@as-integrations/next';
import sporeGraphqlServer from 'spore-graphql';

export default startServerAndCreateNextHandler(sporeGraphqlServer, {
  context: async (req, res) => ({ req, res }),
});
