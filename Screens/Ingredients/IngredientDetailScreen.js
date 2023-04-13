import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, Linking } from 'react-native'
import * as SQLite from 'expo-sqlite'

export class IngredientDetailScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            db: SQLite.openDatabase('meals.db'),
            ingredient: {},
            id: this.props.route.params.id
            
        }
    }
    componentDidMount(){
        const { db, id} = this.state
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM ingredients WHERE id = ?', [id],
            (txObj, resultSet) => {
                ingredient  = resultSet.rows._array[0]
                this.setState({ingredient})

            },
            (txObj, error) => {
                console.log(error)
            })
        })
    }
    deleteIngredient = () => {
        const { db } = this.state
        const { id } = this.state
        db.transaction(tx => {
            tx.executeSql('DELETE FROM ingredients WHERE id = ?', [id]),
            (txObj, error) => console.log(error)
        })
        this.props.navigation.navigate('IngredientListScreen')
    }
    render(){
        return(
            <View>
                <Text style={styles.title}>{this.state.ingredient.name}</Text>
                <Text style={styles.text}>
                    This product is available at <Text onPress={() => Linking.openURL(this.state.ingredient.link)} style={styles.link}>{this.state.ingredient.shop}</Text> for the amazing price 
                    of {this.state.ingredient.price}€/{this.state.ingredient.unit}.
                    Surprisingly it is very nutritive 
                    with {this.state.ingredient.calories} kcal, {this.state.ingredient.carbs} g of 
                    carbohydrates, {this.state.ingredient.proteins} g of proteins, 
                    and {this.state.ingredient.fats} g of fats per 100 grams. 
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