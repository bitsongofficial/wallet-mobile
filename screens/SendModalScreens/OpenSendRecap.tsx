import TransactionCreater from "classes/Transaction/Creater";
import { useGlobalBottomsheet } from "hooks";
import { InputHandler } from "utils";
import { Footer } from "./components/atoms";
import { Recap } from "./components/organisms";
import { View } from "react-native"

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
	}
}

export function openSendRecap (creater: TransactionCreater, accept: Function, reject: Function)
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
    globalBottomsheet.setProps({
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
            <Recap
              bottomSheet={false}
              style={{ marginTop: 100 }}
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