import { useCallback, useEffect, useMemo } from "react";
import {
  ListRenderItem,
  SectionList,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RectButton,
  Swipeable,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { observer } from "mobx-react-lite";
import { observable, toJS } from "mobx";
import { RootStackParamList } from "types";
import { useStore } from "hooks";
import { COLOR, hexAlpha, InputHandler } from "utils";
import { Button, Icon2, ThemedGradient } from "components/atoms";
import { Circles, Search, Subtitle, Title } from "./components/atoms";
import { ContactItem } from "./components/moleculs";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useBottomSheetModals } from "./hooks";
import { Contact } from "stores/ContactsStore";

type Props = NativeStackScreenProps<RootStackParamList, "AddressBook">;

export default observer<Props>(function AddressBookScreen({ navigation }) {
  const { contacts } = useStore();
  const [position, openModal] = useBottomSheetModals();

  // ------- Wallets ------
  const mapItemsRef = useMemo(
    () => observable.map<Contact, React.RefObject<Swipeable>>(),
    []
  );

  const renderContact:ListRenderItem<Contact> = ({ item }) => (
      <View style={{ marginBottom: 24 }}>
        <ContactItem
          value={item}
          onPress={() => {}}
          onPressStar={contacts.toggleStarred}
          onPressDelete={openModal.removeContact}
          onPressEdit={openModal.editContact}
          mapItemsRef={mapItemsRef}
        />
      </View>
    )

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={[{ marginBottom: 8 }, styles.wrapper]}>
        <Text style={{ color: hexAlpha(COLOR.White, 40) }}>
          {section.label}
        </Text>
      </View>
    ),
    []
  );

  const goBack = useCallback(() => navigation.goBack(), []);

  const animStyle = useAnimatedStyle(() => {
    const opacity = interpolate(position.value, [0, 350], [0, 0.5]);
    return {
      flex: 1,
      opacity,
    };
  });

  const inputSearch = useMemo(() => new InputHandler(), [])
  const sectionData = contacts.labelContacts(contacts.contacts, inputSearch.value)

  console.log(toJS(contacts.contacts))

  useEffect(() => inputSearch.clear, []);

  return (
    <>
      <StatusBar style="light" />

      <ThemedGradient invert style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={animStyle}>
            <Header
              onPressBack={goBack}
              style={[styles.header, styles.wrapper]}
              title="Address Book"
              onPressPlus={openModal.addContact}
            />
            <View style={[styles.wrapper]}>
              <Search
                value={inputSearch.value}
                onChangeText={inputSearch.set}
                placeholder="Search Address"
                bottomsheet={false}
              />
            </View>

            {contacts.contacts.length > 0 ? (
              <SectionList
                style={{ marginTop: 10 }}
                keyExtractor={({ address }) => address}
                contentContainerStyle={{ paddingTop: 30 }}
                sections={sectionData}
                renderItem={renderContact}
                renderSectionHeader={renderSectionHeader}
              />
            ) : (
              <View style={[styles.wrapper, { flex: 1 }]}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ marginVertical: 40 }}>
                    <Circles>
                      <Icon2
                        name="address_book"
                        size={69}
                        stroke={COLOR.White}
                      />
                    </Circles>
                  </View>
                  <Title style={styles.title}>
                    Non hai ancora aggiunto alcun contatto
                  </Title>
                  <Subtitle style={styles.subtitle}>
                    Access VIP experiences, exclusive previews, finance your own
                    music projects and have your say.
                  </Subtitle>
                </View>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <Button
                text="Add Contact"
                onPress={openModal.addContact}
                textStyle={styles.buttonText}
                contentContainerStyle={styles.buttonContent}
                mode="fill"
              />
            </View>
          </Animated.View>
        </SafeAreaView>
      </ThemedGradient>
    </>
  );
});

type PropsHeader = {
  onPressBack(): void;
  onPressPlus(): void;
  style?: StyleProp<ViewStyle>;
  title?: string;
};

const Header = ({ onPressBack, style, title, onPressPlus }: PropsHeader) => (
  <View style={[styles.header_container, style]}>
    <View style={styles.header_left}>
      <TouchableOpacity onPress={onPressBack} style={styles.header_backButton}>
        <Icon2 name="arrow_left" size={24} stroke={COLOR.White} />
      </TouchableOpacity>
      <Title style={{ marginLeft: 19, fontSize: 18 }}>{title}</Title>
    </View>
    <View style={styles.header_right}>
      <View style={styles.header_scanButtonContainer}>
        <RectButton style={styles.header_scanButton} onPress={onPressPlus}>
          <Icon2 name="plus" size={18} stroke={COLOR.White} />
        </RectButton>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { marginBottom: 25 },

  head: {
    marginHorizontal: 25, // <- wrapper
    marginBottom: 30,
  },

  wrapper: { marginHorizontal: 34 },
  title: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 18,
    textAlign: "center",
    opacity: 0.3,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
  },
  buttonContent: {
    paddingHorizontal: 55,
    paddingVertical: 18,
    backgroundColor: COLOR.Dark3,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
  },

  // ------- Header ----------
  header_container: { flexDirection: "row" },
  header_left: { flexDirection: "row" },
  header_backButton: {
    padding: 5,
    borderRadius: 20,
  },
  header_right: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  header_scanButtonContainer: {
    width: 33,
    height: 33,
    borderRadius: 33,
    backgroundColor: COLOR.Dark3,
    overflow: "hidden",
  },
  header_scanButton: {
    width: 33,
    height: 33,
    alignItems: "center",
    justifyContent: "center",
  },

  // ------- BottomSheet --------
  bottomSheetBackground: {
    backgroundColor: COLOR.Dark3,
    paddingTop: 30,
  },
});