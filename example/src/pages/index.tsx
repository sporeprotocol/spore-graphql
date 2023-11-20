import { ApolloSandbox } from '@apollo/sandbox/react';

export default function EmbeddedSandbox() {
  return (
    <main>
      <ApolloSandbox
        initialEndpoint={`https://spore-graphql.vercel.app/api/graphql`}
      />
    </main>
  );
}
