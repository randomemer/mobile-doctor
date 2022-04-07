// React Components
import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    Alert,
    TouchableHighlight,
    TextInput,
} from 'react-native';
import styles from '../../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import ReactNativePhoneInput from 'react-native-phone-input';
import DropdownComponent from '../../components/dropdown';
import {MainContext} from '../../components/main-context';

// AWS APIs
import * as mutations from '../../graphql/mutations';
import Amplify, {Auth, API} from 'aws-amplify';
import {LoadingModal} from '../../components/utilities';

function beautifyName(string) {
    return string
        .split('_')
        .map(ele => {
            return ele[0].toUpperCase() + ele.slice(1);
        })
        .join(' ');
}

class EditProfile extends Component {
    static contextType = MainContext;
    constructor(props) {
        super(props);
        this.field = this.props.route.params;
        this.props.navigation.setOptions({
            title: `Edit ${beautifyName(this.field.fieldName)}`,
        });

        this.state = {
            newvalue: null,
            oldPassword: '',
            loading: false,
        };
    }

    showAlert() {
        Alert.alert('Alert', 'Successfully updated', [
            {
                text: 'OK',
                onPress: () => {
                    this.props.navigation.navigate('profile', {
                        doUpdateProfile: true,
                    });
                },
            },
        ]);
    }

    updateGeneric = async () => {
        this.setState({loading: true});
        const data = {};
        data['mail_id'] = this.context.profile.mail_id;
        data[this.field.fieldName] = this.state.newvalue;
        try {
            const upRes = await API.graphql({
                query: mutations.updateDoctor,
                variables: {input: data},
                authMode: 'API_KEY',
            });
            console.log(upRes);
        } catch (error) {
            console.log(error);
            alert(error?.message || error.errors[0].message);
            this.setState({loading: false});
            return;
        }
        this.setState({loading: false});
        this.showAlert();
    };

    updateGender = async () => {
        if (this.state.newvalue === null) {
            alert('Select Gender');
            return;
        }

        const data = {gender: this.state.newvalue};
        this.setState({loading: true});

        try {
            data['mail_id'] = this.context.profile.mail_id;
            const updateResponse = await API.graphql({
                authMode: 'API_KEY',
                query: mutations.updateUser,
                variables: {input: data},
            });
            console.log('Update response : ', updateResponse);
        } catch (error) {
            console.log(error);
            alert(error.message());
            this.setState({loading: false});
            return;
        }
        this.setState({loading: false});
        this.showAlert();
    };

    updatePhone = async () => {
        this.setState({loading: true});
        const data = {};
        data['mail_id'] = this.context.profile.mail_id;
        data[this.field.fieldName] = this.phoneSelect.getValue();
        console.log(data);
        try {
            // Update with Amplify authentication
            if (this.field.fieldName === 'phone') {
                const user = await Auth.currentAuthenticatedUser();
                const authResponse = await Auth.updateUserAttributes(user, {
                    phone_number: data.phone,
                });
                // console.log(authResponse);
            }
            // Update record in database
            const updateResponse = await API.graphql({
                authMode: 'API_KEY',
                query:
                    this.field.fieldName === 'phone'
                        ? mutations.updateUser
                        : mutations.updateDoctor,
                variables: {input: data},
            });
            // console.log('Update response : ', updateResponse);
        } catch (error) {
            console.log(error);
            alert(error.message);
            this.setState({loading: false});
            return;
        }
        this.setState({loading: false});
        this.showAlert();
    };

    changePassword = async () => {
        this.setState({loading: true});
        try {
            const user = await Auth.currentAuthenticatedUser();
            const response = await Auth.changePassword(
                user,
                this.state.oldPassword,
                this.state.newvalue,
            );
            console.log(response);
        } catch (error) {
            console.log(error);
            alert(error.message);
            this.setState({loading: false});
            return;
        }
        this.setState({loading: false});
        this.showAlert();
    };

    render() {
        let pageContent, callback;

        switch (this.field.fieldName) {
            case 'gender':
                callback = this.updateGender;
                pageContent = (
                    <DropdownComponent
                        dropStyle={styles.genderDrop}
                        maxHeight={175}
                        onChange={value => this.setState({newvalue: value})}
                        data={[
                            {label: 'Male', value: 'male'},
                            {label: 'Female', value: 'female'},
                            {label: 'Other', value: 'other'},
                        ]}
                    />
                );
                break;
            case 'phone':
            case 'clinic_phone':
                callback = this.updatePhone;
                pageContent = (
                    <ReactNativePhoneInput
                        ref={ref => (this.phoneSelect = ref)}
                        style={[styles.phonePicker, styles.smoothShadow]}
                        textStyle={styles.phonePickerText}
                        textProps={{
                            placeholder: 'Phone Number',
                            placeholderTextColor: '#333',
                        }}
                        initialCountry="us"
                        pickerBackgroundColor="#333"
                        autoFormat={true}
                        onChangePhoneNumber={num =>
                            this.setState({newvalue: num})
                        }
                    />
                );
                break;
            case 'password':
                callback = this.changePassword;
                pageContent = (
                    <React.Fragment>
                        <TextInput
                            placeholder="Old Password"
                            placeholderTextColor={'#aaa'}
                            secureTextEntry={true}
                            onChangeText={text =>
                                this.setState({oldPassword: text})
                            }
                            returnKeyType={'next'}
                            style={[styles.loginInput, styles.smoothShadow]}
                        />
                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor={'#aaa'}
                            secureTextEntry={true}
                            onChangeText={text =>
                                this.setState({newvalue: text})
                            }
                            onSubmitEditing={() => this.changePassword()}
                            style={[styles.loginInput, styles.smoothShadow]}
                        />
                    </React.Fragment>
                );
                break;
            case 'clinic_name':
            case 'clinic_address':
            case 'years':
            case 'expertise':
                callback = this.updateGeneric;
                pageContent = (
                    <TextInput
                        placeholder={`Enter ${beautifyName(
                            this.field.fieldName,
                        )}`}
                        placeholderTextColor={'#aaa'}
                        onChangeText={text => this.setState({newvalue: text})}
                        returnKeyType={'next'}
                        style={[styles.loginInput, styles.smoothShadow]}
                    />
                );
                break;
            default:
                break;
        }

        return (
            <View style={styles.editProfContainer}>
                <LoadingModal modalVisible={this.state.loading} />
                {pageContent}
                <TouchableHighlight
                    style={styles.confirmEditButton}
                    onPress={callback}
                    underlayColor="#006f80">
                    <Icon name="checkmark" color="#fff" size={45}></Icon>
                </TouchableHighlight>
            </View>
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <EditProfile {...props} navigation={navigation} />;
}
