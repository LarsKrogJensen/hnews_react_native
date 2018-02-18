import * as React from "react"
import {ComponentClass} from "react"
import {EventInfoItem} from "components/event/EventInfoItem";
import Touchable from "components/Touchable";
import {Orientation} from "lib/device";
import {NavigationScreenProp} from "react-navigation";
import {StyleSheet, View, ViewStyle} from "react-native";
import {EventEntity} from "entity/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {DefaultBetOfferItem} from "components/betoffer/DefaultBetOfferItem";
import {navigate} from "lib/navigate";
import {objectPropEquals} from "lib/compareProp";


interface ExternalProps {
    eventId: number
    orientation: Orientation
    navigation: NavigationScreenProp<{}, {}>,
    showFavorites?: boolean
}

interface StateProps {
    event: EventEntity
}

type Props = StateProps & ExternalProps

class EventListItem extends React.Component<Props> {

    public shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.orientation !== this.props.orientation) return true
        if (!objectPropEquals(nextProps.event, this.props.event, e => e.mainBetOfferId)) return true

        return false
    }

    public render() {
        const {event, orientation, navigation} = this.props
        const viewStyle = orientation === Orientation.Portrait ? styles.portrait : styles.landscape;

        // console.log("Rendering EventListItem")
        return (
            <Touchable onPress={this.handleItemClick}>
                <View style={[styles.item, viewStyle]}>
                    <EventInfoItem eventId={event.id}
                                   viewStyle={{flex: 1, height: 68}}
                                   showFavorites/>
                    {event.mainBetOfferId &&
                    <DefaultBetOfferItem orientation={orientation} betofferId={event.mainBetOfferId}
                                         navigation={navigation}/>}
                </View>
            </Touchable>
        );
    }


    private handleItemClick = () => {
        navigate(this.props.navigation, "Event", {eventId: this.props.eventId})
    }
}

const styles = StyleSheet.create({
    item: {
        padding: 8,
        backgroundColor: "#F6F6F6",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1
    } as ViewStyle,
    portrait: {
        flexDirection: "column"
    } as ViewStyle,
    landscape: {
        flexDirection: "row"
    }
})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(EventListItem)

export default WithData