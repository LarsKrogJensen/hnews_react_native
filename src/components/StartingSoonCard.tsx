import * as React from "react"
import {ComponentClass} from "react"
import {Card} from "components/Card";
import {Text, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import BetOfferItem from "components/BetOfferItem"
import {Orientation} from "lib/device";
import EventPathItem from "components/EventPathItem";
import CountDown from "components/CountDown";

interface ExternalProps {
    eventId: number
    navigation: NavigationScreenProp<{}, {}>,
}

interface StateProps {
    event: EventEntity
}

type Props = StateProps & ExternalProps

class StartingSoonCard extends React.Component<Props> {
    public render() {
        return (
            <Card onPress={() => this.props.navigation.navigate("Event")}>
                <View>
                    {this.renderHeader()}
                    {this.renderBody()}
                </View>
            </Card>
        )
    }

    private renderHeader() {
        return (
            <View style={headerStyle}>
                <Text style={{fontWeight: "500", flex: 1, color: "#333333"}}>STARTING SOON</Text>
                <CountDown start={this.props.event.start} format="HH:mm:ss"/>
            </View>
        )
    }

    private renderBody() {
        let event = this.props.event;
        return (
            <View style={bodyStyle}>
                <Text style={{fontSize: 20, marginTop: 8, textAlign: "center"}}>{event.name}</Text>
                <EventPathItem event={event}
                               style={{marginBottom: 8, marginTop: 4, alignSelf: "center"}}/>
                <BetOfferItem orientation={Orientation.Portrait}
                              betofferId={event.mainBetOfferId}/>
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
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(StartingSoonCard)

export default WithData