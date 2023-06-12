import React, { useState } from "react";
import {
  Platform,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
} from "react-native";

import {
  openSettings,
  Permission,
  PERMISSIONS,
  PermissionStatus,
  request,
} from "react-native-permissions";

import Lottie from "lottie-react-native";

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `PermissionRequest: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="PermissionRequest" component={PermissionRequestScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export type PermissionRouteParams = {
  permission: Permission;
  status: PermissionStatus;
};

export const PermissionRequestScreen = function PermissionRequestScreen(props: {
  route: { params: PermissionRouteParams };
  navigation: any;
}) {
  // Pull in one of our MST stores
  const { navigation, route } = props;
  const { permission, status } = route.params;
  const isAndroid = Platform.OS === "android";
  const [permissionStatus, setPermissionStatus] = useState(
    status as unknown as string
  );

  const onRequest = async () => {
    console.log(permissionStatus);
    if (permissionStatus === "denied") {
      const result = await request(permission as unknown as Permission);
      console.log(
        "🚀 ~ file: PermissionRequestScreen.tsx:46 ~ onRequest ~ result:",
        result
      );
      if (isAndroid && result === "blocked") {
        setPermissionStatus("blocked");
        return;
      }
      navigation.goBack();
    }
    if (permissionStatus === "blocked") {
      openSettings();
      navigation.goBack();
    }
  };
  const renderPermissionDetails = () => {
    const isUnavailable = status === "unavailable";
    switch (permission) {
      case PERMISSIONS.ANDROID.CAMERA:
      case PERMISSIONS.IOS.CAMERA:
        return (
          <>
            <Text
              tx="common.permission.camera.title"
              style={$text}
              preset="title"
            />
            <Text tx="common.permission.camera.descriptions" style={$text} />
            <View style={$root}>
              <Lottie
                style={$containerAnimation}
                source={
                  isUnavailable
                    ? require("@assets/animations/unavailable-permission.json")
                    : require("@assets/animations/camera-permission.json")
                }
                loop
                autoPlay
              />
            </View>
          </>
        );
      case PERMISSIONS.ANDROID.RECORD_AUDIO:
      case PERMISSIONS.IOS.MICROPHONE:
        return (
          <>
            <Text
              tx="common.permission.microphone.title"
              style={$text}
              preset="title"
            />
            <Text
              tx="common.permission.microphone.descriptions"
              style={$text}
            />
            <View style={$root}>
              <Lottie
                style={$containerAnimation}
                source={
                  isUnavailable
                    ? require("@assets/animations/unavailable-permission.json")
                    : require("@assets/animations/microphone-permission.json")
                }
                loop
                autoPlay
              />
            </View>
          </>
        );
      case PERMISSIONS.IOS.PHOTO_LIBRARY:
      case PERMISSIONS.ANDROID.READ_MEDIA_IMAGES:
      case PERMISSIONS.ANDROID.READ_MEDIA_VIDEO:
      case PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE:
      case PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE:
        return (
          <>
            <Text
              tx="common.permission.mediaLibrary.title"
              style={$text}
              preset="title"
            />
            <Text
              tx="common.permission.mediaLibrary.descriptions"
              style={$text}
            />
            <View style={$root}>
              <Lottie
                style={$containerAnimation}
                source={
                  isUnavailable
                    ? require("@assets/animations/unavailable-permission.json")
                    : require("@assets/animations/photo-gallery-permission.json")
                }
                loop
                autoPlay
              />
            </View>
          </>
        );
      case PERMISSIONS.ANDROID.POST_NOTIFICATIONS:
        return (
          <>
            <Text
              tx="common.permission.mediaLibrary.title"
              style={$text}
              preset="title"
            />
            <Text
              tx="common.permission.mediaLibrary.descriptions"
              style={$text}
            />

            <View style={$root}>
              <Lottie
                style={$containerAnimation}
                source={require("@assets/animations/push-notifications-permission.json")}
                loop
                autoPlay
              />
            </View>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <Screen
      style={$root}
      preset="fixed"
      contentContainerStyle={$root}
      safeAreaEdges={["top", "bottom"]}
    >
      {renderPermissionDetails()}
      <View style={$bottomButtonGroup}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text text="Skip" color={"black"} preset="subtitle" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onRequest}
          style={[$button, { backgroundColor: "black" }]}
        >
          <Text
            text={permissionStatus === "blocked" ? "Open Settings" : "I'm in"}
            color={"white"}
            preset="subtitle"
          />
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const $root: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "stretch",
  marginTop: 24,
};
const $text: TextStyle = { textAlign: "center" };

const $containerAnimation: ViewStyle = {
  position: "relative",
};
const $bottomButtonGroup: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  margin: 16,
};

const $button: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 8,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
};
