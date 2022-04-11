// Components
import React, {Component} from 'react';
import {Image, Text, View, Alert, TouchableHighlight} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import styles, {colors} from './src/Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {MainContext} from './src/components/main-context';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Importing the doctor screens
import DoctorHome from './src/screens/doctor-view/doctor-home';
import RespondScreen from './src/screens/doctor-view/respond-screen';

// Importing the patient screens
import Home from './src/screens/patient-view/home';
import History from './src/screens/patient-view/history';
import SendDoc from './src/screens/patient-view/send-doc';
import HistoryDetails from './src/screens/patient-view/history-details';
import LoginView from './src/screens/login';
import Profile from './src/screens/profile-view/profile';
import EditProfile from './src/screens/profile-view/edit-profile';

// AWS APIs
import * as mutations from './src/graphql/mutations';
import * as queries from './src/graphql/queries';
import Amplify, {Auth, API, Storage} from 'aws-amplify';
import awsconfig from './aws-exports.js';
Amplify.configure(awsconfig);

const Tab = createBottomTabNavigator();

// Doctor Tabs
const DoctorHomeStack = createNativeStackNavigator();

// Patient Tabs
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
                            backgroundColor: colors.mainTheme,
                        },
                        headerTitleStyle: {color: '#fff'},
                    }}></HomeStack.Screen>
            </HomeStack.Navigator>
        );
    }
}

class DoctorHomeStackScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DoctorHomeStack.Navigator>
                <DoctorHomeStack.Screen
                    name="doctor-home"
                    component={DoctorHome}
                    options={{headerShown: false}}
                />
                <DoctorHomeStack.Screen
                    name="respond-screen"
                    component={RespondScreen}
                    options={{
                        title: 'Respond',
                        headerStyle: {
                            backgroundColor: colors.mainTheme,
                        },
                        headerTitleStyle: {color: '#fff'},
                    }}
                />
            </DoctorHomeStack.Navigator>
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
                            backgroundColor: colors.mainTheme,
                        },
                        headerTitleStyle: {color: '#fff'},
                    }}></HistoryStack.Screen>
                <HistoryStack.Screen
                    name="details-screen"
                    component={HistoryDetails}
                    options={{
                        title: 'Interaction Info',
                        headerStyle: {
                            backgroundColor: colors.mainTheme,
                        },
                        headerTitleStyle: {color: '#fff'},
                    }}></HistoryStack.Screen>
            </HistoryStack.Navigator>
        );
    }
}

class ProfileStackScreen extends Component {
    static contextType = MainContext;
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
                    {text: 'LOG OUT', onPress: this.context.signOutCallback},
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

class App extends Component {
    static contextType = MainContext;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            signUpInitiated: false,
            isLogged: this.props.prelogged,
            isDoctor: false,
            loggedUser: null,
        };
    }

    verifyOTP = async (otpData, jumpTo, reset) => {
        try {
            this.setState({loading: true});
            const message = await Auth.confirmSignUp(otpData.user, otpData.otp);
            // console.log(message);
            SimpleToast.show('Account Created Successfully');
            reset();
            jumpTo('login');
            Alert.alert(
                'Account created successfully!',
                'Login with your new account to continue',
            );
        } catch (error) {
            alert(error);
        }
        this.setState({loading: false});
    };

    login = async loginFields => {
        this.setState({loading: true});
        try {
            // Authenticate the user
            const res = await Auth.signIn(
                loginFields.userText,
                loginFields.pwdText,
            );
            // console.log('res: ', res);
            // Query if the user is a doctor
            const {data} = await API.graphql({
                query: queries.getUser,
                variables: {mail_id: loginFields.userText},
                authMode: 'API_KEY',
            });
            // Set State in app
            this.setState({
                isLogged: true,
                loggedUser: data.getUser,
                isDoctor: data.getUser.is_doctor,
            });
            console.log('Context while login : ', this.context);
            // this.context.
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
            // console.log(user);
            // Send the user data to database
            const databaseRecord = {
                mail_id: signUpData.email,
                phone: signUpData.phone,
                first_name: signUpData.firstName,
                last_name: signUpData.lastName,
                is_doctor: signUpData.is_doctor,
            };
            const r = await API.graphql({
                query: mutations.createUser,
                variables: {input: databaseRecord},
                authMode: 'API_KEY',
            });
            // console.log(r);

            if (signUpData.is_doctor) {
                const doctorData = {
                    mail_id: signUpData.email,
                    years: signUpData.years,
                    expertise: signUpData.expertise,
                    clinic_name: signUpData.clinic_name,
                    clinic_address: null,
                    clinic_phone: signUpData.clinic_phone,
                    location: null,
                };
                const docR = await API.graphql({
                    query: mutations.createDoctor,
                    variables: {input: doctorData},
                    authMode: 'API_KEY',
                });
                console.log(docR);
            }

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

    initiatePasswdChange = async (username, changeState) => {
        this.setState({loading: true});
        try {
            const response = await Auth.forgotPassword(username);
            console.log(response);
            changeState();
        } catch (error) {
            alert(error.message);
        }
        this.setState({loading: false});
    };

    completePasswordChange = async (username, otp, newPwd, reset) => {
        this.setState({loading: true});
        try {
            const confirmation = await Auth.forgotPasswordSubmit(
                username,
                otp,
                newPwd,
            );
            console.log(confirmation);
            SimpleToast.show('Password Changed');
            reset();
        } catch (error) {
            alert(error.message);
        }
        this.setState({loading: false});
    };

    render() {
        const isDoc = this.context?.profile?.is_doctor;
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
                    <Tab.Screen
                        name="Home"
                        component={
                            isDoc ? DoctorHomeStackScreen : HomeStackScreen
                        }
                    />
                    {isDoc ? undefined : (
                        <Tab.Screen
                            name="History"
                            component={HistoryStackScreen}
                        />
                    )}
                    <Tab.Screen name="Profile" component={ProfileStackScreen} />
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
                forgotPassword={this.initiatePasswdChange}
                forgotPasswordSubmit={this.completePasswordChange}
            />
        );

        return <View style={styles.appContainer}>{screen}</View>;
    }

    componentDidMount() {
        if (this.context?.profile !== null) {
            this.setState({loggedUser: this.context.profile});
        }
    }

    componentDidUpdate() {
        if (this.state.loggedUser !== null) {
            // Set the data in the Global React Context
            const tempObject = this.state.loggedUser;
            // console.log('Context when app mounted : \n', this.context);
            this.setState({loggedUser: null});
            this.context.setContextCallback(
                this.context.ip,
                tempObject,
                this.signOut,
            );
        }
    }
}

class AppWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            prelogged: false,
            ip: '',
            profile: null,
            signOutCallback: undefined,
            setContextCallback: this.setContext,
        };
        this.heartIcon = require('./assets/heart-icon.png');

        this.getServerIP();
        this.getLastUser();
    }

    setContext = (ip, prof, func) => {
        this.setState({ip: ip, profile: prof, signOutCallback: func});
    };

    getLastUser = async () => {
        try {
            // Get user details
            const {attributes} = await Auth.currentAuthenticatedUser();
            const {data} = await API.graphql({
                query: queries.getUser,
                variables: {mail_id: attributes.email},
                authMode: 'API_KEY',
            });

            this.setState({prelogged: true, profile: data.getUser});
        } catch (error) {
            console.log('Error logging in :\n', error);
        }
        this.setState({loaded: true});
    };

    getServerIP = async () => {
        try {
            let file = await Storage.get('public.txt', {download: true});
            // console.log(file);
            const ip = await new Response(file.Body).text();
            // console.log(ip);

            this.setState({ip: ip});
        } catch (error) {
            console.log('Error getting Server IP : \n', error);
        }
    };

    render() {
        const curState = this.state.loaded ? (
            <MainContext.Provider value={this.state}>
                <App prelogged={this.state.prelogged} />
            </MainContext.Provider>
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
