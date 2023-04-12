import React from 'react'
import { FlatList, Text, View, StyleSheet, Button, ScrollView, Dimensions  } from 'react-native'
import { Meal } from './Meal'

export class MealList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      meals: this.props.meals
    }
  }

  render() {
    const screenHeight = Dimensions.get('window').height
    const ligthHeight = screenHeight * 0.3
    return (
      <ScrollView style={{ height:  ligthHeight}}>
        {this.props.meals.map((meal, index) => {
          return (
            <Meal
              key={index}
              index={index}
              meal={meal}
              mealDetails={this.props.mealDetails}
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