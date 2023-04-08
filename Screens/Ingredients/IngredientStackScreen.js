import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { IngredientInputScreen } from './IngredientInputScreen'
import { IngredientListScreen } from './IngredientListScreen'

const IngredientStack = createStackNavigator()

export default function IngredientStackScreen(){
  return(
    <IngredientStack.Navigator initialRouteName='IngredientListScreen'>
      <IngredientStack.Screen name='IngredientListScreen' component={IngredientListScreen}/>
      <IngredientStack.Screen name='IngredientInputScreen' component={IngredientInputScreen}/>
    </IngredientStack.Navigator>
  )
}
