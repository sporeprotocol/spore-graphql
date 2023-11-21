import { DocumentNode } from 'graphql';
import { gql } from 'graphql-tag';

export const typeDefs: DocumentNode = gql`
  input SporesFilterInput {
    clusterId: String
    contentType: String
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
    spores(filter: SporesFilterInput, first: Int!, after: String): [Spore]
    sporeCount(filter: SporesFilterInput): Int!
    cluster(id: String!): Cluster
    clusters(first: Int!, after: String): [Cluster]
    clusterCount: Int!
  }
`;
