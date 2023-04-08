import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Image } from 'react-native'
import { Ingredient } from '../../Components/Ingredient'
import { TwoOptionButton } from '../../Components/TwoOptionButton'
import { getDBConnection, addIngredient } from '../../Databases/db-manager'
import * as SQLite from 'expo-sqlite'
import { IngredientList } from '../../Components/IngredientList'



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
        };
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

  addIngredient = () => {
    const { db, ingredients, currentIngredient, currentPrice, currentUnit, currentCalories, currentCarbs, currentFats, currentProteins } = this.state;
    db.transaction(tx => {
      tx.executeSql('INSERT INTO ingredients (name, price, unit, calories, carbs, proteins, fats ) values (?, ?, ?, ?, ?, ?, ?)', [currentIngredient, currentPrice, currentUnit, currentCalories, currentCarbs,  currentProteins, currentFats],
        (txObj, resultSet) => {
          let existingIngredients = [...ingredients];
          existingIngredients.push({ id: resultSet.insertId, 
                name: currentIngredient, 
                price: currentPrice, 
                unit: currentUnit,
                calories: currentCalories,
                carbs: currentCarbs,
                proteins: currentProteins,
                fats: currentFats  });
          this.setState({ ingredients: existingIngredients, 
                currentIngredient: undefined, 
                currentPrice: undefined, 
                currentUnit: undefined,
                currentCalories: undefined,
                currentCarbs: undefined,
                currentFats: undefined,
                currentProteins: undefined });
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
  eliminateTable = () => {
    const {db} = this.state
    db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS fridge')
        },
        (txObj, resultSet) => console.log('Table fridge dropped'),
        (txObj, error) => console.log(error)
      )
  }
  render() {
    const { isLoading, currentIngredient, currentPrice, currentUnit, currentCalories, currentCarbs, currentFats, currentProteins } = this.state;
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
        <Text>Nutritional Value per 100g</Text>
        <View style={styles.row}>
            <TextInput value={currentCalories} keyboardType='numeric' placeholder='kcal' onChangeText={(text) => this.setState({ currentCalories: text })} />
            <TextInput value={currentCarbs} keyboardType='numeric' placeholder='carbs' onChangeText={(text) => this.setState({ currentCarbs: text })} />
            <TextInput value={currentProteins} keyboardType='numeric' placeholder='proteins' onChangeText={(text) => this.setState({ currentProteins: text })} />
            <TextInput value={currentFats} keyboardType='numeric' placeholder='fats' onChangeText={(text) => this.setState({ currentFats: text })} />
        </View>
        <Button title="Add Ingredient" onPress={this.addIngredient} />
        <View style = {styles.row}>
            <Text style={styles.title}>{currentIngredient}</Text>
            <Text style={styles.text}>{currentPrice}€/{currentUnit}</Text>
        </View>

       </View>
    )}
    /*
    constructor(props){
        super(props)
        this.state = {
            ingredient: {
                name: '',
                price: '',
                unit: '',
            },
            confirmation: ''
        }
    }
    handleIngredientChange = (name) => {
        this.setState({
            ingredient: {
                ...this.state.ingredient,
                name: name
            },
        })
    }
    handlePriceChange = (price) => {
        this.setState({
            ingredient: {
                ...this.state.ingredient,
                price: price,
            },
        })
    }
    handleUnitChange = (value) => {
        if (value == 1){
            this.setState({
                ingredient: {
                    ...this.state.ingredient,
                    unit: 'kg',
                },
            })
        } else if (value == 2){
            this.setState({
                ingredient: {
                    ...this.state.ingredient,
                    unit: 'unit',
                },
            })
        }
    }
    addIngredient = async () => {
        if (this.state.ingredient.name.length != 0 
            && !isNaN(parseInt(this.state.ingredient.price, 10)) 
            && this.state.ingredient.unit.length != 0){
        this.setState({
            confirmation: 'The ingredient is being added'
        })
        const db = await getDBConnection()
        this.setState({
            confirmation: 'The ingredient is in the proccess added'
        })
        await addIngredient(db, this.state.ingredient)
        this.setState({
            confirmation: 'The ingredient has been added'
        })

        }
    }
    render(){
        return(
            <View>
                <TextInput style={styles.input} value={this.state.ingredient.name} onChangeText={this.handleIngredientChange} placeholder="Ingredient Name"/>
                <TextInput style={styles.input} value={this.state.ingredient.price} onChangeText={this.handlePriceChange} placeholder="Price"/>
                <TwoOptionButton 
                    option1Text='kg'
                    option2Text='unit'
                    onPress={this.handleUnitChange}/>
                <Ingredient ingredient={this.state.ingredient}/>
                <Button title='Add' onPress={this.addIngredient}/>
                <Text>{this.state.confirmation}</Text>
            </View>
        )
    }
    */
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
      title: {
        fontWeight: 'bold',
        margin: 3,
    },
    text: {
        margin: 3,
    },
  })
  