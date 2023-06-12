import { PERMISSIONS } from "react-native-permissions";

declare interface Permission {
  android?: keyof typeof PERMISSIONS.ANDROID;
  ios?: keyof typeof PERMISSIONS.IOS;
}
