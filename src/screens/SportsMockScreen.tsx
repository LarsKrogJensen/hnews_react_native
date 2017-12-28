import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {Text, View} from "react-native";

interface Props {
    navigation: NavigationScreenProp<{ params: any }, {}>
}

export class SportsMockScreen extends React.Component<Props> {


    constructor(props) {
        super(props)
        console.log("MOCK constructed " + this.format(props))
    }

    componentWillMount(): void {
        console.log("MOCK will mount "  + this.format(this.props))
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        console.log("MOCK will received new props" + this.format(this.props))
    }

    componentWillUnmount(): void {
        console.log("MOCK will UNmount " + this.format(this.props))
    }

    format(props: Props): string {
        let params = props.navigation.state.params;
        if (params) {
            return params.sport + "/" + params.region + "/" + params.league
        }

        return "unknown"

    }

    render(): React.ReactNode {
        return (
            <View>
                <Text>MOCK</Text>
            </View>
        )
    }
}