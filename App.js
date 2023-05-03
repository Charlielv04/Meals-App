import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FridgeScreen } from './Screens/FridgeScreen'
import MealStackScreen from './Screens/Meals/MealStackScreen'
import { MealsSelectorScreen } from './Screens/MealSelectorScreen'
import ShoppingStackScreen from './Screens/Shopping/ShoppingStackScreen'
import IngredientStackScreen from './Screens/Ingredients/IngredientStackScreen'

const Tab = createBottomTabNavigator()


export default class App extends React.Component {
  render(){
    return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Ingredients' component={IngredientStackScreen} />
        <Tab.Screen name='Meals' component={MealStackScreen} />
        <Tab.Screen name='Fridge' component={FridgeScreen} />
        <Tab.Screen name='Shopping' component={ShoppingStackScreen} />
        <Tab.Screen name='MealSelector' component={MealsSelectorScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )}
}

registerRootComponent(App)