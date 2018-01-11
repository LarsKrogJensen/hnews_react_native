import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator, Animated, ListRenderItemInfo, RefreshControl, SectionList, SectionListData, StyleSheet, Text,
    TextStyle, View, ViewStyle
} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import connectAppState from "components/AppStateRefresh";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import autobind from "autobind-decorator";
import Touchable from "components/Touchable";
import {is, Set} from "immutable";
import {ScrollHooks} from "screens/CollapsableHeaderScreen";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {BetOfferEntity} from "model/BetOfferEntity";
import {DefaultBetOfferItem} from "components/betOffers/DefaultBetOfferItem";
import {loadBetOffers} from "store/entity/actions";
import {BetOfferCategory, BetOfferType, Criterion} from "api/typings";
import {loadPrematchCategories} from "store/groups/actions";
import {BetOfferTypes} from "components/betOffers/BetOfferTypes";
import {BetOfferGroupItem} from "components/betOffers/BetOfferGroupItem";
import * as _ from "lodash"


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
    eventId: number
    eventGroupid: number
    scrollHooks?: ScrollHooks
}

interface ComponentState {
    sections: BetOfferSection[]
    expanded: Set<number>
    hasInitExpanded: boolean
}

interface DispatchProps {
    loadData: (fireStartLoad?: boolean) => void
}

interface StateProps {
    loading: boolean,
    event: EventEntity
    betOffers: BetOfferEntity[]
    categories: BetOfferCategory[]
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps

const AnimatedSectionList: SectionList<BetOfferGroup> = Animated.createAnimatedComponent(SectionList);

interface BetOfferSection extends SectionListData<BetOfferGroup> {
    betOfferGroups: BetOfferGroup[]
    category: BetOfferCategory
    count: number
}

interface BetOfferGroup {
    criterion: Criterion
    type: BetOfferType
    betoffers: BetOfferEntity[]
}

class PrematchEventViewComponent extends React.Component<ComponentProps, ComponentState> {
    constructor(props: ComponentProps) {
        super(props);

        this.state = {
            sections: [],
            expanded: Set(),
            hasInitExpanded: false
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.betOffers.length !== this.props.betOffers.length) return true
        if (nextProps.betOffers.map(e => e.id).join() !== this.props.betOffers.map(e => e.id).join()) return true
        if (!is(nextState.expanded, this.state.expanded)) return true
        if (nextProps.orientation !== this.props.orientation) return true;

        return false
    }

    componentDidMount(): void {
        this.props.loadData()

        if (this.props.betOffers.length && this.props.categories.length) {
            this.prepareData(this.props.betOffers, this.props.categories)
        }
    }

    componentWillReceiveProps(nextProps: Readonly<ComponentProps>, nextContext: any): void {
        if (nextProps.eventId !== this.props.eventId || nextProps.eventGroupid !== this.props.eventGroupid) {
            nextProps.loadData(true)
        }

        // console.log(`NextProps - loading ${this.props.loading}/${nextProps.loading} boCount ${this.props.betOffers.length}/${nextProps.betOffers.length} catCount: ${this.props.categories.length}/${nextProps.categories.length}`)
        if (!nextProps.loading && nextProps.categories.length && nextProps.betOffers.length &&
            (nextProps.eventId !== this.props.eventId ||
                nextProps.eventGroupid !== this.props.eventGroupid ||
                nextProps.categories.length !== this.props.categories.length ||
                nextProps.betOffers.length !== this.props.betOffers.length ||
                nextProps.betOffers.map(e => e.id).join() !== this.props.betOffers.map(e => e.id).join())
        ) {
            this.prepareData(nextProps.betOffers, nextProps.categories)
        }
    }

    public render() {
        const {loading} = this.props;
        if (loading) {

            return (
                <View>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        const {sections, expanded} = this.state

        const sectionsView: BetOfferSection[] = sections.map(section => ({
            ...section,
            data: expanded.has(section.category.id) ? section.betOfferGroups : []
        }));


        return (
            <AnimatedSectionList
                {...this.props.scrollHooks}
                stickySectionHeadersEnabled={true}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh}/>}
                sections={sectionsView}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
            />
        )
    }

    private prepareData(betOffers: BetOfferEntity[], categories: BetOfferCategory[]) {

        const sections: BetOfferSection[] = categories
            .sort((c1, c2) => c1.sortOrder - c2.sortOrder)
            .map<BetOfferSection>(category => (
                {
                    data: [],
                    betOfferGroups: this.filterAndGroupBetOffers(betOffers, category),
                    category,
                    count: 0
                }
            ))
            .map(section => ({...section, count: _.flatMap(section.betOfferGroups).length}))
            .filter(section => section.betOfferGroups.length)


        this.setState(prevState => ({
            sections,
            expanded: prevState.hasInitExpanded && sections.length > 0 ? prevState.expanded : Set(sections.length > 0 ? [sections[0].category.id] : []),
            hasInitExpanded: prevState.hasInitExpanded || sections.length > 0
        }))
    }

    private filterAndGroupBetOffers(betOffers: BetOfferEntity[], category: BetOfferCategory): BetOfferGroup[] {
        return betOffers
            .filter(bo => category.mappings.find(mapping => mapping.criterionId === bo.criterion.id))
            .reduceRight<BetOfferGroup[]>((groups, betoffer) => {
                let group = groups.find(g => g.criterion.id === betoffer.criterion.id) // || {betoffers: [], criterion: betoffer.criterion}
                if (!group) {
                    group = {betoffers: [], criterion: betoffer.criterion, type: betoffer.betOfferType}
                    groups.push(group)
                }
                group.betoffers.push(betoffer)
                return groups
            }, [])
            .sort((bo1, bo2) => this.compareBetOffers(bo1, bo2, category))

    }

    private compareBetOffers(bo1: BetOfferGroup, bo2: BetOfferGroup, category: BetOfferCategory): number {
        const mappingBo1 = category.mappings.find(mapping => mapping.criterionId === bo1.criterion.id)
        const mappingBo2 = category.mappings.find(mapping => mapping.criterionId === bo2.criterion.id)

        if (mappingBo1 && mappingBo2) {
            return mappingBo1.sortOrder - mappingBo2.sortOrder
        }
        if (!mappingBo1 && mappingBo2) {
            return -1
        }
        if (mappingBo1 && !mappingBo2) {
            return 1
        }

        return 0;
    }

    @autobind
    private onRefresh() {
        this.props.loadData(true)
    }

    @autobind
    private renderItem(info: ListRenderItemInfo<BetOfferGroup>) {
        const group: BetOfferGroup = info.item

        const viewStyle: ViewStyle = {
            padding: 8,
            backgroundColor: "#F6F6F6",
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 1,
            flexDirection: "column"
        }

        return (
            <View style={viewStyle}>
                <Text style={{fontSize: 18, marginVertical: 4}}>
                    {group.criterion.englishLabel}
                </Text>
                <Text>
                    (Criterion: {group.criterion.id}) Ty: {group.type.englishName} ({group.type.id})
                </Text>
                {this.renderBetOfferGroup(group)}
            </View>
        )
    }

    private renderBetOfferGroup(group: BetOfferGroup): React.ReactNode {

        if (group.type.id === BetOfferTypes.OverUnder ||
            group.type.id === BetOfferTypes.CorrectScore ||
            group.type.id === BetOfferTypes.ThreeWayHandicap ||
            group.type.id === BetOfferTypes.AsianHandicap ||
            group.type.id === BetOfferTypes.HalfTimeFullTime) {
            return <BetOfferGroupItem eventId={this.props.eventId}
                                      type={group.type}
                                      outcomes={_.flatMap(group.betoffers.map(bo => bo.outcomes))}/>
        }


        return group.betoffers.map(bo => (
            <View key={bo.id} style={{marginVertical: 2}}>
                <DefaultBetOfferItem betofferId={bo.id}/>
            </View>
        ))
    }


    @autobind
    private renderSectionHeader(info: { section: BetOfferSection }) {
        const section = info.section

        return (
            <Touchable onPress={() => this.toggleSection(section.category.id)}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitleText}>{section.category.name}</Text>
                    <Text style={styles.sectionCount}>{section.count}</Text>
                </View>
            </Touchable>
        )
    }

    @autobind
    private toggleSection(key: number) {
        this.setState(prevState => {
                let expanded: Set<number> = prevState.expanded
                expanded = expanded.has(key) ? expanded.delete(key) : expanded.add(key)
                return {
                    expanded
                }
            }
        )
    }

    private keyExtractor(betOfferGroup: BetOfferGroup): string {
        return betOfferGroup.criterion.id.toString()
    }
}

// styles
const styles = StyleSheet.create({
    header: {
        padding: 8,
        height: 44,
        backgroundColor: "white",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    sectionTitleText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
        flex: 1
    } as TextStyle,
    sectionCount: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8
    } as TextStyle
})


// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => {
    const event = state.entityStore.events.get(inputProps.eventId);
    const betOffers = event && event.betOffers.map(betOfferId => state.entityStore.betoffers.get(betOfferId)).filter(id => id) || []
    return {
        loading: state.entityStore.betOffersLoading.has(inputProps.eventId) || state.groupStore.loadingPrematchCategories.has(event.groupId),
        event,
        betOffers,
        categories: state.groupStore.prematchCategories.get(event.groupId) || []
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadBetOffers(inputProps.eventId, fireStartLoad))
        dispatch(loadPrematchCategories(inputProps.eventGroupid, fireStartLoad))
    },
})

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(PrematchEventViewComponent))

export const PrematchEventView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

