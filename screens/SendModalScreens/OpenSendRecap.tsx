import TransactionCreater from "classes/Transaction/Creater";
import useGlobalBottomsheet from "hooks/useGlobalBottomsheet";
import { COLOR, InputHandler } from "utils";
import { Footer } from "./components/atoms";
import { Recap } from "./components/organisms";
import { Text, View } from "react-native"

export async function openSendRecap (creater: TransactionCreater, accept: Function, reject: Function)
{
  const flags = {
    accepted: false
  }
	const globalBottomsheet = useGlobalBottomsheet()
  const send = () => {
    try
    {
      flags.accepted = true
      accept()
    }
    catch(e)
    {
      console.log(e)
    }
    globalBottomsheet.close()
  }
  const memo = new InputHandler()
  await globalBottomsheet.setProps({
    snapPoints: ["85%"],
    onClose: () => {
      if(!flags.accepted)
      {
        try
        {
          reject()
        }
        catch(e)
        {
          console.log(e)
        }
      }
    },
    children: (
      <View style={styles.wrapper}>
        <View style={styles.spacer}>
          <Text style={[styles.title, { marginTop: 40 }]}>Dapp Send</Text>
          <Recap
            bottomSheet={false}
            style={{marginTop: 30}}
            creater={creater}
            onPress={() => {}}
            memoInput={memo}
          />
        </View>
        <Footer
          isShowBack={false}
          onPressCenter={send}
          centerTitle="Confirm"
        />
      </View>
    ),
  });
  globalBottomsheet.expand()
}

const styles = {
	container: {
		flex: 1,
	},
	wrapper: {
		flex: 1,
	},
	header: { marginTop: 10 },
	spacer: {
		marginHorizontal: 30,
		flex: 1,
		justifyContent: "flex-end",
	},
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,

    color: COLOR.White,
  },
}