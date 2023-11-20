import { SporesDataSource } from './data-sources/spores';

export interface ContextValue {
  dataSources: {
    spores: SporesDataSource;
  };
}

export function createContext() {
  return {
    dataSources: {
      spores: new SporesDataSource(),
    },
  };
}
