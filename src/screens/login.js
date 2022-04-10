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
    TouchableHighlight,
    Image,
} from 'react-native';
import styles, {colors} from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {PasswordInput} from '../components/utilities';
import {TabView} from 'react-native-tab-view';
import ReactNativePhoneInput from 'react-native-phone-input';

class LoginPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userText: '',
            pwdText: '',
            hidePassword: true,
            otp: '',
            forgotPwd: false,
            otpReceived: false,
            newPwd: '',
            confirmNewPwd: '',
        };

        this.initialState = this.state;
    }

    resetState = () => {
        console.log('Reset login tab');
        this.setState(this.initialState);
    };

    ForgotPasswordComponent = props => {
        return (
            <View style={styles.inputFields}>
                <TouchableHighlight
                    style={styles.forgotPwdBack}
                    underlayColor="#ffaaab"
                    onPress={() => {
                        this.setState(this.initialState);
                    }}>
                    <Icon
                        name="arrow-back"
                        color={colors.mainTheme}
                        size={30}
                    />
                </TouchableHighlight>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor={'#aaa'}
                    style={styles.loginInput}
                    onChangeText={text => this.setState({userText: text})}
                    editable={!this.state.otpReceived}
                    returnKeyType={'next'}
                />
                {this.state.otpReceived ? (
                    <React.Fragment>
                        <TextInput
                            placeholder="One Time Password"
                            placeholderTextColor={'#aaa'}
                            style={styles.loginInput}
                            onChangeText={text => this.setState({otp: text})}
                            returnKeyType={'next'}
                            editable={this.state.otpReceived}
                        />
                        <PasswordInput
                            placeholder="New Password"
                            placeholderTextColor={'#aaa'}
                            onChangeText={text => this.setState({newPwd: text})}
                            returnKeyType={'next'}
                            style={styles.loginPasswordInput}
                        />
                        <PasswordInput
                            placeholder="Confirm New Password"
                            placeholderTextColor={'#aaa'}
                            onChangeText={text =>
                                this.setState({confirmNewPwd: text})
                            }
                            onSubmitEditing={() =>
                                this.props.loginCallback(props.fields)
                            }
                            style={styles.loginPasswordInput}
                        />
                    </React.Fragment>
                ) : undefined}
            </View>
        );
    };

    DefaultComponent = props => {
        return (
            <View style={styles.inputFields}>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor={'#aaa'}
                    style={styles.loginInput}
                    onChangeText={text => this.setState({userText: text})}
                    returnKeyType={'next'}
                    textContentType="emailAddress"
                    autoComplete="email"
                />
                <PasswordInput
                    placeholder="Password"
                    placeholderTextColor={'#aaa'}
                    onChangeText={text => this.setState({pwdText: text})}
                    onSubmitEditing={() =>
                        this.props.loginCallback(props.fields)
                    }
                    style={styles.loginPasswordInput}
                />
                <Text
                    style={styles.forgotPwd}
                    onPress={() =>
                        this.setState({forgotPwd: !this.state.forgotPwd})
                    }>
                    Forgot Password?
                </Text>
            </View>
        );
    };

    render() {
        const {userText, pwdText} = this.state;
        const fields = {userText, pwdText};

        const buttonText = this.state.otpReceived
            ? 'RESET PASSWORD'
            : this.state.forgotPwd
            ? 'SEND OTP'
            : 'LOGIN';

        const callback = this.state.otpReceived
            ? () =>
                  this.props.forgotPasswordSubmitCallback(
                      userText,
                      this.state.otp,
                      this.state.newPwd,
                      this.state.confirmNewPwd,
                      this.resetState,
                  )
            : this.state.forgotPwd
            ? () =>
                  this.props.forgotPasswordCallback(userText, () =>
                      this.setState({otpReceived: true}),
                  )
            : () => this.props.loginCallback(fields);

        return (
            <View style={styles.loginArea}>
                {this.state.forgotPwd ? (
                    <this.ForgotPasswordComponent fields={fields} />
                ) : (
                    <this.DefaultComponent fields={fields} />
                )}
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={callback}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>{buttonText}</Text>
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
        this.phoneSelect = undefined;
        this.clinicPhoneSelect = undefined;
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
                <ReactNativePhoneInput
                    ref={ref => (this.clinicPhoneSelect = ref)}
                    style={[styles.loginInput, styles.smoothShadow]}
                    textStyle={styles.phonePickerText}
                    textProps={{
                        placeholder: 'Clinic/Hospital Phone',
                        placeholderTextColor: '#aaa',
                    }}
                    pickerBackgroundColor="#333"
                    autoFormat={true}
                    onChangePhoneNumber={num =>
                        this.setState({clinic_phone: num})
                    }
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
                    autoComplete="name"
                    textContentType="givenName"
                />
                <TextInput
                    placeholder="Last Name"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({lastName: text})}
                    returnKeyType={'next'}
                    textContentType="familyName"
                    autoComplete="name"
                />

                <TextInput
                    placeholder="E-Mail"
                    placeholderTextColor={'#aaa'}
                    style={[styles.loginInput, styles.smoothShadow]}
                    onChangeText={text => this.setState({email: text})}
                    returnKeyType={'next'}
                    textContentType="emailAddress"
                    autoComplete="email"
                />
                <ReactNativePhoneInput
                    ref={ref => (this.phoneSelect = ref)}
                    style={[styles.loginInput, styles.smoothShadow]}
                    textStyle={styles.phonePickerText}
                    textProps={{
                        placeholder: 'Phone Number',
                        placeholderTextColor: '#aaa',
                    }}
                    pickerBackgroundColor="#333"
                    autoFormat={true}
                    onChangePhoneNumber={num => this.setState({phone: num})}
                />
                <PasswordInput
                    placeholder="Password"
                    placeholderTextColor={'#aaa'}
                    secureTextEntry={true}
                    onChangeText={text => this.setState({passwd: text})}
                    onSubmitEditing={() =>
                        this.props.signUpCallback(this.state)
                    }
                    style={styles.loginPasswordInput}
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
            phone: this.phoneSelect?.getValue(),
            passwd: this.state.passwd,
            is_doctor: this.state.isDoctor,
        };

        if (data.is_doctor) {
            data = {
                ...data,
                clinic_name: this.state.clinic_name,
                clinic_phone: this.clinicPhoneSelect?.getValue(),
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

    handleForgotPassword = (username, changeState) => {
        if (username === '') {
            alert('Email cannot be empty');
            return;
        }

        const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!emailReg.test(username)) {
            alert('Invalid Email');
            return;
        }

        this.props.forgotPassword(username, changeState);
    };

    handleForgotPasswordSubmit = (
        username,
        otp,
        newPwd,
        confirmNewPwd,
        reset,
    ) => {
        if (otp === '' || newPwd === '' || confirmNewPwd === '') {
            alert('Enter all fields');
            return;
        }

        if (newPwd !== confirmNewPwd) {
            alert('Passwords do not match');
            return;
        }

        this.props.forgotPasswordSubmit(username, otp, newPwd, reset);
    };

    render() {
        const renderSceneFunc = ({route, jumpTo}) => {
            if (route.key === 'login') {
                return (
                    <LoginPane
                        loginCallback={this.handleLogin}
                        forgotPasswordCallback={this.handleForgotPassword}
                        forgotPasswordSubmitCallback={
                            this.handleForgotPasswordSubmit
                        }
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
