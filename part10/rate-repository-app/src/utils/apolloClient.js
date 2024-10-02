import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://192.168.18.11:4000/graphql', // Your GraphQL endpoint
    }),
    cache: new InMemoryCache(), // Caching mechanism
  });
};

export default createApolloClient;