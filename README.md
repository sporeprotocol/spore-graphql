# spore-graphql

Spore Graphql is a Graphql Layer designed to simplify Spore data queries. It can be easily integrated into applications, allowing you to retrieve the desired data based on your specific needs.

## Installation

Install `spore-graphql` as a dependency using any package manager, such as `npm`:

```shell
npm install spore-graphql @spore-sdk/core --save
```

## How to use

- Integrating into your application (using Next.js as an example)

  ```typescript
  // app/api/graphql/route.js
  import { startSporeServerNextHandler } from 'spore-graphql/next';
  import { predefinedSporeConfigs } from '@spore-sdk/core';
  
  const handler = startSporeServerNextHandler(predefinedSporeConfigs.Aggron4);
  export { handler as GET, handler as POST };
  ```
  
- Fetch data with GraphQL client

  ```typescript
  import { request, gql } from 'graphql-request'

  const document = gql`
    {
      spores {
        id
        contentType
        cluster {
          name
        }
      }
    }
  `
  await request('/api/graphql/', document)
  ```
  
  You can use any GraphQL client you like to make requests, and you can debug your query on the [Spore GraphQL Explorer](https://spore-graphql.vercel.app) provided by us.

## Community

Chat everything about Spore here:

- Join our discord channel: [HaCKBee](https://discord.gg/9eufnpZZ8P)
- Contact via email: [contact@spore.pro](mailto:contact@spore.pro)

## Contributing

To submit pull requests, make sure:

- Please submit pull requests based on the `master` branch
- Please ensure your commit styling won't conflict with the [existing commits](https://github.com/sporeprotocol/spore-graphql/commits)
- Please provide a clear and descriptive title and description for your pull requests

## License

[MIT](./LICENSE) License
