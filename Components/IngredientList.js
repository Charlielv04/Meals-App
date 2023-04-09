import React from 'react'
import { FlatList, Text, View, StyleSheet, Button, ScrollView, Dimensions  } from 'react-native'
import { Ingredient } from './Ingredient'

export class IngredientList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredients: this.props.ingredients
    }
  }

  render() {
    const screenHeight = Dimensions.get('window').height
    const ligthHeight = screenHeight * 0.3
    return (
      <ScrollView style={{ height:  ligthHeight}}>
        {this.props.ingredients.map((ingredient, index) => {
          return (
            <Ingredient
              key={index}
              index={index}
              ingredient={ingredient}
              deleteIngredient={this.props.deleteIngredient}
              ingredientDetails={this.props.ingredientDetails}
            />
          )
        })}
      </ScrollView>
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
      margin: 8
    },
    title: {
      fontWeight: 'bold',
      margin: 3,
    },
    text: {
      margin: 3,
    },
  });