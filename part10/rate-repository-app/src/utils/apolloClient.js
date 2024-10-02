import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import Constants from 'expo-constants';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: Constants.expoConfig.extra.apolloUri, // Your GraphQL endpoint
    }),
    cache: new InMemoryCache(), // Caching mechanism
  });
};

export default createApolloClient;