import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {useEffect} from 'react';

const NotificationService = props => {
  useEffect(() => {
    requestUserPermission();
    NotificationListner();
  }, [props]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken, 'fcm token');
  };

  const NotificationListner = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      notificationBuilder(remoteMessage);
      console.log(
        'Notificationn caused app to open from background state:',
        remoteMessage.notification,
      );
    });
    messaging().setBackgroundMessageHandler(function (payload) {
      console.log('Handling background message ', payload);

    });
    messaging().onMessage(async remoteMessage => {

      notificationBuilder(remoteMessage);

    });

    const notificationBuilder = remoteMessage => {
      console.log('remoteMessage', remoteMessage);
      PushNotification.createChannel(
        {
          channelId: '1062290442356', 
          channelName: remoteMessage.notification.title, 
          channelDescription: remoteMessage.notification.body, 
          importance: 4, 
          vibrate: true, 
        },

        created => console.log(`createChannel returned '${created}'`), 
      );
      PushNotification.localNotification({
        channelId: '1062290442356', 
        ticker: remoteMessage.notification.title, 
        showWhen: true, 
        autoCancel: true, 
        largeIcon: 'NunaMoving', 
        largeIconUrl: 'ic_launcher.png', 
        smallIcon: 'NunaMoving', 
        bigText: remoteMessage.notification.body, 
        subText: 'New Notification Received', 
        bigPictureUrl: 'ic_launcher.png', 
        bigLargeIcon: 'NunaMoving', 
        bigLargeIconUrl: 'ic_launcher.png', 
        color: 'red', 
        vibrate: true, 
        vibration: 300, 
        tag: 'some_tag', 
        group: 'group', 
        groupSummary: false, 
        ongoing: false, 
        priority: 'high', 
        visibility: 'private', 
        ignoreInForeground: false, 
        shortcutId: 'shortcut-id', 
        onlyAlertOnce: true, 

        when: null, 
        usesChronometer: false, 
        timeoutAfter: null, 

        messageId: 'google:message_id', 

        invokeApp: true, 

        category: '', 

        id: 0, 
        title: remoteMessage.notification.title, 
        message: remoteMessage.notification.body, 
        picture: 'https://www.example.tld/picture.jpg', 
        userInfo: {}, 
        playSound: false, 
        soundName: 'default', 
        number: 10, 

      });
    };
  };
};
export default NotificationService;
