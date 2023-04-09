import React from 'react'
import {Text, Image, StyleSheet, View, TouchableHighlight, Button} from 'react-native'

export class Meal extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <View key={this.props.index} style={styles.row}>
                <Text style={styles.title}>{this.props.meal.name}</Text>
                <Text style={styles.text}>{this.props.meal.price}€/{this.props.ingredient.unit}</Text>
                <Button title='Delete' onPress={() => this.props.deleteMeal(this.props.meal.id)} />
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

export default Meal