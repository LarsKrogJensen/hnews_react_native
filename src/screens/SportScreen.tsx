import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {SportView} from "views/SportView";
import {CollapsableHeaderScreen, ScrollHooks} from "screens/CollapsableHeaderScreen";
import autobind from "autobind-decorator";
import {OrientationProps} from "components/OrientationChange";

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

        return (
            <CollapsableHeaderScreen title={params.group.name}
                                     rootScreen={true}
                                     navigation={this.props.navigation}
                                     renderBody={props => (this.renderBody(props, params))}
            />
        )
    }

    @autobind
    private renderBody(scrollHooks: ScrollHooks, params: { sport: string, region: string, league: string }) {
        return (
            <SportView navigation={this.props.navigation}
                       scrollHooks={scrollHooks}
                       sport={params.sport}
                       region={params.region}
                       league={params.league}
                       filter="matches"
            />
        )
    }

}