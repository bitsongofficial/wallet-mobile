import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react-lite";
import { animated, useSpring } from "@react-spring/native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useStore, useTheme } from "hooks";
import { SendController } from "../../classes";
import { CardAddress, CardAdressSelf } from "../moleculs";
import { Footer, User } from "../atoms";
import { isValidAddress } from "core/utils/Address";

type Props = {
  controller: SendController;
  onPressRecap(): void;
  onPressScanner(): void;
  onPressBack(): void;
};

export default observer(function SelectReceiver({
  controller,
  onPressBack,
  onPressRecap,
  onPressScanner,
}: Props) {
  const { contacts } = useStore()
  const theme = useTheme();
  const { creater } = controller;
  const { addressInput } = creater;

  const hidden = useSpring({ opacity: addressInput.isFocused ? 0.1 : 1 });
  useEffect(() => addressInput.focusOFF, []);

  return (
    <>
      <BottomSheetScrollView style={{ flexGrow: 1 }}>
        <CardAddress
          input={addressInput}
          onPressQR={onPressScanner}
          style={styles.input}
        />

        <animated.View style={hidden}>
          {contacts.starred.length > 0 && <>
            <Text style={[styles.subtitle, theme.text.primary]}>Prefered</Text>

            <View style={styles.users}>
              {contacts.starred.map((c) => (
                <User user={c} key={c.address} />
              ))}
            </View>
          </>}
          <Text style={[styles.subtitle, theme.text.primary]}>Recents</Text>
          <View style={styles.users}>
            {contacts.starred.map((c) => (
              <User user={c} key={c.address} />
            ))}
          </View>

          <CardAdressSelf coin={creater.coin} style={styles.self} />
        </animated.View>
      </BottomSheetScrollView>
      <Footer
        onPressBack={onPressBack}
        onPressCenter={onPressRecap}
        isActiveCenter={addressInput.value != "" && isValidAddress(addressInput.value)}
        centerTitle="Preview Send"
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  input: {
    marginTop: 31,
    marginBottom: 26,
  },
  hidden: { opacity: 0.1 },

  self: { marginTop: 21 },

  users: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 23,
    marginBottom: 40,
  },
  subtitle: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
});
