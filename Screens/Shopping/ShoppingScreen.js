import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, ScrollView } from 'react-native'
import * as SQLite from 'expo-sqlite'
import StringToFloat from '../../Components/StringToFloat'



export class ShoppingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: SQLite.openDatabase('meals.db'),
      isLoading: true,
      shoppingList: [],
    };
  }

  componentDidMount() {
    const { db } = this.state;

    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS shopping (id INTEGER PRIMARY KEY AUTOINCREMENT, quantity FLOAT, meal_id INTEGER, 
          FOREIGN KEY(meal_id) REFERENCES meals(id))`
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO shopping (quantity, meal_id) SELECT 0, m.id FROM meals m WHERE NOT EXISTS (SELECT * FROM shopping s WHERE s.meal_id = m.id)',
        null,
        (txObj, error) => console.log(error)
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT s.id, m.name, s.quantity FROM meals m INNER JOIN shopping s ON m.id = s.meal_id',
        null,
        (txObj, resultSet) => {
          const newShoppingList = resultSet.rows._array;
          const shoppingList = newShoppingList.map((meal) => ({ ...meal, qtext: '' }));
          this.setState({ shoppingList });
        },
        (txObj, error) => console.log(error)
      );
    });

    this.setState({ isLoading: false });
  }

  handleQuantityChange = (index, qtext) => {
    const { shoppingList } = this.state;
    const newShoppingList = [...shoppingList];
    if (qtext === '') {
      newShoppingList[index].quantity = 0;
      newShoppingList[index].qtext = '';
    } else {
      newShoppingList[index].quantity = StringToFloat(qtext);
      newShoppingList[index].qtext = qtext;
    }
    this.setState({ shoppingList: newShoppingList }, () => {
      const { db } = this.state;
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE shopping SET quantity=? WHERE id = ?',
          [newShoppingList[index].quantity, newShoppingList[index].id],
          (txObj, resultSet) => console.log('Quantity updated for ' + newShoppingList[index].name),
          (txObj, error) =>
            console.log('Error updating quantity for ' + newShoppingList[index].name + ': ' + error)
        );
      });
    });
  };

  showShoppingList = () => {
    return (
      <ScrollView>
        <View>
          {this.state.shoppingList.map((meal, index) => {
            return (
              <View key={index} style={styles.row}>
                <Text>{meal.name}</Text>
                <TextInput
                  value={meal.qtext}
                  placeholder='0'
                  keyboardType='numeric'
                  onChangeText={(text) => this.handleQuantityChange(index, text)}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  render() {
    return <View>{this.showShoppingList()}</View>;
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