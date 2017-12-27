import * as React from "react"
import {Platform, View, ViewStyle} from "react-native";
import Touchable from "components/Touchable";

interface Props {
    onPress?: () => any
}

export class Card extends React.Component<Props> {

    render(): React.ReactNode {
        const {children, onPress} = this.props
        return (
            <View style={cardStyle}>
                {
                    onPress
                        ? (<Touchable onPress={onPress}>{children}</Touchable>)
                        : children
                }

            </View>
        )
    }
}

const cardStyle: ViewStyle = {
    backgroundColor: "#F6F6F6",
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 2,
    ...Platform.select<ViewStyle>({
        android: {
            elevation: 2
        }, ios: {
            shadowColor: "black",
            shadowOpacity: 0.3,
            shadowRadius: 1,
            shadowOffset: {
                height: 1,
                width: 0
            },
            // we need to have zIndex on iOS, otherwise the shadow is under components that
            // are rendered later
            zIndex: 1
        }
    })
}