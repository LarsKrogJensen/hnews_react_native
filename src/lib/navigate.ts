import {NavigationAction, NavigationParams, NavigationScreenProp} from "react-navigation";


export function navigate(navigation: NavigationScreenProp<any, any>, routeName: string, params?: NavigationParams, action?: NavigationAction) {
    if (navigation) {
        try {
            navigation.navigate(routeName, params, action)
        } catch(error) {
            console.error("Navigation error: " + error)
        }
    }
}

export function navigateBack(navigation: NavigationScreenProp<any, any>) {
    if (navigation) {
        try {
            navigation.goBack()
        } catch(error) {
            console.error("Navigation back error: " + error)
        }
    }
}

export function navigateDrawerOpen(navigation: NavigationScreenProp<any, any>) {
    navigate(navigation, "DrawerOpen")
}