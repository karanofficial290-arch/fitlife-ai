import AsyncStorage from '@react-native-async-storage/async-storage';

// "Remember me" off → the session is kept for this app run only and cleared
// on the next cold start. Stored on the device; default is remember.

const KEY = 'fitmxo.rememberMe';

export async function setRememberMe(remember: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, remember ? 'true' : 'false');
  } catch {
    // If this fails the safer default (remember) applies; nothing else breaks.
  }
}

export async function shouldForgetSessionOnLaunch(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === 'false';
  } catch {
    return false;
  }
}
