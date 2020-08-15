import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native'
import { windowWidth } from '../utils/dimensions'
import { colors } from '../utils/colors'

export class AddButton extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={.7}
          onPress={this.props.onPress}
        >
          <Text
            style={styles.buttonTitle}
            allowFontScaling={false}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth * .2,
    height: windowWidth * .2,
    borderRadius: windowWidth * .1,
    position: 'absolute',
    bottom: windowWidth * .05,
    right: windowWidth * .05,
    zIndex: 10,
    backgroundColor: colors.white,
    ...Platform.OS === 'ios'
      ? {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: windowWidth * .005,
        },
        shadowRadius: windowWidth * .015,
        shadowOpacity: .5,
      }
      : { elevation: 6 }
  },
  button: {
    width: windowWidth * .2,
    height: windowWidth * .2,
    borderRadius: windowWidth * .1,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: windowWidth * .1,
    color: colors.white,
    marginBottom: windowWidth * .01,
    marginLeft: windowWidth * .005,
  },
})
