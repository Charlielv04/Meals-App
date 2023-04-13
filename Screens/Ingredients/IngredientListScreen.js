import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar } from 'react-native';
import * as SQLite from 'expo-sqlite'
import { IngredientList } from '../../Components/IngredientList';
import StringToFloat from '../../Components/StringToFloat';

export class IngredientListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: SQLite.openDatabase('meals.db'),
      isLoading: true,
      ingredients: [],
      currentIngredient: undefined,
    };
  }
  componentDidUpdate() {
      const { db } = this.state;
      db.transaction(tx => {
      tx.executeSql('SELECT * FROM ingredients', null,
        (txObj, resultSet) => this.setState({ ingredients: resultSet.rows._array }),
        (txObj, error) => console.log(error)
      );
    })
  }
  componentDidMount() {
    const { db } = this.state;

    db.transaction(tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price FLOAT, unit TEXT, 
        calories FLOAT, carbs FLOAT, proteins FLOAT, fats FLOAT, link TEXT, shop TEXT)`)
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ingredients', null,
        (txObj, resultSet) => this.setState({ ingredients: resultSet.rows._array }),
        (txObj, error) => console.log(error)
      );
    });

    this.setState({ isLoading: false });
  }

  deleteIngredient = (id) => {
    const { db, ingredients } = this.state;
    db.transaction(tx => {
      tx.executeSql('DELETE FROM ingredients WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingIngredients = [...ingredients].filter(ingredient => ingredient.id !== id);
            this.setState({ ingredients: existingIngredients });
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  ingredientDetails = (id) => {
    this.props.navigation.navigate('IngredientDetailScreen', {id: id})
  }

  addIngredientScreen = () => {
    this.props.navigation.navigate('IngredientInputScreen')
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
        <Button title="Add Ingredient" onPress={this.addIngredientScreen} />
        <IngredientList ingredients={this.state.ingredients} deleteIngredient={this.deleteIngredient} ingredientDetails={this.ingredientDetails}/>
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
