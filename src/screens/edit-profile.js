// React Components
import React, {Component} from 'react';
import {Image, Text, View, Alert, TouchableHighlight} from 'react-native';
import styles from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

// AWS APIs
import * as mutations from '../graphql/mutations';
import Amplify, {Auth, API} from 'aws-amplify';

class GenderSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <View style={styles.genderSelect}>
                <Text style={styles.rowInfoText}>{this.state.value}</Text>
                <Picker
                    selectedValue={this.state.newvalue}
                    onValueChange={(val, i) => {
                        console.log(val, i);
                        this.setState({value: val});
                        this.props.select(val, i);
                    }}
                    style={{color: 'black', width: 50, height: 25}}
                    modes="dropdown"
                    itemStyle={{color: 'black'}}
                    dropdownIconColor={'black'}>
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                </Picker>
            </View>
        );
    }
}

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.field = this.props.route.params;
        this.state = {
            newvalue: '',
            confirmvalue: '',
            gender: [
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
                {label: 'Other', value: 'other'},
            ],
            open: false,
        };

        this.props.navigation.setOptions({
            title: `Edit ${this.field.fieldName}`,
        });
    }

    updateGender = async () => {
        const data = {gender: this.state.newvalue};
        // data[this.field.fieldName] = ;

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
        }
    };

    render() {
        let pageContent, callback;

        switch (this.field.fieldName) {
            case 'gender':
                callback = this.updateGender;
                pageContent = (
                    <GenderSelect
                        select={(val, i) => this.setState({newvalue: val})}
                    />
                );
                break;
            case 'phone':
                callback = this.updatePhone;
                break;
            default:
                break;
        }

        return (
            <View style={styles.editProfContainer}>
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
