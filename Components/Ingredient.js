import React from 'react'
import {Text, Image, StyleSheet, View, TouchableHighlight, Button} from 'react-native'

export class Ingredient extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <View key={this.props.index} style={styles.row}>
                <Text style={styles.title}>{this.props.ingredient.name}</Text>
                <Text style={styles.text}>{this.props.ingredient.price}€/{this.props.ingredient.unit}</Text>
                <Button title='Delete' onPress={() => this.props.deleteIngredient(this.props.ingredient.id)} />
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
        margin: 8},
    title: {
        fontWeight: 'bold',
        margin: 3,
    },
    text: {
        margin: 3,
    },
})

export default Ingredient