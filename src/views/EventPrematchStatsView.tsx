import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {ScrollHooks} from "screens/CollapsableHeaderScreen";
import {LeagueTableView} from "views/LeagueTableView";
import {Head2HeadView} from "views/Head2HeadView";
import {TeamPerformanceView} from "views/TeamPerfomanceView";


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
    eventId: number
    eventGroupid: number
    scrollHooks?: ScrollHooks
}

interface ComponentState {
}


export class EventPrematchStatsView extends React.Component<ExternalProps, ComponentState> {

    shouldComponentUpdate(nextProps: Readonly<ExternalProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.eventGroupid !== this.props.eventGroupid) return true

        return false
    }

    public render() {
        const {eventId, eventGroupid} = this.props


        return (
            <React.Fragment>
                <Head2HeadView eventId={eventId}/>
                <TeamPerformanceView eventId={eventId}/>
                <LeagueTableView eventId={eventId} eventGroupId={eventGroupid}/>
            </React.Fragment>
        )
    }
}
