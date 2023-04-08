import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FridgeScreen } from './Screens/FridgeScreen'
import { MealsScreen } from './Screens/MealsScreen'
import { MealsSelectorScreen } from './Screens/MealSelectorScreen'
import { ShoppingScreen } from './Screens/ShoppingScreen'
import Test2Screen from './Test2Screen'
import IngredientStackScreen from './Screens/Ingredients/IngredientStackScreen'

const Tab = createBottomTabNavigator()


export default class App extends React.Component {
  render(){
    return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Ingredients' component={IngredientStackScreen} />
        <Tab.Screen name='Meals' component={MealsScreen} />
        <Tab.Screen name='Fridge' component={FridgeScreen} />
        <Tab.Screen name='Shopping' component={ShoppingScreen} />
        <Tab.Screen name='MealSelector' component={MealsSelectorScreen} />
        <Tab.Screen name='Test' component={Test2Screen} />
      </Tab.Navigator>
    </NavigationContainer>
  )}
}

registerRootComponent(App)