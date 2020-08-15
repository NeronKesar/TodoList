import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { windowWidth } from '../utils/dimensions'
import { colors } from '../utils/colors'

export class Task extends PureComponent {

  state = {
    isVisible: false,
    animated: new Animated.Value(0),
    title: '',
    description: '',
    create: false,
    item: undefined
  }

  componentDidMount() {
    this.props.setOpenTask(this.show)
  }

  show = (item) => {
    this.setState(
      {
        isVisible: true,
        create: !item,
        item,
        title: item ? item.title : '',
        description: item ? item.description : '',
      },
      () => {
        Animated.timing(
          this.state.animated,
          {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }
        )
          .start()
      }
    )
  }

  hide = () => {
    Animated.timing(
      this.state.animated,
      {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }
    )
      .start(() => this.setState({ isVisible: false }))
  }

  setTitleInputRef = (ref) => {
    this.titleInputRef = ref
  }

  setDescriptionInputRef = (ref) => {
    this.descriptionInputRef = ref
  }

  getIsConfirmButtonDisabled = () => {
    const { create, title, description, item } = this.state

    return (
      create
        ? !title
        : item && (title === item.title && description === item.description)
    )
  }

  handleChangeTitle = (title) => {
    this.setState({ title })
  }

  handleChangeDescription = (description) => {
    this.setState({ description })
  }

  handleBackdropPress = () => {
    this.titleInputRef.blur()
    this.descriptionInputRef.blur()
  }

  handleDescriptionContainerPress = () => {
    this.descriptionInputRef.focus()
  }

  handleConfirmPress = () => {
    const { create, title, description } = this.state
    const { onCreatePress, onSavePress } = this.props

    if (create) {
      onCreatePress({ title, description })

    } else {
      onSavePress({ title, description })
    }

    this.hide()
  }

  render() {
    if (!this.state.isVisible) {
      return null
    }

    const { animated, title, description, create } = this.state
    const isButtonDisabled = this.getIsConfirmButtonDisabled()
    const fade = {
      opacity: animated.interpolate({
        inputRange: [0, .5],
        outputRange: [0, 1],
      })
    }
    const contentFade = {
      opacity: animated.interpolate({
        inputRange: [.5, 1],
        outputRange: [0, 1],
      })
    }
    const scale = {
      transform: [{ scale: this.state.animated }]
    }

    return (
      <Animated.View style={StyleSheet.flatten([styles.container, fade])}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={this.handleBackdropPress}
          activeOpacity={1}
        >
          <Animated.View
            style={
              StyleSheet.flatten([
                styles.contentContainer,
                contentFade,
                scale,
              ])
            }
          >
            <Text
              style={styles.title}
              allowFontScaling={false}
            >
              Title
            </Text>
            <View style={styles.titleInputContainer}>
              <TextInput
                ref={this.setTitleInputRef}
                style={styles.input}
                placeholder="Type here"
                placeholderTextColor={colors.gray}
                onChangeText={this.handleChangeTitle}
                value={title}
              />
            </View>
            <Text
              style={styles.title}
              allowFontScaling={false}
            >
              Description
              <Text style={styles.optional}>
                {' (optional)'}
              </Text>
            </Text>
            <TouchableOpacity
              style={styles.descriptionInputContainer}
              onPress={this.handleDescriptionContainerPress}
              activeOpacity={1}
            >
              <TextInput
                ref={this.setDescriptionInputRef}
                style={styles.input}
                multiline
                placeholder="Type here"
                placeholderTextColor={colors.gray}
                onChangeText={this.handleChangeDescription}
                value={description}
              />
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={this.hide}
              >
                <Text
                  style={styles.cancelButtonText}
                  allowFontScaling={false}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  isButtonDisabled
                    ? StyleSheet.flatten([
                      styles.confirmButton,
                      styles.buttonDisabled,
                    ]) 
                    : styles.confirmButton
                }
                onPress={this.handleConfirmPress}
                disabled={isButtonDisabled}
              >
                <Text
                  style={styles.confirmButtonText}
                  allowFontScaling={false}
                >
                  {create ? 'Create' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blackTransparent,
    position: 'absolute',
    zIndex: 100,
    ...StyleSheet.absoluteFill,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    width: windowWidth * .8,
    height: windowWidth * .9,
    backgroundColor: colors.white,
    borderRadius: windowWidth * .03,
    padding: windowWidth * .04,
    marginTop: windowWidth * .12,
  },
  title: {
    fontSize: windowWidth * .05,
    color: colors.black,
  },
  titleInputContainer: {
    width: '100%',
    height: windowWidth * .1,
    borderWidth: windowWidth * .0025,
    borderColor: colors.black,
    borderRadius: windowWidth * .02,
    marginTop: windowWidth * .01,
    paddingHorizontal: windowWidth * .02,
    justifyContent: 'center',
    marginBottom: windowWidth * .02,
  },
  input: {
    fontSize: windowWidth * .04,
    color: colors.black,
  },
  optional: {
    fontSize: windowWidth * .035,
    color: colors.gray,
  },
  descriptionInputContainer: {
    width: '100%',
    height: windowWidth * .4,
    borderWidth: windowWidth * .0025,
    borderColor: colors.black,
    borderRadius: windowWidth * .02,
    marginTop: windowWidth * .01,
    paddingVertical: windowWidth * .01,
    paddingHorizontal: windowWidth * .02,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: windowWidth * .06,
  },
  cancelButton: {
    width: windowWidth * .2,
    height: windowWidth * .1,
    borderWidth: windowWidth * .0025,
    borderColor: colors.black,
    borderRadius: windowWidth * .02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: windowWidth * .04,
    color: colors.black,
  },
  confirmButton: {
    width: windowWidth * .2,
    height: windowWidth * .1,
    backgroundColor: colors.blue,
    borderRadius: windowWidth * .02,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: windowWidth * .02,
  },
  confirmButtonText: {
    fontSize: windowWidth * .04,
    fontWeight: 'bold',
    color: colors.white,
  },
  buttonDisabled: {
    opacity: .5,
  },
})
