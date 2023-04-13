import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image } from 'react-native'
import { TwoOptionButton } from '../../Components/TwoOptionButton'
import * as SQLite from 'expo-sqlite'
import { IngredientList } from '../../Components/IngredientList'
import StringToFloat from '../../Components/StringToFloat'



export class IngredientInputScreen extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          db: SQLite.openDatabase('meals.db'),
          isLoading: true,
          ingredients: [],
          currentIngredient: undefined,
          currentPrice: '',
          currentUnit: '',
          validIngredient: false,
          currentCalories: '',
          currentCarbs: '',
          currentProteins: '',
          currentFats: '',
          currentLink: '',
          currentShop: '',
        };
      }
    
    componentDidMount() {
        const { db } = this.state;
    
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM ingredients', null,
            (txObj, resultSet) => this.setState({ ingredients: resultSet.rows._array }),
            (txObj, error) => console.log(error)
          );
        });
    
        this.setState({ isLoading: false });
    }

  addIngredient = () => {
    const { db, ingredients, currentIngredient, currentPrice, currentUnit, currentCalories, currentCarbs, currentFats, currentProteins, currentLink, currentShop } = this.state;

    db.transaction(tx => {
      tx.executeSql('INSERT INTO ingredients (name, price, unit, calories, carbs, proteins, fats, shop, link ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [currentIngredient, StringToFloat(currentPrice), currentUnit, StringToFloat(currentCalories), StringToFloat(currentCarbs),  StringToFloat(currentProteins), StringToFloat(currentFats), currentShop, currentLink],
        (txObj, resultSet) => {
          let existingIngredients = [...ingredients];
          existingIngredients.push({ id: resultSet.insertId, 
                name: currentIngredient, 
                price: currentPrice, 
                unit: currentUnit,
                calories: currentCalories,
                carbs: currentCarbs,
                proteins: currentProteins,
                fats: currentFats,
                shop: currentShop,
                link: currentLink,  });
          this.setState({ ingredients: existingIngredients, 
                currentIngredient: undefined, 
                currentPrice: undefined, 
                currentUnit: undefined,
                currentCalories: undefined,
                currentCarbs: undefined,
                currentFats: undefined,
                currentProteins: undefined,
                currentShop: undefined,
                currentLink: undefined, });
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  handleUnitChange = (value) => {
    if (value == 1){
        this.setState({ currentUnit: 'kg' })
    } else if (value == 2){
        this.setState({ currentUnit: 'unit' })
    }
  }
  handleShopChange = (value) => {
    if (value == 1){
        this.setState({ currentShop: 'Auchan' })
    } else if (value == 2){
        this.setState({ currentShop: 'Carrefour' })
    }
  }
  eliminateTable = () => {
    const {db} = this.state
    db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS ingredients')
        tx.executeSql('DROP TABLE IF EXISTS fridge')
        tx.executeSql('DROP TABLE IF EXISTS meals')
        tx.executeSql('DROP TABLE IF EXISTS meals_ingredients')
        },
        (txObj, resultSet) => console.log(1),
        (txObj, error) => console.log(error)
      )
  }
  nutritionalValue = () => {
    if(this.state.currentUnit==='kg'){
      return '100g'
    } else {
      return 'unit'
    }
  }
  render() {
    const { isLoading, currentIngredient, currentPrice, currentUnit, currentCalories, currentCarbs, currentFats, currentProteins, currentShop, currentLink } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text>Loading names...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.row}>
            <TextInput value={currentIngredient} placeholder='ingredient' onChangeText={(text) => this.setState({ currentIngredient: text })} />
            <TextInput value={currentPrice} keyboardType='numeric' placeholder='price' onChangeText={(text) => this.setState({ currentPrice: text })} />
            <TwoOptionButton 
                    option1Text='kg'
                    option2Text='unit'
                    onPress={this.handleUnitChange}/>
        </View>
        <Text>Nutritional Value per {this.nutritionalValue()}</Text>
        <View style={styles.row}>
            <TextInput value={currentCalories} keyboardType='numeric' placeholder='kcal' onChangeText={(text) => this.setState({ currentCalories: text })} />
            <TextInput value={currentCarbs} keyboardType='numeric' placeholder='carbs' onChangeText={(text) => this.setState({ currentCarbs: text })} />
            <TextInput value={currentProteins} keyboardType='numeric' placeholder='proteins' onChangeText={(text) => this.setState({ currentProteins: text })} />
            <TextInput value={currentFats} keyboardType='numeric' placeholder='fats' onChangeText={(text) => this.setState({ currentFats: text })} />
        </View>
        <View style={styles.row}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={currentLink}
              multiline
              editable
              placeholder='link'
              onChangeText={(text) => this.setState({currentLink: text})}
              style={styles.textInput}
            />
          </View>
          <TwoOptionButton
            option1Text='Auchan'
            option2Text='Carrefour'
            onPress={this.handleShopChange}
          />
        </View>
        <Button title="Add Ingredient" onPress={this.addIngredient} />
        <View style = {styles.row}>
            <Text style={styles.title}>{currentIngredient}</Text>
            <Text style={styles.text}>{currentPrice}€/{currentUnit}</Text>
        </View>
        <Button title='eliminate tables' onPress={this.eliminateTable}/>
       </View>
    )}
}

const styles = StyleSheet.create({
    input: {
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      margin: 10,
      borderColor: 'black',
      borderRadius: 10,
    },
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
      
      textInputContainer: {
        flex: 1,
        maxWidth: '50%',
        paddingRight: 10,
      },
      textInput: {
        flex: 1,
        maxHeight: 100,
      },
      title: {
        fontWeight: 'bold',
        margin: 3,
    },
    text: {
        margin: 3,
    },
  })
  