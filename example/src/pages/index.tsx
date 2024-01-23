import { ApolloSandbox } from '@apollo/sandbox/react';

export default function EmbeddedSandbox() {
  return (
    <main>
      <ApolloSandbox initialEndpoint={`/api/graphql`} />
    </main>
  );
}
