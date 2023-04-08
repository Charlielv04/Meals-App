import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, FlatList } from 'react-native'
import { IngredientList } from '../Components/IngredientList'
import { openDatabase } from 'react-native-sqlite-storage'
import { getDBConnection, getIngredients } from '../Databases/db-manager'
import { createNativeStackNavigator } from '@react-navigation/stack'
import { IngredientsListScreen } from'./Ingredients/IngredientListScreen'
import { IngredientsInputScreen } from './Ingredients/IngredientInputScreen'
import { NavigationContainer } from '@react-navigation/native'

export class IngredientsScreen extends React.Component{
    state = {
        Ingredients: [
        {
            id: 1,
            name: 'Celery',
            price: 14,
            unit: 'kg',
        },
        {
            id: 3,
            name: 'Cheese',
            price: 35,
            unit: 'unit'
        }
    ],
    }
    getIngredients(){
        const db = getDBConnection()
        const Ingredients = getIngredients(db)
        this.setState()({
            Ingredients: Ingredients,
        })
    }
    render(){
        return(
            null
        )
    }
}