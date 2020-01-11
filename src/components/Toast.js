import {ToastAndroid, Alert} from 'react-native';
import {isiOS} from '../Constants';

export default function Toast(message) {
  if (isiOS) {
    Alert.alert(message);
  } else {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}
