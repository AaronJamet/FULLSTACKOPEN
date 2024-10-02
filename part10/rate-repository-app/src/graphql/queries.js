import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories(
      first: 15
      orderDirection: ASC
      orderBy: CREATED_AT
    ) {
      edges {
        node {
          id
          name
          description
          url
          language
          ownerAvatarUrl
          stargazersCount
          forksCount
          reviewCount
          ratingAverage
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`