import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {SportView} from "views/SportView";
import Screen from "screens/Screen";

interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
    sport: string
    region: string
    league: string
    filter: "matches" | "competitions",
    active: boolean
}


export class SportScreen extends React.Component<ExternalProps> {

    shouldComponentUpdate(nextProps: Readonly<ExternalProps>, nextState: Readonly<{}>, nextContext: any): boolean {

        if (nextProps.region !== this.props.region) return true
        if (nextProps.sport !== this.props.sport) return true
        if (nextProps.league !== this.props.league) return true
        if (nextProps.filter !== this.props.filter) return true
        if (nextProps.active !== this.props.active) return true

        return false
    }

    render(): React.ReactNode {
        const {navigation, navigation: {state: {params}}} = this.props;

        return (
            <Screen title={params.group.name}
                    rootScreen={true}
                    navigation={navigation}>
                {this.renderBody()}
            </Screen>
        )
    }

    private renderBody = () => {
        const {navigation, sport, region, league, filter, active} = this.props

        if (!active) return null

        return (
            <SportView navigation={navigation}
                       sport={sport}
                       region={region}
                       league={league}
                       filter={filter}
            />
        )
    }
}
