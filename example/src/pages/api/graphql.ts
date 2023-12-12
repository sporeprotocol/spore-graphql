import { predefinedSporeConfigs } from '@spore-sdk/core';
import { startSporeServerNextHandler } from 'spore-graphql/next';

export const config = {
  fetchCache: 'force-no-store',
  maxDuration: 300,
};

export default startSporeServerNextHandler(predefinedSporeConfigs.Aggron4, {
  introspection: true,
});
