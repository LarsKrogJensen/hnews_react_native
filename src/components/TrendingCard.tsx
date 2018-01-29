import * as React from "react"
import {ComponentClass} from "react"
import {Card} from "components/Card";
import {Text, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import EventPathItem from "components/EventPathItem";
import {formatDateTime} from "lib/dates";
import {DefaultBetOfferItem} from "components/betOffers/DefaultBetOfferItem";
import {navigate} from "lib/navigate";

interface ExternalProps {
    eventId: number
    navigation: NavigationScreenProp<{}, {}>,
}

interface StateProps {
    event: EventEntity
}

type Props = StateProps & ExternalProps

class TrendingCard extends React.Component<Props> {
    public render() {
        return (
            <Card onPress={() => navigate(this.props.navigation, "Event",{eventId: this.props.eventId})}>
                <View>
                    {this.renderHeader()}
                    {this.renderBody()}
                </View>
            </Card>
        )
    }

    private renderHeader() {
        const {date, time} = formatDateTime(this.props.event.start)
        return (
            <View style={headerStyle}>
                <Text style={{fontWeight: "500", flex: 1, color: "#333333"}}>TRENDING</Text>
                <Text>{`${date} ${time}`}</Text>
            </View>
        )
    }

    private renderBody() {
        let event = this.props.event;
        return (
            <View style={bodyStyle}>
                <Text style={{fontSize: 20, marginTop: 8, textAlign: "center"}}>{event.name}</Text>
                <EventPathItem path={event.path} style={{marginBottom: 8, marginTop: 4, alignSelf: "center"}}/>
                {event.mainBetOfferId && <DefaultBetOfferItem betofferId={event.mainBetOfferId}/>}
            </View>
        )
    }
}

const cardStyle: ViewStyle = {
    backgroundColor: "#F6F6F6"
}

const headerStyle: ViewStyle = {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)"
}

const bodyStyle: ViewStyle = {
    padding: 8,
    justifyContent: "center",
    alignItems: "stretch"

}


const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(TrendingCard)

export default WithData