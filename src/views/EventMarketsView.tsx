import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator,
    Animated,
    ListRenderItemInfo,
    SectionList,
    SectionListData,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "entity/EventEntity";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import Touchable from "components/Touchable";
import {is, Set} from "immutable";
import {ScrollHooks} from "screens/CollapsableHeaderScreen";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {BetOfferEntity} from "entity/BetOfferEntity";
import {DefaultBetOfferItem} from "components/betoffer/DefaultBetOfferItem";
import {loadBetOffers} from "store/entity/actions";
import {BetOfferCategory, BetOfferType, Criterion} from "api/typings";
import {loadBetOfferCategories} from "store/groups/actions";
import {BetOfferTypes} from "components/betoffer/BetOfferTypes";
import {BetOfferGroupItem} from "components/betoffer/BetOfferGroupItem";
import {flatMap} from "lodash"
import {withPush} from "components/hoc/withPush";
import {API} from "store/API";
import connectAppState from "components/hoc/AppStateRefresh";
import {arrayEquals} from "lib/equallity";


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }>
    eventId: number
    eventGroupid: number
    live: boolean
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
    instantCategories: BetOfferCategory[]
    selectedCategories: BetOfferCategory[]
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
    key: string
}

class EventMarketsViewComponent extends React.Component<ComponentProps, ComponentState> {
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
        if (!arrayEquals(nextProps.betOffers, this.props.betOffers, bo => bo.id)) return true
        if (nextProps.event.state !== this.props.event.state) return true
        if (!is(nextState.expanded, this.state.expanded)) return true
        if (nextProps.orientation !== this.props.orientation) return true;

        return false
    }

    componentDidMount(): void {
        this.props.loadData()

        if (this.props.betOffers.length && this.props.categories.length) {
            this.prepareData(this.props.betOffers, this.props.categories, this.props.selectedCategories, this.props.instantCategories)
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
                nextProps.selectedCategories.length !== this.props.selectedCategories.length ||
                nextProps.instantCategories.length !== this.props.instantCategories.length ||
                !arrayEquals(nextProps.betOffers, this.props.betOffers, bo => bo.id))
        ) {
            this.prepareData(nextProps.betOffers, nextProps.categories, nextProps.selectedCategories, nextProps.instantCategories)
        }
    }

    public render() {
        const {loading} = this.props;
        const {sections, expanded} = this.state

        if (loading && !sections.length) {
            return (
                <View>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        const sectionsView: BetOfferSection[] = sections.map(section => ({
            ...section,
            data: expanded.has(section.category.id) ? section.betOfferGroups : []
        }));


        return (
            <AnimatedSectionList
                {...this.props.scrollHooks}
                stickySectionHeadersEnabled={true}
                sections={sectionsView}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
            />
        )
    }

    private prepareData = (betOffers: BetOfferEntity[], categories: BetOfferCategory[], selected: BetOfferCategory[], instant: BetOfferCategory[]) => {

        const sections: BetOfferSection[] = categories
            .filter(category => category.mappings)
            .sort((c1, c2) => c1.sortOrder - c2.sortOrder)
            .map<BetOfferSection>(category => (
                {
                    data: [],
                    betOfferGroups: this.filterAndGroupBetOffers(betOffers, category),
                    category,
                    count: 0
                }
            ))
            .map(section => ({...section, count: flatMap(section.betOfferGroups.map(g => g.betoffers)).length}))
            .filter(section => section.betOfferGroups.length)

        if (!!instant.length) {
            let betOfferGroups = this.findAndBuildCustomSelections(betOffers, instant, false);
            if (!!betOfferGroups.length) {
                sections.unshift({
                    data: [],
                    betOfferGroups: betOfferGroups,
                    category: {...instant[0], name: "Instant Betting"},
                    count: betOfferGroups.length
                })
            }
        }
        if (!!selected.length) {
            const betOfferGroups = this.findAndBuildCustomSelections(betOffers, selected);
            if (!!betOfferGroups.length) {
                sections.unshift({
                    data: [],
                    betOfferGroups: betOfferGroups,
                    category: {...selected[0], name: "Selected Markets"},
                    count: betOfferGroups.length
                })
            }
        }


        this.setState(prevState => ({
            sections,
            expanded: prevState.hasInitExpanded && sections.length > 0 ? prevState.expanded : Set(sections.length > 0 ? [sections[0].category.id] : []),
            hasInitExpanded: prevState.hasInitExpanded || sections.length > 0
        }))
    }

    private filterAndGroupBetOffers = (betOffers: BetOfferEntity[], category: BetOfferCategory): BetOfferGroup[] => {
        return betOffers
            .filter(bo => category.mappings.find(mapping => mapping.criterionId === bo.criterion.id))
            .reduceRight<BetOfferGroup[]>((groups, betoffer) => {
                let group = groups.find(g => g.criterion.id === betoffer.criterion.id && g.criterion.label === betoffer.criterion.label && g.type.id === betoffer.betOfferType.id)
                if (!group) {
                    group = {
                        betoffers: [],
                        criterion: betoffer.criterion,
                        type: betoffer.betOfferType,
                        key: betoffer.criterion.id.toString() + "-" + betoffer.betOfferType.id + "-" + betoffer.criterion.label
                    }
                    groups.push(group)
                }
                group.betoffers.push(betoffer)
                return groups
            }, [])
            .sort((bo1, bo2) => this.compareBetOffers(bo1, bo2, category))

    }

    private findAndBuildCustomSelections = (betOffers: BetOfferEntity[], categories: BetOfferCategory[], onlyOnePerCategory: boolean = true): BetOfferGroup[] => {
        const betOfferGroups: BetOfferGroup[] = []

        for (let category of categories.sort((c1, c2) => c1.sortOrder - c2.sortOrder)) {
            let groups = this.findBetOfferByCategory(category, betOffers);
            if (groups.length > 0) {
                if (onlyOnePerCategory) {
                    if (groups.length > 1) {
                        const minValue = (group: BetOfferGroup): number => group.betoffers.map(bo => bo.id).reduceRight((value, current) => Math.min(value, current), Number.MAX_VALUE)
                        // remove suspended, then sort by betoffer id...?
                        const filtered = groups
                            .map(group => ({
                                ...group,
                                betoffers: group.betoffers.filter(bo => !bo.suspended)
                            }))
                            .filter(group => !!group.betoffers.length)
                            .sort((g1, g2) => minValue(g1) - minValue(g2))
                        betOfferGroups.push(filtered.length > 0 ? filtered[0] : groups[0])
                    } else {
                        betOfferGroups.push(groups[0])
                    }
                } else {
                    betOfferGroups.push(...groups)
                }
            }
        }


        return betOfferGroups
    }

    private findBetOfferByCategory = (category: BetOfferCategory, betOffers: BetOfferEntity[]): BetOfferGroup[] => {
        const groups: BetOfferGroup[] = []
        for (let betOffer of betOffers) {
            if (category.mappings && category.mappings.find(mapping => mapping.criterionId === betOffer.criterion.id)) {
                groups.push({
                    betoffers: [betOffer],
                    criterion: betOffer.criterion,
                    type: betOffer.betOfferType,
                    key: category.id.toString() + "-" + betOffer.id
                })
            }
        }

        return groups
    }


    private compareBetOffers = (bo1: BetOfferGroup, bo2: BetOfferGroup, category: BetOfferCategory): number => {
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

    private renderItem = (info: ListRenderItemInfo<BetOfferGroup>) => {
        const group: BetOfferGroup = info.item

        return (
            <View style={styles.listItemStyle}>
                <Text style={{fontSize: 18, marginVertical: 4}}>
                    {group.criterion.label}
                </Text>
                {/*<Text>*/}
                    {/*(Criterion: {group.criterion.id}) Ty: {group.type.id} ({group.type.name})*/}
                {/*</Text>*/}

                {this.renderBetOfferGroup(group)}
            </View>
        )
    }


    private renderBetOfferGroup = (group: BetOfferGroup): React.ReactNode => {

        if (group.type.id === BetOfferTypes.OverUnder ||
            group.type.id === BetOfferTypes.CorrectScore ||
            group.type.id === BetOfferTypes.Winner ||
            group.type.id === BetOfferTypes.Position ||
            group.type.id === BetOfferTypes.Handicap ||
            group.type.id === BetOfferTypes.GoalScorer ||
            group.type.id === BetOfferTypes.ThreeWayHandicap ||
            group.type.id === BetOfferTypes.AsianHandicap ||
            group.type.id === BetOfferTypes.AsianOverUnder ||
            group.type.id === BetOfferTypes.HeadToHead ||
            group.type.id === BetOfferTypes.HalfTimeFullTime) {
            return (
                <BetOfferGroupItem eventId={this.props.eventId}
                                   type={group.type}
                                   betOfferIds={group.betoffers.map(bo => bo.id)}
                                   outcomeIds={flatMap(group.betoffers.map(bo => bo.outcomes))}/>
            )
        }


        return group.betoffers.map(bo => (
            <View key={bo.id} style={{marginVertical: 2}}>
                <DefaultBetOfferItem betofferId={bo.id} navigation={this.props.navigation}/>
            </View>
        ))
    }

    private renderSectionHeader = (info: { section: BetOfferSection }) => {
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

    private toggleSection = (key: number) => {
        this.setState(prevState => {
                let expanded: Set<number> = prevState.expanded
                expanded = expanded.has(key) ? expanded.delete(key) : expanded.add(key)
                return {
                    expanded
                }
            }
        )
    }
    
    private keyExtractor = (betOfferGroup: BetOfferGroup): string => {
        return betOfferGroup.key
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
    } as TextStyle,
    listItemStyle: {
        padding: 8,
        backgroundColor: "#F6F6F6",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1,
        flexDirection: "column"
    } as ViewStyle
})


// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => {
    const event = state.entityStore.events.get(inputProps.eventId);

    let categories: BetOfferCategory[] = []
    let selectedCategories: BetOfferCategory[] = []
    let instantCategories: BetOfferCategory[] = []
    let loadingCategories = false

    if (event) {
        let groupStore = state.groupStore;
        if (inputProps.live) {
            const key1 = `live_event-${event.groupId}`
            const key2 = `selected-live-${event.groupId}`
            const key3 = `instant-betting-${event.groupId}`
            loadingCategories = groupStore.loadingBetOfferCategories.has(key1) || groupStore.loadingBetOfferCategories.has(key2) || groupStore.loadingBetOfferCategories.has(key3)
            categories = groupStore.betOfferCategories.get(key1) || []
            selectedCategories = groupStore.betOfferCategories.get(key2) || []
            instantCategories = groupStore.betOfferCategories.get(key3) || []
        } else {
            const key = `pre_match_event-${event.groupId}`
            loadingCategories = groupStore.loadingBetOfferCategories.has(key)
            categories = groupStore.betOfferCategories.get(key) || []
        }
    }

    const betOffers = event && event.betOffers.map(betOfferId => state.entityStore.betoffers.get(betOfferId)).filter(id => id) || []
    return {
        loading: state.entityStore.betOffersLoading.has(inputProps.eventId) || loadingCategories,
        event,
        betOffers,
        categories,
        instantCategories,
        selectedCategories
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadBetOffers(inputProps.eventId, inputProps.live, fireStartLoad))

        if (inputProps.live) {
            dispatch(loadBetOfferCategories(inputProps.eventGroupid, "live_event", fireStartLoad))
            dispatch(loadBetOfferCategories(inputProps.eventGroupid, "selected-live", fireStartLoad))
            dispatch(loadBetOfferCategories(inputProps.eventGroupid, "instant-betting", fireStartLoad))
        } else {
            dispatch(loadBetOfferCategories(inputProps.eventGroupid, "pre_match_event", fireStartLoad))
        }
    },
})

const PushWrapper = withPush(EventMarketsViewComponent, (props) => [`ev.${props.eventId}`, `${API.pushLang}.ev.${props.eventId}`])

const WithOrientationChange = withOrientationChange(PushWrapper)

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps) => props.loadData(false))(WithOrientationChange)

export const EventMarketsView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

