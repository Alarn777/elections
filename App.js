/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {createStackNavigator,createAppContainer} from 'react-navigation';
import Home from './screens/Home'
import Top5Parties from './screens/Top5Parties'


export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Home:Home,
  Top5Parties:Top5Parties
},{
  defaultNavigationOptions:{
    headerStyle:{
      backgroundColor: 'orange'
        }
      }
    }
);

const AppContainer = createAppContainer(createAppContainer(AppStackNavigator));

