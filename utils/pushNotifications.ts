import { navigate } from "navigation";
import PushNotification from "react-native-push-notification";

export function setUpPushNotificationsEvents()
{
	PushNotification.configure({
		onNotification: function(notification)
		{
			const { data } = notification;
			navigate("SendRecap")
		}
	})
}
