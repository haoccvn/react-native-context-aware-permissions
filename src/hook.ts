import { useIsFocused, useNavigation } from "@react-navigation/native"
import { useLayoutEffect, useRef, useState } from "react"
import { Platform } from "react-native"
import {
  checkMultiple,
  Permission,
  PERMISSIONS,
} from "react-native-permissions"
type Statuses = Record<Permission, string>
export interface PermissionType {
  android?: keyof typeof PERMISSIONS.ANDROID
  ios?: keyof typeof PERMISSIONS.IOS
}

export const usePermissions = (permissions: PermissionType[]) => {
  const navigation = useNavigation<any>()
  const isFocused = useIsFocused()
  const showRequestScreen = useRef<boolean>(true)
  const [hasPermissions, setHasPermissions] = useState(false)
  const isIOS = Platform.OS === "ios"
  const isANDROID = Platform.OS === "android"

  async function checkPermissions() {
    let statuses: Statuses = {} as any

    // check statuses
    if (isIOS) {
      statuses = await checkMultiple(
        [...permissions]
          .map((p) => PERMISSIONS.IOS[p.ios as string] as unknown as Permission)
          .filter((p) => !!p)
      )
    }
    if (isANDROID) {
      statuses = await checkMultiple(
        [...permissions]
          .map(
            (p) =>
              PERMISSIONS.ANDROID[p.android as string] as unknown as Permission
          )
          .filter((p) => !!p)
      )
    }
    return statuses
  }

  function requestPermissions(statuses: Statuses) {
    // request permissions
    const permissionsUnavailable = Object.keys(statuses).filter(
      (key) => statuses[key] === "unavailable"
    )
    const permissionsRequestable = Object.keys(statuses).filter(
      (key) => statuses[key] === "denied"
    )
    const permissionsBlocked = Object.keys(statuses).filter(
      (key) => statuses[key] === "blocked"
    )

    if (
      [
        ...permissionsBlocked,
        ...permissionsRequestable,
        ...permissionsUnavailable,
      ].length === 0
    ) {
      console.log("Permission is TRUE")
      setHasPermissions(true)
    } else if (permissionsRequestable.length > 0) {
      permissionsRequestable?.forEach((permission) => {
        if (showRequestScreen.current) {
          navigation.push("PermissionRequest", {
            permission: permission as unknown as Permission,
            status: "denied",
          })
        }
      })
    } else if (permissionsBlocked?.length > 0) {
      permissionsBlocked.forEach((permission) => {
        if (showRequestScreen.current) {
          navigation.push("PermissionRequest", {
            permission: permission as unknown as Permission,
            status: "blocked",
          })
        }
      })
    } else if (permissionsUnavailable?.length > 0) {
      permissionsUnavailable.forEach((permission) => {
        if (showRequestScreen.current) {
          navigation.push("PermissionRequest", {
            permission: permission as unknown as Permission,
            status: "unavailable",
          })
        }
      })
    }
    showRequestScreen.current = false
  }

  async function checkAndRequestPermissions() {
    const statuses = await checkPermissions()
    requestPermissions(statuses)
  }

  useLayoutEffect(() => {
    isFocused && checkAndRequestPermissions()
  }, [isFocused])
  return hasPermissions
}
