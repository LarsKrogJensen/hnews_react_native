import * as React from "react"
import Touchable from "components/Touchable";
import CrossPlatformIcon from "components/CrossPlatformIcon";

interface Props {
    isFavorite: boolean,
    toggle: () => void
}

export default class FavoriteItem extends React.Component<Props> {
    
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        return this.props.isFavorite !== nextProps.isFavorite
    }

    public render() {
        const {isFavorite, toggle} = this.props
        // console.log("render favitem: " + this.props.isFavorite)
        return (
            <Touchable
                onPress={() => requestAnimationFrame(toggle)}
                style={{borderRadius: 5}}>
                <CrossPlatformIcon
                    name={"star"}
                    size={30}
                    color={isFavorite ? "darkorange" : "#717171"}
                    outline={!isFavorite}/>
            </Touchable>
        )
    }
}

