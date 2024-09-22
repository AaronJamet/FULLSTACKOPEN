import React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    padding: 20,
    flexDirection: 'row'
  },
  pressable: {
    marginRight: 20,
    marginTop: 10
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

const AppBar = () => {
  return (
    <View style={styles.container} >
      <ScrollView horizontal>
      <Pressable style={styles.pressable}>
        <Link to="/" >
          <Text style={styles.text}>Repositories</Text>
        </Link>
      </Pressable>
      <Pressable style={styles.pressable}>    
        <Link to="/login" >
          <Text style={styles.text}>Sign In</Text>
        </Link>
      </Pressable>

      <Pressable style={styles.pressable}>
        <Link to="/" >
          <Text style={styles.text}>Repositories</Text>
        </Link>
      </Pressable>
      <Pressable style={styles.pressable}>    
        <Link to="/login" >
          <Text style={styles.text}>Sign In</Text>
        </Link>
      </Pressable>
      <Pressable style={styles.pressable}>
        <Link to="/" >
          <Text style={styles.text}>Repositories</Text>
        </Link>
      </Pressable>
      <Pressable style={styles.pressable}>    
        <Link to="/login" >
          <Text style={styles.text}>Sign In</Text>
        </Link>
      </Pressable>
      <Pressable style={styles.pressable}>
        <Link to="/" >
          <Text style={styles.text}>Repositories</Text>
        </Link>
      </Pressable>
      <Pressable style={styles.pressable}>    
        <Link to="/login" >
          <Text style={styles.text}>Sign In</Text>
        </Link>
      </Pressable>
      </ScrollView>
    </View>
  )
}

export default AppBar;