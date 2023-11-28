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

  input SporeFilterInput {
    clusterId: String
    contentType: String
    address: String
  }

  input ClusterFilterInput {
    address: String
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
    clusterId: String!
    contentType: String!
    content: String!
    cluster: Cluster
    cell: Cell
  }

  type Cluster {
    id: String!
    name: String!
    description: String!
    spores(first: Int): [Spore!]
    cell: Cell
  }

  type Query {
    spore(id: String!): Spore
    spores(
      filter: SporeFilterInput
      first: Int = 10
      after: String
      order: QueryOrder
    ): [Spore!]
    sporeCount(filter: SporeFilterInput): Int!
    cluster(id: String!): Cluster
    clusters(
      first: Int = 10
      after: String
      order: QueryOrder
      filter: ClusterFilterInput
    ): [Cluster!]
    topClusters(first: Int): [Cluster!]
    clusterCount: Int!
  }
`;
