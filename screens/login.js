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
import styles from '../Styles';
import {TabView} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';

class LoginPane extends Component {
    constructor(props) {
        super(props);
        this.state = {userText: '', pwdText: ''};
    }

    render() {
        return (
            <View style={styles.loginArea}>
                <View style={styles.inputFields}>
                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor={'#aaa'}
                        style={styles.loginInput}
                        onChangeText={text => this.setState({userText: text})}
                        returnKeyType={'next'}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={'#aaa'}
                        secureTextEntry={true}
                        onChangeText={text => this.setState({pwdText: text})}
                        onSubmitEditing={() =>
                            this.props.loginCallback(this.state)
                        }
                        style={styles.loginInput}
                    />
                    <Text
                        style={styles.forgotPwd}
                        onPress={() => console.log('Get OTP')}>
                        Forgot Password?
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.props.loginCallback(this.state)}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

class SignUpPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            passwd: '',
        };
    }

    render() {
        return (
            <View style={styles.loginArea}>
                <View style={styles.inputFields}>
                    <TextInput
                        placeholder="First Name"
                        placeholderTextColor={'#aaa'}
                        style={styles.loginInput}
                        onChangeText={text => this.setState({firstName: text})}
                        returnKeyType={'next'}
                    />
                    <TextInput
                        placeholder="Last Name"
                        placeholderTextColor={'#aaa'}
                        style={styles.loginInput}
                        onChangeText={text => this.setState({lastName: text})}
                        returnKeyType={'next'}
                    />

                    <TextInput
                        placeholder="E-Mail"
                        placeholderTextColor={'#aaa'}
                        style={styles.loginInput}
                        onChangeText={text => this.setState({email: text})}
                        returnKeyType={'next'}
                    />

                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor={'#aaa'}
                        style={styles.loginInput}
                        onChangeText={text => this.setState({phone: text})}
                        returnKeyType={'next'}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={'#aaa'}
                        secureTextEntry={true}
                        onChangeText={text => this.setState({passwd: text})}
                        onSubmitEditing={() =>
                            this.props.signUpCallback(this.state)
                        }
                        style={styles.loginInput}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.props.signUpCallback(this.state)}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: 'login', title: 'Login'},
                {key: 'sign-up', title: 'Sign Up'},
            ],
        };
        this.heartIcon = require('../assets/heart-icon.png');
    }

    handleLogin = loginFields => {
        this.props.login(loginFields);
    };

    handleSignUp = signUpData => {
        this.props.signUp(signUpData);
    };

    render() {
        const renderSceneFunc = ({route}) => {
            if (route.key === 'login') {
                return <LoginPane loginCallback={this.handleLogin} />;
            } else if (route.key === 'sign-up') {
                return <SignUpPane signUpCallback={this.handleSignUp} />;
            }
        };

        const indexChange = index => {
            this.setState({index: index});
        };

        return (
            <View style={styles.loginContainer}>
                <View style={styles.loginWrapper}>
                    <Image style={styles.heartIcon} source={this.heartIcon} />
                    <TabView
                        navigationState={{
                            index: this.state.index,
                            routes: this.state.routes,
                        }}
                        style={styles.loginTabView}
                        onIndexChange={indexChange}
                        renderScene={renderSceneFunc}
                    />
                </View>
            </View>
        );
    }
}

export default LoginView;
