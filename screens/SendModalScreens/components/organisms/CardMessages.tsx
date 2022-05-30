import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useTheme } from "hooks";
import { Badge } from "components/atoms";
import { Message } from "../moleculs";
import { IMessage } from "../../type";

type Props = {
  style?: StyleProp<ViewStyle>;
  messages: IMessage[];
};

const CardMessages = ({ style, messages }: Props) => {
  const theme = useTheme();

  return (
    <View style={style}>
      <View style={{ flexDirection: "row", marginBottom: 16, marginLeft: 11 }}>
        <Text style={[theme.text.primary, styles.title]}>Messages</Text>
        <Badge count={1} />
      </View>

      {messages.map((message) => (
        <Message item={message} />
      ))}
    </View>
  );
};

export default CardMessages;

const styles = StyleSheet.create({
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 16,

    marginRight: 7,
  },

  badge: {
    backgroundColor: "#4D60E4",
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  count: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
  },
});
