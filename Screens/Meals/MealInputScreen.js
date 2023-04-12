import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, ScrollView, Dimensions } from 'react-native'
import * as SQLite from 'expo-sqlite'
import SearchableDropDown from 'react-native-searchable-dropdown'

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
      fats: ''
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
      newIngredients[index].quantity = parseFloat(qtext);
      newIngredients[index].qtext = qtext
    }
    this.setState({ ingredients: newIngredients })
    this.updateMealValues()
    }
  
  updateMealValues = () => {
    const { ingredients, price, calories, proteins, carbs, fats } = this.state
    let [newPrice, newCalories, newProteins, newCarbs, newFats] = [0, 0, 0, 0, 0]
    ingredients.forEach((ingredient) => {
      newPrice += parseFloat(ingredient.price) * ingredient.quantity
      if (ingredient.unit === 'kg') {
        newCalories += parseFloat(ingredient.calories) * ingredient.quantity * 10
        newProteins += parseFloat(ingredient.proteins) * ingredient.quantity * 10
        newFats += parseFloat(ingredient.fats) * ingredient.quantity * 10
        newCarbs += parseFloat(ingredient.carbs) * ingredient.quantity * 10
      } else {
        newCalories += parseFloat(ingredient.calories) * ingredient.quantity
        newProteins += parseFloat(ingredient.proteins) * ingredient.quantity
        newFats += parseFloat(ingredient.fats) * ingredient.quantity
        newCarbs += parseFloat(ingredient.carbs) * ingredient.quantity
      }
    })
    this.setState({
      price: newPrice.toString(),
      calories: newCalories.toString(),
      proteins: newProteins.toString(),
      carbs: newCarbs.toString(),
      fats: newFats.toString()
    })
  }
  addMeal = () => {

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
            <Text>{this.state.price}</Text>
          </View>
          <Button title='Add Meal' onPress={() => this.addMeal()}/>
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
  