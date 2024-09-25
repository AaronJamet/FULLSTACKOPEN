const { useField } = require("formik");
const { StyleSheet } = require("react-native");
const { default: TextInput } = require("./TextInput");
const { default: TextCustom } = require("./TextCustom");

const styles = StyleSheet.create({
  errorText: {
    marginTop: 5
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
        {...props}
      />
      {showError && <TextCustom style={styles.errorText}>{meta.error}</TextCustom>}
    </>
  );
};

export default FormixTextInput;