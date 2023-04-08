import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image } from 'react-native'
import { Ingredient } from '../Components/Ingredient'
import * as SQLite from 'expo-sqlite'


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
            tx.executeSql('CREATE TABLE IF NOT EXISTS fridge (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, quantity FLOAT, qtext TEXT)')
        });
        db.transaction(tx => {
            tx.executeSql('INSERT INTO fridge (name, quantity, qtext) SELECT i.name, 0.0, 0 FROM ingredients i WHERE NOT EXISTS (SELECT * FROM fridge f WHERE f.name = i.name)', null,
            (txObj, error) => console.log(error))
        })
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM fridge', null,
            (txObj, resultSet) => this.setState({ fridge: resultSet.rows._array }),
            (txObj, error) => console.log(error))
        })
        this.setState({ isLoading: false })  
    }
    
    componentWillUnmount() {
        const { db, fridge } = this.state;
        db.transaction(tx => {
          fridge.forEach(ingredient => {
            tx.executeSql('UPDATE fridge SET quantity=?, qtext=? WHERE name=?', [ingredient.quantity, ingredient.qtext, ingredient.name],
              (txObj, resultSet) => console.log('Quantity updated for ' + ingredient.name),
              (txObj, error) => console.log('Error updating quantity for ' + ingredient.name + ': ' + error));
          })
        })
    }

    handleQuantityChange = (index, qtext) => {
        const { fridge } = this.state
        const newFridge = [...fridge]
        if (qtext === '') {
          newFridge[index].quantity = 0
          newFridge[index].qtext = ''
        } else {
          newFridge[index].quantity = parseFloat(qtext);
          newFridge[index].qtext = qtext
        }
        this.setState({ fridge: newFridge }, () => {
          const { db } = this.state;
          db.transaction(tx => {
            tx.executeSql('UPDATE fridge SET quantity=?, qtext=? WHERE name=?', [newFridge[index].quantity, newFridge[index].qtext, newFridge[index].name],
              (txObj, resultSet) => console.log('Quantity updated for ' + newFridge[index].name),
              (txObj, error) => console.log('Error updating quantity for ' + newFridge[index].name + ': ' + error));
          });
        });
    };

    showFridge = () => {
        return (
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
              );
            })}
          </View>
        );
      };

    render(){
        return(
            <View>
                {this.showFridge()}
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