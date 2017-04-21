/**
 * Deadweight
 * https://github.com/john-walley/deadweight
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Linking,
  Modal,
  Picker,
  ScrollView,
  Slider,
  StyleSheet,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableHighlight,
  View
} from 'react-native';

function secondsToTime(seconds) {
  const date = new Date(seconds * 1000);
  const mm = date.getUTCMinutes();
  let ss = date.getSeconds();

  if (ss < 10) {
    ss = "0" + ss;
  }

  return mm + ':' + ss;
}

function calculateTime(coxWeight, crewAverageWeight, type, time) {
  let boatWeight;
  let rowersWeight;

  if (type === 'W8+' || type === 'M8+') {
    boatWeight = 100.0;
    rowersWeight = 8 * crewAverageWeight;
  } else if (type === 'W4+' || type === 'M4+') {
    boatWeight = 60.0;
    rowersWeight = 4 * crewAverageWeight;
  }

  let minCoxWeight;

  if (type === 'W8+' || type === 'W4+') {
    minCoxWeight = 50.0;
  } else if (type === 'M8+' || type === 'M4+') {
    minCoxWeight = 55.0;
  }

  const theoreticalMass = minCoxWeight + boatWeight + rowersWeight;
  const actualMass = coxWeight + boatWeight + rowersWeight;
  return time * (actualMass - theoreticalMass) / theoreticalMass / 6.0
}

export default class Deadweight extends Component {
  constructor(props) {
    super(props);
    this.state = { coxWeight: 55, crewAverageWeight: 85, boatType: 'W8+', time: 360, modalVisible: false, };
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title="Deadweight"
          actions={[{ title: 'About', show: 'always' }]}
          onActionSelected={() => this.setState({ modalVisible: true })} />
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <TouchableHighlight onPress={() => this.setState({ modalVisible: false })}>
            <View style={{
              justifyContent: 'center',
              padding: 20,
            }}>
              <Text style={{ fontWeight: 'bold' }}>Why?</Text>
              <Text>As a not particularly light cox I was curious as to how much time I might be costing the crew. Now we can answer that question!</Text>
              <Text>Results should not be taken too seriously and just because a cox is light does not necessarily mean they can steer!</Text>
              <Text style={{ fontWeight: 'bold' }}>How?</Text>
              <Text>Calculation based on Anu Dudhia's excellent <Text style={{ color: 'blue' }}
                onPress={() => Linking.openURL('http://www.atm.ox.ac.uk/rowing/physics/')}>Physics of Rowing</Text>. In particular the section on the <Text style={{ color: 'blue' }}
                  onPress={() => Linking.openURL('http://www.atm.ox.ac.uk/rowing/physics/weight.html#section7')}>Effect of Deadweight on Boat Speed</Text>.</Text>
              <Text>Minimum cox weight is as in British Rowing's <Text style={{ color: 'blue' }}
                onPress={() => Linking.openURL('http://www.britishrowing.org/upload/files/Competition/RulesofRacing-1.2.11Finalv2.pdf')}>Rules of Racing</Text></Text>
            </View>
          </TouchableHighlight>
        </Modal>
        <View style={styles.blockContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              You'll go this much slower
            </Text>
          </View>
          <View style={styles.children}>
            <Text style={styles.result}>
              {calculateTime(this.state.coxWeight, this.state.crewAverageWeight, this.state.boatType, this.state.time).toFixed(1)} s
            </Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.blockContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                Cox weight
            </Text>
            </View>
            <View style={styles.children}>
              <Text style={styles.text}>
                {this.state.coxWeight && +this.state.coxWeight} kg
            </Text>
              <Slider
                style={styles.slider}
                minimumValue={50}
                maximumValue={140}
                step={1}
                value={this.state.coxWeight}
                onValueChange={(value) => this.setState({ coxWeight: value })}
              />
            </View>
          </View>
          <View style={styles.blockContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                Crew Average Weight
            </Text>
            </View>
            <View style={styles.children}>
              <Text style={styles.text}>
                {this.state.crewAverageWeight && +this.state.crewAverageWeight} kg
            </Text>
              <Slider
                style={styles.slider}
                minimumValue={40}
                maximumValue={140}
                step={1}
                value={this.state.crewAverageWeight}
                onValueChange={(value) => this.setState({ crewAverageWeight: value })}
              />
            </View>
          </View>
          <View style={styles.blockContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                Boat Type
            </Text>
            </View>
            <View style={styles.children}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.boatType}
                onValueChange={(value) => this.setState({ boatType: value })}>
                <Picker.Item label="W8+" value="W8+" />
                <Picker.Item label="M8+" value="M8+" />
                <Picker.Item label="W4+" value="W4+" />
                <Picker.Item label="M4+" value="M4+" />
              </Picker>
            </View>
          </View>
          <View style={styles.blockContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                Race Duration
            </Text>
              <Text style={styles.descriptionText}>
                It doesn't matter what distance just the time
            </Text>
            </View>
            <View style={styles.children}>
              <Text style={styles.text}>
                {this.state.time && secondsToTime(this.state.time)}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000}
                step={1}
                value={this.state.time}
                onValueChange={(value) => this.setState({ time: value })}
              />
            </View>
          </View>
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e9eaed',
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  result: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '800',
    color: 'black',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
  label: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
  },
  picker: {
    width: 100,
  },
  blockContainer: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#ffffff',
    margin: 10,
    marginVertical: 5,
    overflow: 'hidden',
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 2.5,
    borderBottomColor: '#d6d7da',
    backgroundColor: '#f6f7f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
  },
  children: {
    margin: 10,
  },
});

AppRegistry.registerComponent('Deadweight', () => Deadweight);
