import PropTypes from 'prop-types';
import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';

const Card = (props: any) => {

  const { children, elevation, opacity, cornerRadius, backgroundColor } = props;

  const cardStyle = Platform.select({
    ios: () =>
      StyleSheet.create({
        container: {
          shadowRadius:elevation,
          shadowOpacity:opacity,
          shadowOffset:{ width: 0, height: elevation },
          borderRadius:cornerRadius,
          backgroundColor: backgroundColor,
          // width: Dimensions.get('window').width - 40, //todo: fix offset
        }
      }),
    //@ts-ignore
    android: () =>
      StyleSheet.create({
        container: {
          elevation:elevation,
          borderRadius:cornerRadius,
          backgroundColor: props.backgroundColor,
          width: Dimensions.get('window').width - 40,
        }
      })
  })();

  return(
    <View style={[cardStyle.container, props.style]}>
      {children}
    </View>
  )

}

Card.prototype = {
  backgroundColor: PropTypes.string,
  elevation: PropTypes.number,
  cornerRadius: PropTypes.number,
  opacity: PropTypes.number
}

Card.defaultProps = {
  backgroundColor: '#ffffff',
  elevation: 3,
  cornerRadius: 5,
  opacity: .5
}

export default Card