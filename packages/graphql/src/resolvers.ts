import { ContextValue } from './context';
import { Spore } from './data-sources/spores';

type SporeFilter = {
  clusterId?: string;
  contentType?: string;
};

type SporeQueryOptions = {
  filter: SporeFilter;
};

export const resolvers = {
  Query: {
    spores: async (
      _: unknown,
      options: SporeQueryOptions,
      { dataSources }: ContextValue,
    ): Promise<Spore[]> => {
      const { clusterId, contentType } = options?.filter ?? {};
      const spores = await dataSources.spores.getSporesFor(['0x', 'desc']);
      return spores.filter((spore) => {
        if (clusterId && spore.clusterId !== clusterId) {
          return false;
        }
        if (contentType && spore.contentType !== contentType) {
          return false;
        }
        return true;
      });
    },

    spore: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: ContextValue,
    ): Promise<Spore> => {
      const spores = await dataSources.spores.getSporesFor([id, 'desc']);
      const [spore] = spores;
      return spore;
    },
  },
};
