import { gql } from 'graphql-tag';
export const typeDefs = gql `
  type Spore {
    id: String
    clusterId: String
    contentType: String
    content: String
  }

  input SporesFilterInput {
    clusterId: String
    contentType: String
  }

  type Query {
    spores(filter: SporesFilterInput, withContent: Boolean): [Spore]
    spore(id: String!, withContent: Boolean): Spore
  }
`;
