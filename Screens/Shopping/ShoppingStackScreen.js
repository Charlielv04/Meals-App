import 'react-native-gesture-handler'
import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ShoppingListScreen } from './ShoppingListScreen'
import { ShoppingScreen } from './ShoppingScreen'

const ShoppingStack = createStackNavigator()

export default function ShoppingStackScreen(){
  return(
    <ShoppingStack.Navigator initialRouteName='ShoppingScreen'>
        <ShoppingStack.Screen name='ShoppingScreen' component={ShoppingScreen}/>
        <ShoppingStack.Screen name='ShoppingListScreen' component={ShoppingListScreen}/>
    </ShoppingStack.Navigator>
  )
}