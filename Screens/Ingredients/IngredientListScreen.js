import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar } from 'react-native';
import * as SQLite from 'expo-sqlite'
import { IngredientList } from '../../Components/IngredientList';

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
      tx.executeSql('CREATE TABLE IF NOT EXISTS ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price TEXT, unit TEXT, calories TEXT, carbs TEXT, proteins TEXT, fats TEXT)')
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

  showIngredients = () => {
    const { ingredients } = this.state;
    return ingredients.map((ingredient, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.title}>{ingredient.name}</Text>
          <Text style={styles.text}>{ingredient.price}€/{ingredient.unit}</Text>
          <Button title='Delete' onPress={() => this.deleteIngredient(ingredient.id)} />
        </View>
      );
    });
  };

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
        <IngredientList ingredients={this.state.ingredients} deleteIngredient={this.deleteIngredient}/>
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
