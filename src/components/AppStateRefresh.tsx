import * as React from "react"
import {AppState, AppStateStatus} from "react-native";

interface State {
    appState: string
}

const connectAppState = <TOriginalProps extends {}>(onActive: (props: TOriginalProps) => any) =>
    (Component: (React.ComponentClass<TOriginalProps>
        | React.StatelessComponent<TOriginalProps>)) => {

        return class extends React.Component<TOriginalProps, State> {


            constructor(props: TOriginalProps, context: any) {
                super(props, context);
                this.state = {
                    appState: AppState.currentState
                }
            }

            componentDidMount() {
                AppState.addEventListener('change', this._handleAppStateChange);
            }

            componentWillUnmount() {
                AppState.removeEventListener('change', this._handleAppStateChange);
            }

            _handleAppStateChange = (nextAppState: AppStateStatus) => {
                console.log("Next AppState: " + nextAppState + " current state: " + this.state.appState)
                if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
                    console.log('App has come to the foreground!')
                    onActive(this.props)
                }
                this.setState({appState: nextAppState});
            }

            render(): JSX.Element {

                return <Component {...this.props} />
            }
        };
    }


export default connectAppState

