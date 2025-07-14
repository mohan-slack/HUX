import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotification(pushToken: string, title: string, body: string) {
  if (!Expo.isExpoPushToken(pushToken)) {
    throw new Error('Invalid Expo push token');
  }
  await expo.sendPushNotificationsAsync([
    {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data: {},
    },
  ]);
} 