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
import {TabView, SceneMap} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {userText: '', pwdText: ''};
        this.heartIcon = require('../assets/heart-icon.png');
    }

    handleLogin() {
        this.props.login();
    }

    LoginPane(props) {
        return (
            <View style={styles.loginArea}>
                <View style={styles.inputFields}>
                    <View style={styles.loginRow}>
                        <Icon
                            name="person"
                            size={30}
                            color={'#ff5456'}
                            style={styles.loginIcons}
                        />
                        <TextInput
                            textContentType="username"
                            placeholder="Phone Number"
                            placeholderTextColor={'#aaa'}
                            style={styles.loginInput}
                            onChangeText={text =>
                                this.setState({userText: text})
                            }
                            returnKeyType={'next'}></TextInput>
                    </View>
                    <View style={styles.loginRow}>
                        <Icon
                            name="lock-closed"
                            size={30}
                            color={'#ff5456'}
                            style={styles.loginIcons}
                        />
                        <TextInput
                            textContentType="password"
                            placeholder="Password"
                            placeholderTextColor={'#aaa'}
                            secureTextEntry={true}
                            onChangeText={text =>
                                this.setState({pwdText: text})
                            }
                            onSubmitEditing={() => this.handleLogin()}
                            style={styles.loginInput}></TextInput>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => this.handleLogin()}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        );
    }

    SignUpPane(props) {
        return <View></View>;
    }

    render() {
        // renderSceneFunc = route => {
        //     if (route.key === "login") {
        //         return
        //     }
        // };

        return (
            <View style={styles.loginContainer}>
                <View style={styles.loginWrapper}>
                    <Image style={styles.heartIcon} source={this.heartIcon} />
                    {/* <TabView
                        navigationState={{
                            index: 0,
                            routes: [
                                {key: 'login', title: 'Login'},
                                {key: 'sign-up', title: 'Sign Up'},
                            ],
                        }}
                        style={styles.loginArea}
                        renderScene={SceneMap({
                            login: this.LoginPane,
                            'sign-up': this.SignUpPane,
                        })}
                    /> */}
                </View>
            </View>
        );
    }
}

export default LoginView;
