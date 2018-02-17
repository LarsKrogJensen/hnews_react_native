import * as React from "react"
import {Orientation} from "lib/device";
import {pushSubscribe, pushUnsubscribe} from "store/push/push-hub";

export interface OrientationProps {
    orientation: Orientation
}

interface State {
    orientation: Orientation
}

export const withPush =
    <TOriginalProps extends {}>(Component: (React.ComponentClass<TOriginalProps> | React.StatelessComponent<TOriginalProps>), topics: (props: TOriginalProps) => string[]) => {
        return class extends React.Component<TOriginalProps, State> {

            componentDidMount() {
                topics(this.props).forEach(pushSubscribe)
            }

            componentWillUnmount() {
                topics(this.props).forEach(pushUnsubscribe)
            }

            render(): JSX.Element {
                return <Component {...this.props}/>
            }
        };
    }

