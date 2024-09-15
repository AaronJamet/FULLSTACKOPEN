import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  item: {
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 0,
  },
});

const RepositoryItem = ({ listItem }) => (
  <View style={styles.item}>
    <Text>Full name: {listItem.fullName}</Text>
    <Text>Description: {listItem.description}</Text>
    <Text>Language: {listItem.language}</Text>
    <Text>Stars: {listItem.stargazersCount}</Text>
    <Text>Forks: {listItem.forksCount}</Text>
    <Text>Reviews: {listItem.reviewCount}</Text>
    <Text>Rating: {listItem.ratingAverage}</Text>
  </View>
);

export default RepositoryItem;