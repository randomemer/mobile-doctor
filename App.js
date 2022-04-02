// Components
import React, {Component} from 'react';
import {Image, Text, View, Alert, TouchableHighlight} from 'react-native';
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
import Profile from './src/screens/profile';
import EditProfile from './src/screens/edit-profile';

// AWS APIs
import * as mutations from './src/graphql/mutations';
import Amplify, {Auth, API} from 'aws-amplify';
import awsconfig from './aws-exports.js';
import {sin} from 'react-native/Libraries/Animated/Easing';
Amplify.configure(awsconfig);

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

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

class ProfileStackScreen extends Component {
    constructor(props) {
        super(props);
    }

    ProfileHeader = props => {
        const signOutFunc = () => {
            Alert.alert(
                'Log Out?',
                'You will be logged out and will have to sign in again.',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'LOG OUT', onPress: this.props.signOutCallback},
                ],
            );
        };

        return (
            <View style={styles.profileHeaderStyle}>
                <Text style={styles.profileHeaderText}>Profile</Text>
                <TouchableHighlight
                    onPress={signOutFunc}
                    underlayColor="rgba(256,256,256, 0.3)"
                    style={styles.logoutButton}>
                    <Icon name="log-out-outline" color="#fff" size={30} />
                </TouchableHighlight>
            </View>
        );
    };

    render() {
        return (
            <ProfileStack.Navigator>
                <ProfileStack.Screen
                    name="profile"
                    component={Profile}
                    options={{
                        headerStyle: {
                            backgroundColor: '#ff5456',
                        },
                        header: props => <this.ProfileHeader {...props} />,
                    }}></ProfileStack.Screen>
                <ProfileStack.Screen
                    name="edit-profile"
                    component={EditProfile}
                    options={{
                        headerStyle: {
                            backgroundColor: '#ff5456',
                        },
                        title: 'Edit Profile',
                    }}
                />
            </ProfileStack.Navigator>
        );
    }
}

Text.defaultProps = {color: '#333'};
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
                mail_id: signUpData.email,
                phone: signUpData.phone,
                first_name: signUpData.firstName,
                last_name: signUpData.lastName,
                is_doctor: false,
            };
            const r = await API.graphql({
                query: mutations.createUser,
                variables: {input: databaseRecord},
                authMode: 'API_KEY',
            });
            console.log(r);

            this.setState({signUpInitiated: true});
        } catch (error) {
            alert(error.message);
        }
        this.setState({loading: false});
    };

    signOut = async () => {
        try {
            const response = await Auth.signOut();
            console.log(response);
            this.setState({
                isLogged: false,
                signUpInitiated: false,
                loading: false,
            });
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

                            switch (route.name) {
                                case 'Home':
                                    iconName = focused
                                        ? 'home'
                                        : 'home-outline';
                                    break;
                                case 'History':
                                    iconName = focused
                                        ? 'time'
                                        : 'time-outline';
                                    break;
                                case 'Profile':
                                    iconName = focused
                                        ? 'person-circle'
                                        : 'person-circle-outline';
                                    break;
                                default:
                                    break;
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
                        headerShown: false,
                    })}>
                    <Tab.Screen name="Home" component={HomeStackScreen} />
                    <Tab.Screen name="History" component={HistoryStackScreen} />
                    <Tab.Screen name="Profile">
                        {props => (
                            <ProfileStackScreen
                                {...props}
                                signOutCallback={this.signOut}
                            />
                        )}
                    </Tab.Screen>
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
