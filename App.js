import React, {Component} from 'react';
import {
    Platform,
    Text,
    TextInput,
    View,
    PermissionsAndroid,
    TouchableHighlight,
    TouchableOpacity,
    Image,
} from 'react-native';
import styles from './Styles';
import {TabView, SceneMap} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Importing the screens
import Home from './screens/home';
import History from './screens/history';
import SendDoc from './screens/send-doc';
import HistoryDetails from './screens/history-details';
import LoginView from './screens/login';

// AWS APIs
import Amplify, {Auth} from 'aws-amplify';
import awsconfig from './src/aws-exports.js';
Amplify.configure(awsconfig);

async function signUp() {
    try {
        const {user} = await Auth.signUp({
            username: 'pshashank569@gmail.com',
            password: 'Shashank',
            attributes: {
                email: 'pshashank569@gmail.com', // optional
                phone_number: '+919500062931', // optional - E.164 number convention
                given_name: 'Shashank',
                family_name: 'Pathipati',
                birthdate: '',
            },
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
}

// signUp();
Text.defaultProps = {color: '#333'};

(async function () {
    if (Platform.OS === 'android') {
        try {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);

            // console.log('write external stroage', grants);

            if (
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log('permissions granted');
            } else {
                console.log('permissions not granted');
                return;
            }
        } catch (err) {
            console.warn(err);
            return;
        }
    }
})();

const HomeStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

class HomeStackScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HomeStack.Navigator>
                <HomeStack.Screen
                    name="record-screen"
                    component={Home}
                    options={{headerShown: false}}></HomeStack.Screen>
                <HomeStack.Screen
                    name="send-screen"
                    component={SendDoc}
                    options={{
                        title: 'Pick Your Doc',
                        headerStyle: {
                            backgroundColor: '#ff5456',
                        },
                        headerTitleStyle: {color: '#fff'},
                    }}></HomeStack.Screen>
            </HomeStack.Navigator>
        );
    }
}

class HistoryStackScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HistoryStack.Navigator>
                <HistoryStack.Screen
                    name="history-screen"
                    component={History}
                    options={{
                        title: 'Previous Interactions',
                        headerStyle: {
                            backgroundColor: '#ff5456',
                        },
                        headerTitleStyle: {color: '#fff'},
                    }}></HistoryStack.Screen>
                <HistoryStack.Screen
                    name="details-screen"
                    component={HistoryDetails}
                    options={{
                        title: 'Interaction Info',
                        headerStyle: {
                            backgroundColor: '#ff5456',
                        },
                        headerTitleStyle: {color: '#fff'},
                    }}></HistoryStack.Screen>
            </HistoryStack.Navigator>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {isLogged: false};
    }

    login(loginFields) {
        console.log(loginFields);
        this.setState({isLogged: true});
    }

    signUp(signUpData) {
        console.log(signUpData);
        this.setState({isLogged: true});
    }

    render() {
        const screen = this.state.isLogged ? (
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={({route}) => ({
                        tabBarIcon: ({focused, color, size}) => {
                            let iconName;

                            if (route.name === 'Home') {
                                iconName = focused ? 'home' : 'home-outline';
                            } else if (route.name === 'History') {
                                iconName = focused ? 'time' : 'time-outline';
                            }

                            return (
                                <Icon
                                    name={iconName}
                                    size={size}
                                    color={color}
                                />
                            );
                        },
                        tabBarActiveTintColor: '#ff5456',
                        tabBarInactiveTintColor: 'gray',
                        tabBarShowLabel: false,
                        tabBarStyle: {},
                        headerShown:
                            route.name in {Home: undefined} ? false : false,
                    })}>
                    <Tab.Screen
                        name="Home"
                        component={HomeStackScreen}></Tab.Screen>
                    <Tab.Screen
                        name="History"
                        component={HistoryStackScreen}
                        options={{
                            title: 'Previous Interactions',
                            headerStyle: {
                                backgroundColor: '#ff5456',
                            },
                            headerTitleStyle: {color: '#fff'},
                        }}></Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        ) : (
            <LoginView
                login={data => this.login(data)}
                signUp={data => this.signUp(data)}
            />
        );

        return <View style={styles.appContainer}>{screen}</View>;
    }
}

export default App;