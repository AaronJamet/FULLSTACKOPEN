import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import FormixTextInput from "./FormikTextInput";
import { Formik } from "formik";

const styles = StyleSheet.create({
  textbox: {
    color: '#bdbdbd',
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#9e9e9e'
  },
  button: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#1e88e5',
    borderRadius: 5,
    margin: 15,
    padding: 20
  }
});

const onSubmit = (values) => {
  console.log(values);
}

const SignIn = () => {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
      <View>
        <FormixTextInput name='username' placeholder='Username' style={styles.textbox} />
        <FormixTextInput name='password' placeholder='Password' 
          secureTextEntry={true} style={styles.textbox} 
        />
        
        <Pressable onPress={handleSubmit}>
          <Text style={styles.button}>Sign In</Text>
        </Pressable>
      </View>
      )}
    </Formik>
  )
};

export default SignIn;