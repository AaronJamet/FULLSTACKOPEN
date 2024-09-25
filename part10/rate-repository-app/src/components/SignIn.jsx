import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import FormixTextInput from "./FormikTextInput";
import { Formik } from "formik";
import * as yup from 'yup';

const styles = StyleSheet.create({
  button: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#1e88e5',
    borderRadius: 5,
    margin: 15,
    padding: 20
  }
});

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(4, 'Username must have 4 letters or more')
    .required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password must have 6 characters or more')
    .required('Password is required')  
})

const onSubmit = (values) => {
  console.log(values);
}

const SignIn = () => {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => (
      <View>
        <FormixTextInput name='username' placeholder='Username' />
        <FormixTextInput name='password' placeholder='Password' 
          secureTextEntry={true}
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