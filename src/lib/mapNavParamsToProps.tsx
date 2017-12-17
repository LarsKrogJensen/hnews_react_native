import * as React from "react"

export const mapNavParamsToProps = (WrapperComponent) => props => {
    const {navigation: {state: {params}}} = props;
    const {screenProps, ...propsExceptScreenProps} = props;

    return <WrapperComponent {...screenProps} {...propsExceptScreenProps} {...params}/>;
}
