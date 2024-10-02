import { Text, View, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  item: {
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 0,
  },
  image: {
    width: 66,
    height: 58,
    borderRadius: 5,
    marginRight: 10
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  textContainer: {
    flex: 1
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    color: '#586069',
    marginBottom: 5,
  },
  language: {
    backgroundColor: '#0366d6',
    color: 'white',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  stat: {
    alignItems: 'center'
  },
  statLabel: {
    color: '#586069',
  },
});

const divideAndRound = (num) => {
  return (num / 1000).toFixed(1);
}

const RepositoryItem = ({ listItem }) => (
  <View style={styles.item}>
    <View style={styles.firstRow}>
      <Image 
        style={styles.image} 
        source={{ uri: listItem.ownerAvatarUrl }} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.fullName}>{listItem.name}</Text>
        <Text style={styles.description}>{listItem.description}</Text>
        <Text style={styles.language}>{listItem.language}</Text>
      </View>
    </View>

    <View style={styles.secondRow}>
      <View style={styles.stat}>
        <Text>{divideAndRound(listItem.stargazersCount)}</Text>
        <Text style={styles.statLabel}>Stars</Text>
      </View>
      <View style={styles.stat}>
        <Text>{divideAndRound(listItem.forksCount)}</Text>
        <Text style={styles.statLabel}>Forks</Text>
      </View>
      <View style={styles.stat}>
        <Text>{listItem.reviewCount}</Text>
        <Text style={styles.statLabel}>Reviews</Text>
      </View>
      <View style={styles.stat}>
        <Text>{listItem.ratingAverage}</Text>
        <Text style={styles.statLabel}>Rating</Text>
      </View>
    </View>
  </View>
);

export default RepositoryItem;