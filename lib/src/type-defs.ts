import { DocumentNode } from 'graphql';
import { gql } from 'graphql-tag';

export const typeDefs: DocumentNode = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  input BaseFilterInput {
    codeHash: String
  }

  input SporeFilterInput {
    codeHash: String
    clusterIds: [String!]
    contentTypes: [String!]
    addresses: [String!]
  }

  input ClusterFilterInput {
    codeHash: String
    addresses: [String!]
    mintableBy: String
  }

  input TopClusterFilterInput {
    codeHash: String
    mintableBy: String
  }

  enum QueryOrder {
    asc
    desc
  }

  type Cell {
    cellOutput: CellOutput!
    data: String!
    outPoint: OutPoint
    blockHash: String
    blockNumber: String
    txIndex: String
  }

  type CellOutput {
    capacity: String!
    lock: Script!
    type: Script
  }

  type Script {
    codeHash: String!
    hashType: HashType!
    args: String!
  }

  enum HashType {
    type
    data
    data1
  }

  type OutPoint {
    txHash: String!
    index: String!
  }

  type Spore {
    id: String!
    clusterId: String
    contentType: String!
    content: String!
    cluster: Cluster
    cell: Cell
    codeHash: String
    capacityMargin: String
  }

  type Cluster {
    id: String!
    name: String!
    description: String!
    cell: Cell
    codeHash: String
    capacityMargin: String
    spores(filter: SporeFilterInput, first: Int, after: String, order: QueryOrder): [Spore!]
  }

  type Query {
    spore(id: String!, filter: BaseFilterInput): Spore
    spores(filter: SporeFilterInput, first: Int = 10, after: String, order: QueryOrder): [Spore!]
    sporeCount(filter: SporeFilterInput): Int!
    cluster(id: String!, filter: BaseFilterInput): Cluster
    clusters(filter: ClusterFilterInput, first: Int = 10, after: String, order: QueryOrder): [Cluster!]
    topClusters(filter: TopClusterFilterInput, first: Int, after: String): [Cluster!]
    mintableClusters(address: String!, filter: BaseFilterInput): [Cluster!]
    clusterCount(filter: BaseFilterInput): Int!
  }
`;

export default typeDefs;
