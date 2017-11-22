import * as React from "react"
import CrossPlatformIcon from "components/CrossPlatformIcon";
import {TouchableHighlight} from "react-native";
import * as Actions from "store/favorite/actions"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {ComponentClass} from "react";
import {connect} from "react-redux";

interface ExternalProps {
    eventId: number
}

interface StateProps {
    isFavorite: boolean
}

interface DispatchProps {
    setFavorite: (favorite: boolean) => void
}

type Props = StateProps & DispatchProps

class FavoriteItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        return this.props.isFavorite !== nextProps.isFavorite
    }

    public render() {
        const {isFavorite, setFavorite} = this.props
        return (
            <TouchableHighlight
                onPress={() => requestAnimationFrame(() => setFavorite(!isFavorite))}
                style={{borderRadius: 5}}>
                <CrossPlatformIcon
                    name={"star"}
                    size={30}
                    color={isFavorite ? "darkorange" : "#717171"}
                    outline={!isFavorite}/>
            </TouchableHighlight>
        )
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    isFavorite: state.favoriteStore.favorites[inputProps.eventId]
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => (
    {
        setFavorite: (favorite) => {
            if (favorite) {
                dispatch(Actions.addFavorite(inputProps.eventId))
            } else {
                dispatch(Actions.removeFavorite(inputProps.eventId))
            }
        }
    }
)

const WithData: ComponentClass<ExternalProps> = connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(FavoriteItem)

export default WithData

