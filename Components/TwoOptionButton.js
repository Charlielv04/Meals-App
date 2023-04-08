import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';

export class TwoOptionButton extends Component {
  state = {
    activeOption: null,
  };

  handleOptionPress = (option) => {
    this.setState({ activeOption: option });
  };

  render() {
    const { option1Text, option2Text, onPress } = this.props;
    const { activeOption } = this.state;

    return (
      <React.Fragment>
        <TouchableOpacity
          style={[
            { backgroundColor: activeOption === 1 ? 'green': 'white' },
            styles.button,
          ]}
          onPress={() => {
            this.handleOptionPress(1);
            onPress && onPress(1);
          }}>
          <Text style={{ color: activeOption === 1 ? 'white' : 'black' }}>
            {option1Text}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            { backgroundColor: activeOption === 2 ? 'green' : 'white' },
            styles.button,
          ]}
          onPress={() => {
            this.handleOptionPress(2);
            onPress && onPress(2);
          }}>
          <Text style={{ color: activeOption === 2 ? 'white' : 'black' }}>
            {option2Text}
          </Text>
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

const styles = {
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
  },
}