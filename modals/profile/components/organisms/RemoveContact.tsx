import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import { IPerson } from "classes/types";
import { useStore } from "hooks";
import { COLOR } from "utils";
import { Button } from "components/atoms";
import { Title } from "../atoms";
import { Contact } from "stores/ContactsStore";

type Props = {
  contact: Contact | null;
  close(): void;
};

export default observer<Props>(({ contact, close }) => {
  const { contacts } = useStore();
  // -------------------------

  const remove = useCallback(() => {
    contact && contacts.removeContact(contact);
    close();
  }, [contact]);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>
        Do you want remove{"\n"}
        {contact?.name}?
      </Title>

      <Button
        mode="fill"
        onPress={remove}
        contentContainerStyle={styles.buttonContent}
        textStyle={styles.buttonText}
        style={styles.button}
        text="Remove"
      />
      <Button
        mode="fill"
        onPress={close}
        contentContainerStyle={styles.buttonContent}
        textStyle={styles.buttonText}
        text="Cancel"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 26,
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center",
    marginBottom: 36,
  },
  button: {
    backgroundColor: COLOR.Dark2,
  },
  buttonContent: {
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
