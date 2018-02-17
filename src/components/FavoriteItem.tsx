import * as React from "react"
import {ComponentClass} from "react"
import {ViewStyle} from "react-native";
import {addFavorite, removeFavorite} from "store/favorite/actions"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {IconToggle} from "react-native-material-ui";

interface ExternalProps {
    eventId: number
    style?: ViewStyle
}

interface StateProps {
    isFavorite: boolean
}

interface DispatchProps {
    setFavorite: (favorite: boolean) => void
}

type Props = StateProps & DispatchProps & ExternalProps

class FavoriteItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        return this.props.isFavorite !== nextProps.isFavorite
    }

    public render() {
        const {isFavorite, setFavorite} = this.props
        return (
            <IconToggle name="star"
                        size={25}
                        color={isFavorite ? "darkorange" : "#717171"}
                        onPress={() => setFavorite(!isFavorite)}
                        style={{container: {justifyContent: "center"}}}
            />
        )
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    isFavorite: state.favoriteStore.favorites.has(inputProps.eventId)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => (
    {
        setFavorite: (favorite) => {
            if (favorite) {
                dispatch(addFavorite(inputProps.eventId))
            } else {
                dispatch(removeFavorite(inputProps.eventId))
            }
        }
    }
)

const WithData: ComponentClass<ExternalProps> = connect<StateProps, DispatchProps, ExternalProps>(
    mapStateToProps,
    mapDispatchToProps
)(FavoriteItem)

export default WithData

