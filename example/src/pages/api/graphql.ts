import { startSporeServerNextHandler } from 'spore-graphql/next';
import { predefinedSporeConfigs, setSporeConfig, SporeConfig } from '@spore-sdk/core';

const sporeConfig: SporeConfig = predefinedSporeConfigs.Aggron4;
setSporeConfig(sporeConfig);

export const config = {
  fetchCache: 'force-no-store',
  maxDuration: 300,
};

export default startSporeServerNextHandler(sporeConfig, {
  introspection: true,
});
