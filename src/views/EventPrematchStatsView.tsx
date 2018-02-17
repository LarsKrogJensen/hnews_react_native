import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {ScrollHooks} from "screens/CollapsableHeaderScreen";
import {LeagueTableView} from "views/LeagueTableView";
import {Head2HeadView} from "views/Head2HeadView";
import {TeamPerformanceView} from "views/TeamPerfomanceView";
import {ScrollView} from "react-native";


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
    eventId: number
    eventGroupid: number
    scrollHooks?: ScrollHooks
}

export class EventPrematchStatsView extends React.Component<ExternalProps> {

    shouldComponentUpdate(nextProps: Readonly<ExternalProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.eventGroupid !== this.props.eventGroupid) return true

        return false
    }

    public render() {
        const {eventId, eventGroupid} = this.props


        return (
            <ScrollView>
                <TeamPerformanceView eventId={eventId} style={{marginTop: 8}}/>
                <Head2HeadView eventId={eventId} style={{marginVertical: 8}}/>
                <LeagueTableView eventId={eventId} eventGroupId={eventGroupid} style={{marginBottom: 8}}/>
            </ScrollView>
        )
    }
}
