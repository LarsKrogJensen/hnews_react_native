import * as React from "react"
import {ComponentClass} from "react"
import {Text, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {CircularProgress} from 'react-native-circular-progress';
import {Card} from "components/Card";
import {HighlightItem} from "components/HighlightItem";


interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>,
}

interface StateProps {
    events: number[]
}

type Props = StateProps & ExternalProps

class HighlightsCardComponent extends React.Component<Props> {
    public render() {
        return (
            <Card>
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
                <Text style={{fontWeight: "500", flex: 1, color: "#333333"}}>HIGHLIGHTS</Text>
            </View>
        )
    }

    private renderBody() {
        const {events, navigation} = this.props;

        const elements: React.ReactNode[] = []
        let count = 0;
        for (let eventId of events) {
            if (count++ > 0) {
                elements.push(<View key={`sep-${eventId}`} style={{borderBottomColor: 'rgba(0, 0, 0, 0.12)', borderBottomWidth: 1}}/>)
            }
            elements.push(<HighlightItem key={eventId} navigation={navigation} eventId={eventId}/>)

        }
        return (
            <View style={bodyStyle}>
                {elements}
            </View>
        )
    }
}

const headerStyle: ViewStyle = {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)"
}

const bodyStyle: ViewStyle = {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "flex-start",
    alignItems: "stretch"
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    events: state.landingStore.highlights.events
})

export const HighlightsCard: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(HighlightsCardComponent)