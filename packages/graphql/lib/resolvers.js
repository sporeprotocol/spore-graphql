import { Indexer } from '@ckb-lumos/lumos';
import { predefinedSporeConfigs, unpackToRawSporeData } from '@spore-sdk/core';
export const resolvers = {
    Query: {
        spores: async (_, options) => {
            const { clusterId, contentType } = options.filter;
            const indexer = new Indexer(predefinedSporeConfigs.Aggron4.ckbIndexerUrl);
            const collector = indexer.collector({
                type: {
                    ...predefinedSporeConfigs.Aggron4.scripts.Spore.script,
                    args: '0x',
                },
                order: 'desc',
            });
            const spores = [];
            for await (const cell of collector.collect()) {
                const rawSporeData = unpackToRawSporeData(cell.data);
                const spore = {
                    id: cell.cellOutput.type?.args,
                    clusterId: rawSporeData.clusterId,
                    contentType: rawSporeData.contentType,
                    content: rawSporeData.content,
                };
                if (clusterId && spore.clusterId !== clusterId) {
                    continue;
                }
                if (contentType && spore.contentType !== contentType) {
                    continue;
                }
                spores.push(spore);
            }
            return spores;
        },
        spore: async (_, { id }) => {
            const indexer = new Indexer(predefinedSporeConfigs.Aggron4.ckbIndexerUrl);
            const collector = indexer.collector({
                type: {
                    ...predefinedSporeConfigs.Aggron4.scripts.Spore.script,
                    args: id,
                },
                order: 'desc',
            });
            for await (const cell of collector.collect()) {
                const rawSporeData = unpackToRawSporeData(cell.data);
                const spore = {
                    id: cell.cellOutput.type?.args,
                    clusterId: rawSporeData.clusterId,
                    contentType: rawSporeData.contentType,
                    content: rawSporeData.content,
                };
                return spore;
            }
            return null;
        },
    },
};
