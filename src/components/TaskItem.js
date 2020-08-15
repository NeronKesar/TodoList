import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
} from 'react-native'
import { windowWidth } from '../utils/dimensions'
import { colors } from '../utils/colors'

export class TaskItem extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      animated: new Animated.ValueXY(),
      closed: true,
    }

    this.activeArea = Math.round(windowWidth * .25)

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => gestureState.dx < -2 || gestureState.dx > 2,
      onPanResponderGrant: () => {
        this.state.animated.setOffset(this.state.animated.__getValue())
        this.state.animated.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: Animated.event([null, { dx: this.state.animated.x }], { useNativeDriver: false }),
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (_, gestureState) => {
        this.state.animated.flattenOffset()
        this.state.animated.setValue(this.state.animated.__getValue())
        this.state.animated.setOffset({ x: 0, y: 0 })

        if (gestureState.dx < -(this.activeArea * .15)) {
          this.moveLeft()

        } else if (gestureState.dx > (this.activeArea * .15)) {
          this.moveRight()

        } else if (this.state.closed) {
          this.moveRight()

        } else if (!this.state.closed) {
          this.moveLeft()
        }
      },
    })
  }

  moveLeft = () => {
    Animated.spring(
      this.state.animated,
      {
        toValue: { x: -this.activeArea, y: 0 },
        useNativeDriver: false,
      }
    )
      .start(() => this.setState({ closed: false }))
  }

  moveRight = () => {
    Animated.spring(
      this.state.animated,
      {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }
    )
      .start(() => this.setState({ closed: true }))
  }

  handleButtonPress = () => {
    if (!this.state.closed) {
      this.moveRight()

    } else {
      this.props.onPress()
    }
  }

  render() {
    const { item: { title }, onRemovePress } = this.props

    const animatedStyle = {
      left: this.state.animated.x.interpolate({
        inputRange: [-this.activeArea, 0],
        outputRange: [-this.activeArea, 0],
        extrapolate: 'clamp',
      })
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemovePress}
        >
          <Text
            style={styles.removeButtonTitle}
            allowFontScaling={false}
          >
            Remove
          </Text>
        </TouchableOpacity>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={StyleSheet.flatten([animatedStyle, styles.swipeButton])}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleButtonPress}
          >
            <Text
              style={styles.title}
              allowFontScaling={false}
              numberOfLines={2}
            >
              {title}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowWidth * .15,
    backgroundColor: colors.red,
    zIndex: -1,
    alignItems: 'flex-end',
  },
  swipeButton: {
    width: windowWidth,
    height: windowWidth * .15,
    position: 'absolute',
    top: 0,
    backgroundColor: colors.white,
    borderTopWidth: windowWidth * .0025,
    borderBottomWidth: windowWidth * .0025,
    borderColor: colors.black,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: windowWidth * .04,
  },
  title: {
    fontSize: windowWidth * .04,
    color: colors.black,
  },
  removeButton: {
    width: windowWidth * .25,
    height: windowWidth * .15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonTitle: {
    fontSize: windowWidth * .04,
    fontWeight: 'bold',
    color: colors.white,
  },
})
