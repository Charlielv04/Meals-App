import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image } from 'react-native'

export class MealsScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            db: SQLite.openDatabase('meals.db'),
            isLoading: true, 
            meals: [],
        }
    }
    componentDidMount(){
        const { db } = this.state;

        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price TEXT, calories TEXT, carbs TEXT, proteins TEXT, fats TEXT)')
        });
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS meals_ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, meal FOREIGN KEY REFERENCES meals.id, ingredient FOREIGN KEY REFERENCES ingredients.id, quantity FLOAT, q_text TEXT)', null,
            (txObj, error) => console.log(error))
        })
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM meals', null,
            (txObj, resultSet) => this.setState({ fridge: resultSet.rows._array }),
            (txObj, error) => console.log(error))
        })
        this.setState({ isLoading: false })  
    }
    
    render(){
        return(
            <View>
                <Text>Hello this is your Meals</Text>
            </View>
        )
    }
}