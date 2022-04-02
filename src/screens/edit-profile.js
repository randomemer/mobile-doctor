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
import styles from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import ReactNativePhoneInput from 'react-native-phone-input';
import DropdownComponent from '../components/dropdown';

// AWS APIs
import * as mutations from '../graphql/mutations';
import Amplify, {Auth, API} from 'aws-amplify';
import LoadingModal from '../components/loading-modal';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.field = this.props.route.params;
        this.props.navigation.setOptions({
            title: `Edit ${this.field.fieldName}`,
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

    updateGender = async () => {
        if (this.state.newvalue === null) {
            alert('Select Gender');
            return;
        }

        const data = {gender: this.state.newvalue};
        this.setState({loading: true});

        try {
            const {attributes} = await Auth.currentAuthenticatedUser();
            data['mail_id'] = attributes.email;
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
        const data = {phone: this.phoneSelect.getValue()};
        this.setState({loading: true});
        try {
            const user = await Auth.currentAuthenticatedUser();
            data['mail_id'] = user.attributes.email;
            // Update with Amplify authentication
            const authResponse = await Auth.updateUserAttributes(user, {
                phone_number: data.phone,
            });
            console.log(authResponse);
            // Update record in database
            const updateResponse = await API.graphql({
                authMode: 'API_KEY',
                query: mutations.updateUser,
                variables: {input: data},
            });
            console.log('Update response : ', updateResponse);
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
                            style={styles.loginInput}
                        />
                    </React.Fragment>
                );
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
