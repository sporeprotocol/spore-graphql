import { ContextValue } from '../context';
import { Spore } from '../data-sources/spores';
import { SporeQueryOptions, getSpores, getSporeById } from './spore';

export const resolvers = {
  Query: {
    spores: async (
      _: unknown,
      options: SporeQueryOptions,
      context: ContextValue,
    ): Promise<Spore[]> => {
      return getSpores(options, context);
    },

    spore: async (
      _: unknown,
      { id }: { id: string },
      context: ContextValue,
    ): Promise<Spore> => {
      return getSporeById(id, context);
    },
  },
};
