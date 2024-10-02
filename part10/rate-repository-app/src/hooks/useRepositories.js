import { useQuery } from '@apollo/client';
import { GET_REPOSITORIES } from "../graphql/queries";
import { useState, useEffect } from 'react';

const useRepositories = () => {
  // Use Apollo Client's useQuery hook
  const { loading, error, data, refetch } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
  });

  console.log('Fetched data:', data);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error if necessary
  if (error) {
    console.error('Error fetching repositories:', error);
    return { repositories: [], loading, refetch };
  }

  console.log(data);
  if (!data || !data.repositories || !data.repositories.edges) {
    return <div>No repositories found</div>;
  }

  return {
    repositories: data ? data.repositories.edges : [],
    loading,
    refetch,
  };
};

export default useRepositories;