import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, Linking } from 'react-native'
import * as SQLite from 'expo-sqlite'

export class MealDetailScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            db: SQLite.openDatabase('meals.db'),
            meal: {},
            id: this.props.route.params.id,
            ingredients: []
        }
    }
    componentDidMount(){
        const { db, id } = this.state
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM meals WHERE id = ?', [id],
            (txObj, resultSet) => {
                meal = resultSet.rows._array[0]
                this.setState({meal})
                console.log(this.state.meal)
            },
            (txObj, error) => {
                console.log(error)
            })
        })
        this.getIngredients()
    }
    
    getIngredients = () => {
        const { db, id } = this.state
        db.transaction(tx => {
            tx.executeSql(`
            SELECT ingredients.name, ingredients.unit, meals_ingredients.quantity 
            FROM ingredients 
            JOIN meals_ingredients ON ingredients.id = meals_ingredients.ingredient 
            WHERE meals_ingredients.meal = ?`, [id],
            (txObj, resultSet) => {
                this.setState({ingredients: resultSet.rows._array})
                console.log(this.state.ingredients)
            },
            (txObj, error) => console.log(error))
        })
    }

    createIngredientList = () => {
        const { ingredients } = this.state
        list = ''
        ingredients.forEach((ingredient, index) => {
            if (ingredient.unit === 'kg') {
                list += ` ${ingredient.quantity}kg of ${ingredient.name}`;
            } else {
                list += ` ${ingredient.quantity} portions of ${ingredient.name}`;
            }
            if (index === ingredients.length - 2) {
                list += ' and';
            } else if (index !== ingredients.length - 1) {
                list += ',';
            }
        })
        console.log(list)
        return list
    }

    deleteMeal = () => {
        const { db } = this.state
        const { id } = this.state
        db.transaction(tx => {
            tx.executeSql('DELETE FROM meals WHERE id = ?', [id],
            (txObj, error) => console.log(error))
            tx.executeSql('DELETE FROM meals_ingredients WHERE meal = ?', [id],
            (txObj, error) => console.log(error))
        })
        this.props.navigation.navigate('IngredientListScreen')
    }
    render(){
        return(
            <View>
                <Text style={styles.title}>{this.state.meal.name}</Text>
                <Text style={styles.text}>
                    This meal requires the following ingredients: {this.createIngredientList()} for 
                    the amazing price of {this.state.meal.price}€.
                    Surprisingly it is very nutritive 
                    with {this.state.meal.calories} kcal, {this.state.meal.carbs} g of 
                    carbohydrates, {this.state.meal.proteins} g of proteins, 
                    and {this.state.meal.fats} g of fats per 100 grams. 
                </Text>
                <Button title='Delete' onPress={this.deleteIngredient} />
            </View>
        )
    }    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        margin: 8},
    title: {
        fontWeight: 'bold',
        margin: 3,
        fontSize: 30,
    },
    text: {
        margin: 3,
    },
    link: {
        color: 'blue', 
        textDecorationLine: 'underline'
    }
})