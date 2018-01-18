import * as React from "react"
import {Dimensions} from "react-native";
import {orientation, Orientation} from "lib/device";

export interface OrientationProps {
    orientation: Orientation
}

interface State {
    orientation: Orientation
}

export const withOrientationChange =
    <TOriginalProps extends {}>(Component: (React.ComponentClass<TOriginalProps> | React.StatelessComponent<TOriginalProps>)) => {
        return class extends React.Component<TOriginalProps, State> {
            state = {
                orientation: orientation()
            }

            componentDidMount() {
                Dimensions.addEventListener('change', this._handleOrientationChange);
            }

            componentWillUnmount() {
                Dimensions.removeEventListener('change', this._handleOrientationChange);
            }

            _handleOrientationChange = () => {
                const newOrientation = orientation()

                if (this.state.orientation !== newOrientation) {
                    console.log("Orientation change to: " + newOrientation)
                    this.setState({orientation: newOrientation});
                }
            }

            render(): JSX.Element {
                return <Component {...this.props} {...this.state}/>
            }
        };
    }

