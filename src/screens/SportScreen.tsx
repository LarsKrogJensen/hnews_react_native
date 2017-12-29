import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import Screen from "screens/Screen";
import {SportView} from "views/SportView";

interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
}


export class SportScreen extends React.Component<ExternalProps> {

    shouldComponentUpdate(nextProps: Readonly<ExternalProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        const {navigation: {state: {params}}} = this.props;
        const {navigation: {state: {params: nextParams}}} = nextProps;

        if (nextParams.region !== params.region) return true
        if (nextParams.sport !== params.sport) return true
        if (nextParams.league !== params.league) return true

        return false
    }

    render(): React.ReactNode {
        const {navigation: {state: {params}}} = this.props;
        console.log("SportScreen render")
        return (
            <Screen title={params.group.englishName} rootScreen={true} navigation={this.props.navigation}>
                <SportView navigation={this.props.navigation}
                           sport={params.sport}
                           region={params.region}
                           league={params.league}
                />
            </Screen>
        )
    }
}