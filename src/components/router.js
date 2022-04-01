import React from 'react';
// import {createAppContainer} from 'react-navigation';
import Home from '../screens/home';
import History from '../screens/history';
import Icon from 'react-native-vector-icons/Ionicons';
import TabBar from './tabbar';
import {NavigationContainer} from '@react-navigation/native';

const Router = createBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <Icon name="home" color={tintColor} />
                ),
            },
        },
        History: {
            screen: History,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => (
                    <Icon name="time" color={tintColor} />
                ),
            },
        },
    },
    {
        tabBarComponent: TabBar,
        tabBarOptions: {
            activeTintColor: '#2FC7FF',
            inactiveTintColor: '#C5C5C5',
        },
    },
);

// export default createAppContainer(Router);
export default NavigationContainer(Router);
