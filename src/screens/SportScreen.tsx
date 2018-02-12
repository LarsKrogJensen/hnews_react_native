import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {SportView} from "views/SportView";
import {CollapsableHeaderScreen, ScrollHooks} from "screens/CollapsableHeaderScreen";

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
        if (nextProps.headerText !== this.props.headerText) return true
        if (nextProps.league !== this.props.league) return true
        if (nextProps.filter !== this.props.filter) return true
        if (nextProps.active !== this.props.active) return true

        return false
    }

    render(): React.ReactNode {
        const {navigation, navigation: {state: {params}}} = this.props;

        return (
            <CollapsableHeaderScreen title={params.group.name}
                                     rootScreen={true}
                                     navigation={navigation}
                                     renderBody={this.renderBody}
            />
        )
    }

    private renderBody = (scrollHooks: ScrollHooks) => {
        const {navigation, sport, region, league, filter, active} = this.props

        if (!active) return null

        return (
            <SportView navigation={navigation}
                       scrollHooks={scrollHooks}
                       sport={sport}
                       region={region}
                       league={league}
                       filter={filter}
            />
        )
    }
}
