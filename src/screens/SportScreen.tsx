import * as React from "react"
import {ComponentClass} from "react"
import {Button, Text} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import Screen from "screens/Screen";
import {EventEntity} from "model/EventEntity";
import {loadSport} from "store/sport/actions";
import connectAppState from "components/AppStateRefresh";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {loadOpenForLive} from "store/live/actions";


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
    sport: string,
    region: string,
    league: string
}

interface DispatchProps {
    loadData: (fireStartLoad: boolean) => void
}

interface StateProps {
    loading: boolean,
    events: EventEntity[]
}

type ComponentProps = StateProps & DispatchProps & ExternalProps

class SportScreenComponent extends React.Component<ComponentProps> {


    componentDidMount(): void {
        this.props.loadData(true)
    }

    public render() {
        const {navigation, sport, region, league, events, loading} = this.props

        return (
            <Screen title="Sport" {...this.props} rootScreen>
                <Text>Sports {sport}</Text>
                <Text>Region {region}</Text>
                <Text>League {league}</Text>
                <Text>Events {events.length}</Text>
                <Text>Loading {loading}</Text>
                <Button title="Goto Event" onPress={() => navigation.navigate('Event', {name: 'Floorball'})}/>
            </Screen>
        )
    }
}

function mapEvents(state: AppStore, key: string): EventEntity[] {
    const events: EventEntity[] = []
    for (let eventId of state.sportStore.events.get(key, [])) {
        let eventEntity = state.entityStore.events.get(eventId);
        if (eventEntity) {
            events.push(eventEntity)
        }
    }

    return events
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => {
    const {sport, region, league} = inputProps
    const key = `${sport}.${region}.${league}`

    return {
        loading: state.sportStore.loading.contains(key),
        events: mapEvents(state, key)
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => {
    const {sport, region, league} = inputProps

    return {
        loadData: (fireStartLoad: boolean) => {
            console.log("loading sports " + sport + ", " + region + "," + league + " fireStartLoad: " + fireStartLoad)
            if (sport && region && league) {
                dispatch(loadSport(sport, region, league, fireStartLoad))
                dispatch(loadOpenForLive(fireStartLoad))
            }
        }
    }
}

export const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(SportScreenComponent)

export const SportsScreen: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

