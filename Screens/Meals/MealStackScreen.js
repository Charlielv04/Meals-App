import 'react-native-gesture-handler'
import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { MealInputScreen } from './MealInputScreen'
import { MealListScreen } from './MealListScreen'
import { MealDetailScreen } from './MealDetailScreen'

const MealStack = createStackNavigator()

export default function MealStackScreen(){
  return(
    <MealStack.Navigator initialRouteName='MealListScreen'>
      <MealStack.Screen name='MealListScreen' component={MealListScreen}/>
      <MealStack.Screen name='MealInputScreen' component={MealInputScreen}/>
      <MealStack.Screen name='MealDetailScreen' component={MealDetailScreen}/>
    </MealStack.Navigator>
  )
}
