import React from 'react'
import { Platform } from 'react-native'
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import AuthLoadingScreen from './components/screens/AuthLoadingScreen/AuthLoadingScreen';

import WelcomeScreen from './components/screens/AuthScreen/WelcomeScreen';
import SignUpScreen from './components/screens/AuthScreen/SignUpScreen';

import HomeScreen from './components/screens/AppStackScreen/BottomTapScreen/HomeScreen';
import RecordScreen from './components/screens/AppStackScreen/BottomTapScreen/RecordScreen';
import MediaScreen from './components/screens/AppStackScreen/BottomTapScreen/MediaScreen';
import SettingScreen from './components/screens/AppStackScreen/BottomTapScreen/SettingScreen';

import AddRecordScreen from './components/screens/AppStackScreen/AddRecordScreen';
import FoodTypeScreen from './components/screens/AppStackScreen/FoodTypeScreen';
import FoodScreen from './components/screens/AppStackScreen/FoodScreen';
import AddRecordWeightScreen from './components/screens/AppStackScreen/AddRecordWeightScreen';
import RecordDetailScreen from './components/screens/AppStackScreen/RecordDetailScreen';
import EditProfileScreen from './components/screens/AppStackScreen/EditProfileScreen';

const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
}, {
  headerMode: 'none'
})

HomeStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }

  return {
    tabBarVisible
  }
}

const RecordStackNavigator = createStackNavigator({
  Record: {
    screen: RecordScreen
  }
}, {
  headerMode: 'none'
})

RecordStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }

  return {
    tabBarVisible
  }
}

const AppTabNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeStackNavigator,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name='ios-pulse' style={{ color: tintColor }} size={30} />
      ),
      title: 'หน้าแรก'
    }
  },
  Record: {
    screen: RecordStackNavigator,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name='ios-bookmarks' style={{ color: tintColor }} size={30} />
      ),
      title: 'จดบันทึก'
    }
  },
  Media: {
    screen: MediaScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name='ios-film' style={{ color: tintColor }} size={30} />
      ),
      title: 'มัลติมีเดีย'
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name='ios-menu' style={{ color: tintColor }} size={30} />
      ),
      title: 'ตั้งค่า'
    }
  }
}, {
  initialRouteName: 'Home',
  animationEnabled: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    style: {
      ...Platform.select({
        android: {
          backgroundColor: 'white'
        }
      })
    },
    activeTintColor: '#000',
    inactiveTintColor: '#d1cece',
    showLabel: false,
    showIcon: true
  }
})

const AppStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: AppTabNavigator,
    navigationOptions: ({ navigation }) => ({
      title: 'คุณแม่'
    })
  },
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: {
      title: 'แก้ไขข้อมูลส่วนตัว',
      mode: 'modal',
      headerMode: 'none'
    }
  },
  RecordWeight: {
    screen: AddRecordWeightScreen,
    navigationOptions: {
      title: 'บันทึกน้ำหนักประจำสัปดาห์',
    }
  },
  AddRecord: {
    screen: AddRecordScreen,
    navigationOptions: {
      title: 'สร้างรายการบันทึก'
    }
  },
  RecordDetail: {
    screen: RecordDetailScreen,
    navigationOptions: {
      title: 'รายละเอียด'
    }
  },
  FoodType: {
    screen: FoodTypeScreen,
    navigationOptions: {
      title: 'เลือกประเภทอาหาร'
    }
  },
  Food: {
    screen: FoodScreen,
    navigationOptions: {
      title: 'เลือกอาหาร'
    }
  }
}, {
  navigationOptions: {
    headerBackTitleStyle: {
      color: '#272C3599'
    },
    headerBackTitle: null,
    headerTintColor: '#272C35'
  }
})

const AuthStackNavigator = createStackNavigator({
  Welcome: WelcomeScreen,
  SignUp: SignUpScreen
}, {
  mode: 'modal',
  headerMode: 'none'
})

export default createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppStackNavigator
})