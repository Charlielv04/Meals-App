import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image, ScrollView } from 'react-native'
import * as SQLite from 'expo-sqlite'
import StringToFloat from '../Components/StringToFloat'



export class FridgeScreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            db: SQLite.openDatabase('meals.db'),
            isLoading: true, 
            fridge: [],
        }
    }
    componentDidMount(){
        const { db } = this.state;

        db.transaction(tx => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS fridge (id INTEGER PRIMARY KEY AUTOINCREMENT, quantity FLOAT, ingredient_id INTEGER, 
                FOREIGN KEY(ingredient_id) REFERENCES ingredients(id))`)
        })
        db.transaction(tx => {
            tx.executeSql('INSERT INTO fridge (quantity, ingredient_id) SELECT 0, i.id FROM ingredients i WHERE NOT EXISTS (SELECT * FROM fridge f WHERE f.ingredient_id = i.id)', null,
            (txObj, error) => console.log(error))
        })
        db.transaction(tx => {
          tx.executeSql(
            'SELECT f.id, i.name, f.quantity FROM ingredients i INNER JOIN fridge f ON i.id = f.ingredient_id',
            null,
            (txObj, resultSet) => {
              newFridge = resultSet.rows._array
              fridge = newFridge.map((ingredient) => {
                if (ingredient.quantity === 0){
                  return { ...ingredient, qtext: '' }
                } else {
                  return { ...ingredient, qtext: ingredient.quantity.toString()}
                }
              })
              this.setState({ fridge })
            },
            (txObj, error) => console.log(error)
          )
        })
        
        this.setState({ isLoading: false })  
    }
    handleQuantityChange = (index, qtext) => {
        const { fridge } = this.state
        const newFridge = [...fridge]
        if (qtext === '') {
          newFridge[index].quantity = 0
          newFridge[index].qtext = ''
        } else {
          newFridge[index].quantity = StringToFloat(qtext);
          newFridge[index].qtext = qtext
        }
        this.setState({ fridge: newFridge })
        const { db } = this.state;
        db.transaction((tx) => {
        tx.executeSql('UPDATE fridge SET quantity=? WHERE id = ?', [newFridge[index].quantity, newFridge[index].id],
          (txObj, resultSet) => console.log('Quantity updated for ' + newFridge[index].name),
          (txObj, error) => console.log('Error updating quantity for ' + newFridge[index].name + ': ' + error))
        })
    }
    checkDatabase = () => {
      const { db } = this.state
      db.transaction(tx => {
        tx.executeSql('SELECT i.name, f.quantity FROM fridge f INNER JOIN ingredients i ON i.id=f.ingredient_id', [],
        (txObj, resultSet) => console.log(resultSet.rows._array),
        (txObj, error) => console.log(error))
      })
      console.log(this.state.fridge)
    }

    showFridge = () => {
        return (
          <ScrollView>
          <View>
            {this.state.fridge.map((ingredient, index) => {
              return (
                <View key={index} style={styles.row}>
                  <Text>{ingredient.name}</Text>
                  <TextInput
                    value={ingredient.qtext}
                    placeholder='0'
                    keyboardType='numeric'
                    onChangeText={(text) =>
                      this.handleQuantityChange(index, text)
                    }
                  />
                </View>
              )
            })}
          </View>
          </ScrollView>
        );
      };

    render(){
        return(
            <View>
                {this.showFridge()}
                <Button onPress={this.checkDatabase} title='check databse'/>
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