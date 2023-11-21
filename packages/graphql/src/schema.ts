import { DocumentNode } from 'graphql';
import { gql } from 'graphql-tag';

export const typeDefs: DocumentNode = gql`
  input SporesFilterInput {
    clusterId: String
    contentType: String
  }

  enum QueryOrder {
    asc
    desc
  }

  type Spore {
    id: String
    clusterId: String
    contentType: String
    content: String
    cluster: Cluster
  }

  type Cluster {
    id: String
    name: String
    description: String
    spores: [Spore]
  }

  type Query {
    spore(id: String!): Spore
    spores(
      filter: SporesFilterInput
      first: Int = 10
      after: String
      order: QueryOrder
    ): [Spore]
    sporeCount(filter: SporesFilterInput): Int!
    cluster(id: String!): Cluster
    clusters(first: Int = 10, after: String, order: QueryOrder): [Cluster]
    topClusters(first: Int): [Cluster]
    clusterCount: Int!
  }
`;
