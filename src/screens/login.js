import React, {Component} from 'react';
import {
    Platform,
    Text,
    TextInput,
    View,
    ScrollView,
    Modal,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';
import styles, {colors} from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {PasswordInput} from '../components/utilities';
import {TabView} from 'react-native-tab-view';

class LoginPane extends Component {
    constructor(props) {
        super(props);
        this.state = {userText: '', pwdText: '', hidePassword: true};

        this.initialState = this.state;
    }

    resetState() {
        console.log('Reset login tab');
        this.setState(this.initialState);
    }

    render() {
        return (
            <View style={styles.loginArea}>
                <View style={styles.inputFields}>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={'#aaa'}
                        style={styles.loginInput}
                        onChangeText={text => this.setState({userText: text})}
                        returnKeyType={'next'}
                    />
                    <PasswordInput
                        placeholder="Password"
                        placeholderTextColor={'#aaa'}
                        onChangeText={text => this.setState({pwdText: text})}
                        onSubmitEditing={() =>
                            this.props.loginCallback(this.state)
                        }
                        style={styles.loginPasswordInput}
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
            isDoctor: false,
            otp: '',
            // Doc Info
            clinic_name: '',
            clinic_phone: '',
            years: 0,
            expertise: '',
        };
        this.initialState = this.state;
    }

    resetState() {
        console.log('Reset sign up tab');
        this.setState(this.initialState);
    }

    doctorFields = () => {
        return (
            <View style={styles.doctorFields}>
                <TextInput
                    placeholder="Clinic/Hospital Name"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({clinic_name: text})}
                    returnKeyType={'next'}
                />
                <TextInput
                    placeholder="Clinic/Hospital Phone"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({clinic_phone: text})}
                    returnKeyType={'next'}
                />
                <TextInput
                    placeholder="Years of experience"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({years: text})}
                    returnKeyType={'next'}
                />
                <TextInput
                    placeholder="Field of expertise"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({expertise: text})}
                    returnKeyType={'next'}
                />
            </View>
        );
    };

    render() {
        const fields = !this.props.signUpInitiated ? (
            <ScrollView style={styles.inputFields}>
                <TextInput
                    placeholder="First Name"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({firstName: text})}
                    returnKeyType={'next'}
                />
                <TextInput
                    placeholder="Last Name"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({lastName: text})}
                    returnKeyType={'next'}
                />

                <TextInput
                    placeholder="E-Mail"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({email: text})}
                    returnKeyType={'next'}
                />

                <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
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
                    style={[styles.loginInput, styles.smoothShadow]}
                />
                <Text
                    style={styles.forgotPwd}
                    onPress={() =>
                        this.setState({isDoctor: !this.state.isDoctor})
                    }>
                    {this.state.isDoctor
                        ? 'Not a doctor?'
                        : 'Are you a doctor?'}
                </Text>
                {this.state.isDoctor ? this.doctorFields() : undefined}
            </ScrollView>
        ) : (
            <TextInput
                placeholder="Enter OTP"
                placeholderTextColor={'#aaa'}
                onChangeText={text => this.setState({otp: text})}
                style={[styles.loginInput, styles.smoothShadow]}
            />
        );
        let data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phone: this.state.phone,
            passwd: this.state.passwd,
            is_doctor: this.state.isDoctor,
        };

        if (data.is_doctor) {
            data = {
                ...data,
                clinic_name: this.state.clinic_name,
                clinic_phone: this.state.clinic_phone,
                years: this.state.years,
                expertise: this.state.expertise,
            };
        }

        const btnCallback = !this.props.signUpInitiated
            ? () => this.props.signUpCallback(data)
            : () =>
                  this.props.otpCallback(
                      {
                          user: data.email,
                          otp: this.state.otp,
                      },
                      this.props.jumpTo,
                      () => this.resetState(),
                  );
        const btnName = !this.props.signUpInitiated ? 'SIGN UP' : 'VERIFY';
        return (
            <View style={styles.loginArea}>
                {fields}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={btnCallback}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>{btnName}</Text>
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
            isDoctor: false,
        };
        this.heartIcon = require('../../assets/heart-icon.png');
    }

    handleLogin = loginFields => {
        console.log(loginFields);

        // Check all fields are filled
        const valid = Object.entries(loginFields).every(pair => pair[1] !== '');
        if (!valid) {
            alert('Enter all fields');
            return;
        }

        // Check if email regex is correct
        const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!emailReg.test(loginFields.userText)) {
            alert('Invalid Email');
            return;
        }
        this.props.login(loginFields);
    };

    handleSignUp = signUpData => {
        console.log(signUpData);
        // Check all fields except otp are filled
        const valid = Object.entries(signUpData).every(
            pair => pair[0] === 'otp' || pair[1] !== '',
        );
        if (!valid) {
            alert('Enter all fields');
            return;
        }

        //Check valid names
        const nameReg = /^[a-zA-Z ]+$/;
        if (
            !nameReg.test(signUpData.firstName) ||
            !nameReg.test(signUpData.lastName)
        ) {
            alert('Invalid Name');
        }

        // Check if email regex is correct
        const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!emailReg.test(signUpData.email)) {
            alert('Invalid Email');
            return;
        }

        // Check if phone regex is correct
        const phoneReg = /^\+[1-9]\d{1,14}$/;
        if (
            !phoneReg.test(signUpData.phone) ||
            (signUpData?.is_doctor && !phoneReg.test(signUpData.clinic_phone))
        ) {
            alert('Invalid Phone Number');
            return;
        }
        this.props.signUp(signUpData);
    };

    render() {
        const renderSceneFunc = ({route, jumpTo}) => {
            if (route.key === 'login') {
                return (
                    <LoginPane
                        loginCallback={this.handleLogin}
                        jumpTo={jumpTo}
                    />
                );
            } else if (route.key === 'sign-up') {
                return (
                    <SignUpPane
                        signUpCallback={this.handleSignUp}
                        otpCallback={this.props.otpCallback}
                        signUpInitiated={this.props.signUpInitiated}
                        jumpTo={jumpTo}
                    />
                );
            }
        };

        const indexChange = index => {
            this.setState({index: index});
        };

        return (
            <View style={styles.loginContainer}>
                <Modal transparent={true} visible={this.props.isLoading}>
                    <View style={styles.modalBoxWrapper}>
                        <ActivityIndicator size={'large'} color={'limegreen'} />
                    </View>
                </Modal>
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
