const { useField } = require("formik");
const { StyleSheet } = require("react-native");
const { default: TextInput } = require("./TextInput");
const { default: TextCustom } = require("./TextCustom");

const styles = StyleSheet.create({
  errorText: {
    marginBottom: 5,
    marginLeft: 20,
    color: '#d73a4a'
  },
  textbox: {
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#9e9e9e'
  },
  errorTextbox: {
    color: '#bdbdbd',
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d73a4a'
  }
});

const FormixTextInput = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <>
      <TextInput 
        onChangeText={value => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        placeholderTextColor='#bdbdbd'
        style={[styles.textbox, showError && styles.errorTextbox]} 
        {...props}
      />

      {showError && <TextCustom style={styles.errorText}>{meta.error}</TextCustom>}
    </>
  );
};

export default FormixTextInput;