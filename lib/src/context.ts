import { SporeConfig, predefinedSporeConfigs } from '@spore-sdk/core';
import { IClustersDataSource, ISporesDataSource } from './data-sources/interface';
import { SporesDataSource } from './data-sources/spores';
import { ClustersDataSource } from './data-sources/clusters';

export interface ContextValue {
  dataSources: {
    spores: ISporesDataSource;
    clusters: IClustersDataSource;
  };
  config: SporeConfig<string>;
}

export function createContext(config: SporeConfig<string> = predefinedSporeConfigs.Testnet) {
  const spores = new SporesDataSource(config);
  const clusters = new ClustersDataSource(config);

  return {
    dataSources: {
      spores,
      clusters,
    },
    config,
  };
}
