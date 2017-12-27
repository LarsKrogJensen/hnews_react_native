import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import Screen from "screens/Screen";
import {SportsScreen} from "screens/SportScreen";

interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
}

interface State {
    sport: string,
    region: string,
    league: string
}

export class SportScreenRouter extends React.Component<ExternalProps> {


    constructor(props: ExternalProps, context: any) {
        super(props, context);
        this.state = {
            sport: props.navigation.state.params.sport,
            region: props.navigation.state.params.region,
            league: props.navigation.state.params.league
        }
    }

    componentWillMount(): void {
        console.log("SportScreen willMount")
    }

    componentDidMount(): void {
        console.log("SportScreen didMount")
    }

    componentWillReceiveProps(nextProps: Readonly<ExternalProps>, nextContext: any): void {
        console.log("SportScreen willReceiveNewProps")
        this.setState({
            sport: nextProps.navigation.state.params.sport,
            region: nextProps.navigation.state.params.region,
            league: nextProps.navigation.state.params.league
        })
    }

    componentWillUnmount(): void {
        console.log("SportScreen willUnmount")
    }

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
            <Screen title="Sport" rootScreen={true} navigation={this.props.navigation}>
                <SportsScreen navigation={this.props.navigation}
                              sport={params.sport}
                              region={params.region}
                              league={params.league}
                />
            </Screen>
        )
    }
}