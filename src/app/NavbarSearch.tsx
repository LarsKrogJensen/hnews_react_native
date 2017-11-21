import * as React from "react"
import autobind from "autobind-decorator";
import {NavigationScreenProp} from "react-navigation";
import {TextInput, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
    navigation?: NavigationScreenProp<{}, {}>
}

interface State {
    text: string,
    visible: boolean
}

export default class NavbarSearch extends React.Component<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {text: "", visible: false}
    }

    render() {
        const {text, visible} = this.state;

        return (
            <View style={{flexDirection: "row"}}>
                {visible && <TextInput
                    style={{height: 50, width: 250, backgroundColor: "#FFFFFF66", marginRight: 8}}
                    onChangeText={(txt) => this.setState({text: txt})}
                    onBlur={this.onBlur}
                    value={text}
                />}
                <Icon.Button name="ios-search"
                             size={30}
                             backgroundColor="transparent"
                             iconStyle={{marginLeft: 10}}
                             onPress={this.onClick}/>
            </View>

        )
    }

    @autobind
    onClick() {
        this.setState(prevState => ({visible: !prevState.visible}))
    }

    @autobind
    onBlur() {
        console.log("On blur")
        this.setState(prevState => ({visible: !prevState.visible}))
    }
}

// export default withNavigation(NavbarSearch)