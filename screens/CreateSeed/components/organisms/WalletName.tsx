import { StyleSheet, View } from "react-native";
import { Input } from "components/atoms";
import { Subtitle, Title } from "../atoms";

export default () => (
  <>
    <View style={styles.container}>
      <Title>Name Your Wallet</Title>
      <Subtitle style={styles.subtitle}>
        This is the only way you will be able to {"\n"}recover your account.
        Please store it {"\n"}somewhere safe!
      </Subtitle>
      <Input style={styles.input} placeholder="Wallet Name" />
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  subtitle: {
    marginTop: 8,
  },
  input: {
    marginTop: 24,
  },
});
