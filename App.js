// Components
import React, {Component} from 'react';
import {Image, Text, View, Alert} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import styles from './src/Styles';
import Icon from 'react-native-vector-icons/Ionicons';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Importing the screens
import Home from './src/screens/home';
import History from './src/screens/history';
import SendDoc from './src/screens/send-doc';
import HistoryDetails from './src/screens/history-details';
import LoginView from './src/screens/login';

// AWS APIs
import Amplify, {Auth} from 'aws-amplify';
import {
    CognitoUser,
    CognitoUserPool,
    CognitoUserSession,
} from 'amazon-cognito-identity-js';
import awsconfig from './aws-exports.js';
Amplify.configure(awsconfig);

Text.defaultProps = {color: '#333'};

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
        this.state = {
            isLogged: this.props.prelogged,
            signUpInitiated: false,
            loading: false,
        };
    }

    verifyOTP = async (otpData, jumpTo, reset) => {
        try {
            this.setState({loading: true});
            const message = await Auth.confirmSignUp(otpData.user, otpData.otp);
            console.log(message);
            // SimpleToast.show('Account Created Successfully');
            reset();
            jumpTo('login');
            Alert.alert(
                'Account created successfully!',
                'Login with your new account to continue',
            );
        } catch (error) {
            // alert(error.message);
            alert(error);
        }
        this.setState({loading: false});
    };

    login = async loginFields => {
        try {
            this.setState({loading: true});
            const res = await Auth.signIn(
                loginFields.userText,
                loginFields.pwdText,
            );
            console.log('res: ', res);
            this.setState({isLogged: true});
            SimpleToast.show('Logged In Successfully');
        } catch (error) {
            alert(error.message);
        }
        this.setState({loading: false});
    };

    signUp = async signUpData => {
        try {
            this.setState({loading: true});
            // Initiate Sign up for the user
            const {user} = await Auth.signUp({
                username: signUpData.email,
                password: signUpData.passwd,
                attributes: {
                    email: signUpData.email,
                    phone_number: signUpData.phone, // - E.164 number convention
                    given_name: signUpData.firstName,
                    family_name: signUpData.lastName,
                },
            });
            console.log(user);
            // Send the user data to database
            const databaseRecord = {
                username: signUpData.email,
                phone_number: signUpData.phone,
                given_name: signUpData.firstName,
                family_name: signUpData.lastName,
                is_doctor: false,
            };
            console.log(databaseRecord);

            this.setState({signUpInitiated: true});
        } catch (error) {
            alert(error.message);
        }
        this.setState({loading: false});
    };

    sendUser = async user => {
        try {
        } catch (error) {
            console.log(error);
        }
    };

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
                otpCallback={(data, jumpTo, reset) =>
                    this.verifyOTP(data, jumpTo, reset)
                }
                signUpInitiated={this.state.signUpInitiated}
                isLoading={this.state.loading}
            />
        );

        return <View style={styles.appContainer}>{screen}</View>;
    }
}

class AppWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {loaded: false, prelogged: false};
        this.heartIcon = require('./assets/heart-icon.png');
        this.getLastUser();
    }

    getLastUser = async () => {
        try {
            const {attributes} = await Auth.currentAuthenticatedUser();
            const session = await Auth.currentSession();
            // console.log(session);
            this.setState({prelogged: true});
        } catch (error) {
            console.log(error, typeof error);
        }
        this.setState({loaded: true});
    };

    render() {
        const curState = this.state.loaded ? (
            <App prelogged={this.state.prelogged} />
        ) : (
            <View style={styles.loadingScreen}>
                <Image style={styles.heartIcon} source={this.heartIcon} />
            </View>
        );

        return curState;
    }
}

// export default App;
export default AppWrapper;
