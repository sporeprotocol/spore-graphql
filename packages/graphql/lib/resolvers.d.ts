type SporeFilter = {
    clusterId?: string;
    contentType?: string;
};
type SporeQueryOptions = {
    filter: SporeFilter;
};
export declare const resolvers: {
    Query: {
        spores: (_: unknown, options: SporeQueryOptions) => Promise<{
            id: string | undefined;
        }[]>;
        spore: (_: unknown, { id }: {
            id: string;
        }) => Promise<{
            id: string | undefined;
            clusterId: string | undefined;
            contentType: string;
            content: string;
        } | null>;
    };
};
export {};
