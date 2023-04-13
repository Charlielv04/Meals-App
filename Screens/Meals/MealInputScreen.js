import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, ScrollView, Dimensions } from 'react-native'
import * as SQLite from 'expo-sqlite'
import SearchableDropDown from 'react-native-searchable-dropdown'
import StringToFloat from '../../Components/StringToFloat';

export class MealInputScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      db: SQLite.openDatabase('meals.db'),
      isLoading: true,
      ingredients: [],
      availableIngredients: [],
      currentName: '',
      price: '',
      calories: '',
      carbs: '',
      proteins: '',
      fats: '',
      meal_id: undefined, 
      meals_ingredients: [],
    }
  }

  componentDidMount() {
    const { db } = this.state;

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ingredients',
        null,
        (txObj, resultSet) => this.setState({ availableIngredients: resultSet.rows._array }),
        (txObj, error) => console.log(error)
      );
    });

    this.setState({ isLoading: false });
  }
  deleteIngredient = (id) => {
    const {ingredients} =this.state
    let existingIngredients = [...ingredients].filter(ingredient => ingredient.id !== id)
    this.setState({ingredients: existingIngredients})
  }
  showIngredients = () => {
    const height = Dimensions.get('window').height
    const ligthHeight = height * 0.3
    const { quantities } = this.state
    return (
      <ScrollView style={{ height:  ligthHeight}}>
        <View>
        {this.state.ingredients.map((ingredient, index) => {
          return (
            <View key={index} style={styles.row}>
              <Text>{ingredient.name}</Text>
              <Button title='Delete' onPress={() => this.deleteIngredient(ingredient.id)}/>
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
    )
  }
  handleQuantityChange = (index, qtext) => {
    const { ingredients } = this.state
    const newIngredients = [...ingredients]
    if (qtext === '') {
      newIngredients[index].quantity = 0
      newIngredients[index].qtext = ''
    } else {
      newIngredients[index].quantity = StringToFloat(qtext);
      newIngredients[index].qtext = qtext
    }
    this.setState({ ingredients: newIngredients })
    this.updateMealValues()
    }
  
  updateMealValues = () => {
    const { ingredients } = this.state
    let [newPrice, newCalories, newProteins, newCarbs, newFats] = [0, 0, 0, 0, 0]
    ingredients.forEach((ingredient) => {
      newPrice += ingredient.price * ingredient.quantity
      if (ingredient.unit === 'kg') {
        newCalories += ingredient.calories * ingredient.quantity * 10
        newProteins += ingredient.proteins * ingredient.quantity * 10
        newFats += ingredient.fats * ingredient.quantity * 10
        newCarbs += ingredient.carbs * ingredient.quantity * 10
      } else {
        newCalories += ingredient.calories * ingredient.quantity
        newProteins += ingredient.proteins * ingredient.quantity
        newFats += ingredient.fats * ingredient.quantity
        newCarbs += ingredient.carbs * ingredient.quantity
      }
    })
    this.setState({
      price: newPrice.toFixed(2),
      calories: newCalories,
      proteins: newProteins,
      carbs: newCarbs,
      fats: newFats
    })
  }
  addMeal = () => {
    const { db, currentName, price, calories, proteins, carbs, fats, ingredients } = this.state;
  
    // Insert meal into meals table
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO meals (id, name, price, calories, carbs, proteins, fats) VALUES (?,?,?,?,?,?,?)',
        [null, currentName, price, calories, proteins, carbs, fats],
        (txObj, resultSet) => this.setState({meal_id: resultSet.insertId}),
        (txObj, error) => console.log(error)
      )
    })
    db.transaction(tx => {
      ingredients.forEach((ingredient) => {
        if(ingredient.quantity !== 0){
          tx.executeSql('INSERT INTO meals_ingredients (meal, ingredient, quantity) VALUES (?,?,?)', 
          [this.state.meal_id, ingredient.id, ingredient.quantity],
          (txObj, error) => console.log(error))
        }
      })
    })
  this.props.navigation.navigate('MealListScreen')
  };
  
  checkDatabase = () => {
    const {db} = this.state
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM meals_ingredients', null,
      (txObj, resultSet) => {
        this.setState({meals_ingredients: resultSet.rows._array})
        console.log(this.state.meals_ingredients)
      },
      (txObj, error) => console.log(error))
    })
  }
  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text>Loading names...</Text>
        </View>
      );
    }
    const { currentName } = this.state
    return (
      <View style={styles.container}>
          <View>
            <SearchableDropDown
            onItemSelect={(item) => {
              const ingredients = this.state.ingredients;
              item.quantity = 0
              item.qtext = ''
              if (!ingredients.includes(item)){
                ingredients.push(item)
                this.setState({ ingredients })
              }
            }}
            containerStyle={{ padding: 5 }}
            itemStyle={styles.item}
            itemTextStyle={{ color: '#222' }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={this.state.availableIngredients}
            defaultIndex={2}
            resetValue={false}
            textInputProps={
              {
                placeholder: "ingredient",
                underlineColorAndroid: "transparent",
                style: styles.textInput
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
          />
          </View>
          {this.showIngredients()}
          <View style={styles.row}>
            <TextInput
            value = {currentName}
            placeholder= 'Name'
            onChangeText={(text) => this.setState({currentName: text})}
            />
            <Text>{this.state.price}€</Text>
          </View>
          <View style={styles.row}>
            <Text>Calories: {this.state.calories}</Text>
            <Text>Carbs: {this.state.carbs}</Text>
            <Text>Proteins: {this.state.proteins}</Text>
            <Text>Fats: {this.state.fats}</Text>
          </View>
          <Button title='Add Meal' onPress={() => this.addMeal()}/>
          <Button title='Check Database' onPress={() => this.checkDatabase()} />
      </View>
      )
    }
  }
const styles = StyleSheet.create({
    textInput: {
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    item: {
      padding: 10,
      marginTop: 2,
      backgroundColor: '#ddd',
      borderColor: '#bbb',
      borderWidth: 1,
      borderRadius: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        margin: 8
      },   
  })
  