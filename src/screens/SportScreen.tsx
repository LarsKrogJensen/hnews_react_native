import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {SportView} from "views/SportView";
import {CollapsableScreen3, ScrollProps} from "screens/CollapsableScreen3";
import autobind from "autobind-decorator";

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
            <CollapsableScreen3 title={params.group.englishName}
                                rootScreen={true}
                                navigation={this.props.navigation}
                                renderBody={props => (this.renderBody(props, params))}
            />
        )
    }

    @autobind
    private renderBody(scrollProps: ScrollProps, params: { sport: string, region: string, league: string }) {
        return (
            <SportView navigation={this.props.navigation}
                       scrollProps={scrollProps}
                       sport={params.sport}
                       region={params.region}
                       league={params.league}
            />
        )
    }

}