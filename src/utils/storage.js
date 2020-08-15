import { AsyncStorage } from 'react-native'

export class Storage {
  static async setData(data) {
    await AsyncStorage.setItem('data', JSON.stringify(data))
  }

  static async getData() {
    return JSON.parse(await AsyncStorage.getItem('data'))
  }
}
