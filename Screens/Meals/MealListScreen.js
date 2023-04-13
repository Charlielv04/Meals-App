import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar } from 'react-native';
import * as SQLite from 'expo-sqlite'
import { MealList } from '../../Components/MealList';

export class MealListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: SQLite.openDatabase('meals.db'),
      isLoading: true,
      meals: [],
    };
  }
  componentDidUpdate() {
      const { db } = this.state;
      db.transaction(tx => {
      tx.executeSql('SELECT * FROM meals', null,
        (txObj, resultSet) => this.setState({ meals: resultSet.rows._array }),
        (txObj, error) => console.log(error)
      );
    })
  }
  componentDidMount(){
    const { db } = this.state;

    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price FLOAT, calories FLOAT, carbs FLOAT, proteins FLOAT, fats FLOAT)')
    });
    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS meals_ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, meal INTEGER, ingredient INTEGER, quantity FLOAT, FOREIGN KEY(meal) REFERENCES meals(id), FOREIGN KEY(ingredient) REFERENCES ingredients(id))')
    })
    db.transaction(tx => {
        tx.executeSql('SELECT * FROM meals', null,
        (txObj, resultSet) => this.setState({ meals: resultSet.rows._array }),
        (txObj, error) => console.log(error))
    })
    this.setState({ isLoading: false })  
  }


  mealDetails = (id) => {
    this.props.navigation.navigate('MealDetailScreen', {id: id})
  }

  addMealScreen = () => {
    this.props.navigation.navigate('MealInputScreen')
  }

  render() {
    const { isLoading, currentIngredient } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text>Loading ingredients...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Button title="Add Meal" onPress={this.addMealScreen} />
        <MealList meals={this.state.meals}  mealDetails={this.mealDetails}/>
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
