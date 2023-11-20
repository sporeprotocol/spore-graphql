import { ClustersDataSource } from './data-sources/clusters';
import { SporesDataSource } from './data-sources/spores';

export interface ContextValue {
  dataSources: {
    spores: SporesDataSource;
    clusters: ClustersDataSource;
  };
}

export function createContext() {
  const spores = new SporesDataSource();
  const clusters = new ClustersDataSource();

  return {
    dataSources: {
      spores,
      clusters,
    },
  };
}
