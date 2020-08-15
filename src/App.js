import React, { PureComponent } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native'
import { windowWidth } from './utils/dimensions'
import { colors } from './utils/colors'
import { Storage } from './utils/storage'
import { AddButton } from './components/AddButton'
import { TaskItem } from './components/TaskItem'
import { Task } from './components/Task'

export class App extends PureComponent {

  state = {
    tasks: [],
    currentTask: -1,
    isAddButtonVisible: true,
  }

  async componentDidMount() {
    this.setState({ tasks: await Storage.getData() || [] })
  }

  setOpenTask = (openTask) => {
    this.openTask = openTask
  }

  handleAddTask = () => {
    this.setState(
      { isAddButtonVisible: false },
      () => {
        this.openTask()
      }
    )
  }

  handleItemPress(item, currentTask) {
    this.setState(
      {
        currentTask,
        isAddButtonVisible: false,
      },
      () => {
        this.openTask(item)
      }
    )
  }

  handleCreatePress = async (item) => {
    const tasks = [...this.state.tasks]

    tasks.push(item)

    await Storage.setData(tasks)

    this.setState({ tasks })
  }

  handleSavePress = async (item) => {
    const tasks = [...this.state.tasks]

    tasks[this.state.currentTask] = item

    await Storage.setData(tasks)

    this.setState({ tasks })
  }

  handleClose = () => {
    this.setState({ isAddButtonVisible: true })
  }

  async handleRemoveItemPress(index) {
    const tasks = [...this.state.tasks]

    tasks.splice(index, 1)

    await Storage.setData(tasks)

    this.setState({ tasks })
  }

  keyExtractor = (item) => `${Math.random()}${item.title}`

  renderItem = ({ item, index }) => (
    <TaskItem
      item={item}
      onPress={this.handleItemPress.bind(this, item, index)}
      onRemovePress={this.handleRemoveItemPress.bind(this, index)}
    />
  )

  renderEmptyComponent = () => (
    <View style={styles.emptyComponent}>
      <Text
        style={styles.noTasks}
        allowFontScaling={false}
      >
        No tasks
      </Text>
    </View>
  )

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={styles.title}
          allowFontScaling={false}
        >
          To Do
        </Text>
        <Task
          setOpenTask={this.setOpenTask}
          onCreatePress={this.handleCreatePress}
          onSavePress={this.handleSavePress}
          onClose={this.handleClose}
        />
        {this.state.isAddButtonVisible ? <AddButton onPress={this.handleAddTask} /> : null}
        <FlatList
          data={this.state.tasks}
          contentContainerStyle={styles.list}
          bounces={false}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmptyComponent}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: windowWidth * .08,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: windowWidth * .02,
  },
  list: {
    flexGrow: 1,
  },
  emptyComponent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTasks: {
    fontSize: windowWidth * .04,
    color: colors.gray,
  },
})
