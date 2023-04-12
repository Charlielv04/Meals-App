import React from 'react'
import {Text, Image, StyleSheet, View, TouchableHighlight, Button} from 'react-native'

export class Ingredient extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: 0
        }
    }
    
    render(){
        return(
            <View key={this.props.index} style={styles.row}>
                <TouchableHighlight onPress = {() => this.props.ingredientDetails(this.props.ingredient.id)} underlayColor='transparent'>
                    <View style = {styles.row}>
                        <Text style={styles.title}>{this.props.ingredient.name}</Text>
                        <Text style={styles.text}>{this.props.ingredient.price}€/{this.props.ingredient.unit}</Text>
                    </View>
                </TouchableHighlight>
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