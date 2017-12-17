// import * as React from "react"
//
// export function mapNavPropsToProps(WrappedComponent: React.Component) {
//   const TargetComponent = props => {
//     const { navigation: { state: { params } } } = props;
//     const { screenProps, ...propsExceptScreenProps } = props;
//
//       return <WrappedComponent {...screenProps} {...propsExceptScreenProps} {...params} />;
//   };
//
//   return TargetComponent
// }