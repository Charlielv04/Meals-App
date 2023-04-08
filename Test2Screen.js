import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar } from 'react-native';
import * as SQLite from 'expo-sqlite'

export default class Test2Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          db: SQLite.openDatabase('example.db'),
          isLoading: true,
          names: [],
          currentName: undefined,
        };
      }
    
    componentDidMount() {
        const { db } = this.state;
    
        db.transaction(tx => {
          tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
        });
    
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM names', null,
            (txObj, resultSet) => this.setState({ names: resultSet.rows._array }),
            (txObj, error) => console.log(error)
          );
        });
    
        this.setState({ isLoading: false });
    }

  addName = () => {
    const { db, names, currentName } = this.state;
    db.transaction(tx => {
      tx.executeSql('INSERT INTO names (name) values (?)', [currentName],
        (txObj, resultSet) => {
          let existingNames = [...names];
          existingNames.push({ id: resultSet.insertId, name: currentName });
          this.setState({ names: existingNames, currentName: undefined });
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  deleteName = (id) => {
    const { db, names } = this.state;
    db.transaction(tx => {
      tx.executeSql('DELETE FROM names WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter(name => name.id !== id);
            this.setState({ names: existingNames });
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  updateName = (id) => {
    const { db, names, currentName } = this.state;
    db.transaction(tx => {
      tx.executeSql('UPDATE names SET name = ? WHERE id = ?', [currentName, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names];
            const indexToUpdate = existingNames.findIndex(name => name.id === id);
            existingNames[indexToUpdate].name = currentName;
            this.setState({ names: existingNames, currentName: undefined });
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  showNames = () => {
    const { names } = this.state;
    return names.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{name.name}</Text>
          <Button title='Delete' onPress={() => this.deleteName(name.id)} />
          <Button title='Update' onPress={() => this.updateName(name.id)} />
        </View>
      );
    });
  };

  render() {
    const { isLoading, currentName } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text>Loading names...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TextInput value={currentName} placeholder='name' onChangeText={(text) => this.setState({ currentName: text })} />
        <Button title="Add Name" onPress={this.addName} />
        {this.showNames()}
       </View>
    )}
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
    }
  });
