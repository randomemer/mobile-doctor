// React Components
import React, {Component} from 'react';
import {Image, Text, View, Alert, TouchableOpacity} from 'react-native';
import styles from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

// AWS APIs
import * as queries from '../graphql/queries';
import Amplify, {Auth, API} from 'aws-amplify';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profileLoading: false,
            userData: {
                first_name: 'Shashank',
                gender: null,
                is_doctor: false,
                last_name: 'Pathipati',
                mail_id: 'pshashank569@gmail.com',
                phone: '+919500062931',
            },
        };
        // this.loadProfileData();
    }

    loadProfileData = async () => {
        try {
            const {attributes} = await Auth.currentAuthenticatedUser();
            const username = attributes.email;
            const {data} = await API.graphql({
                query: queries.getUser,
                variables: {mail_id: username},
                authMode: 'API_KEY',
            });
            console.log(data);
            this.setState({userData: data.getUser});
        } catch (error) {
            console.log(error);
        }
    };

    profileField = props => {
        const editButton = props.editable ? (
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => this.editField({fieldName: props.field})}>
                <Icon name="create-outline" color={'gray'} size={28}></Icon>
            </TouchableOpacity>
        ) : undefined;
        return (
            <View style={styles.profileField}>
                <Icon
                    name={props.iconName}
                    size={28}
                    color="#ff5456"
                    style={styles.profileFieldIcon}></Icon>
                <Text style={styles.profileFieldText}>{props.content}</Text>
                {editButton}
            </View>
        );
    };

    editField = field => {
        this.props.navigation.navigate('edit-profile', field);
    };

    render() {
        return (
            <SafeAreaView style={styles.profileContainer}>
                <View style={styles.profileCard}>
                    <Image style={styles.profileImage}></Image>
                    <Text
                        style={
                            styles.profileText
                        }>{`${this.state.userData.first_name} ${this.state.userData.last_name}`}</Text>
                </View>
                <View style={styles.profileInfo}>
                    <this.profileField
                        field="mail_id"
                        iconName="mail"
                        content={this.state.userData.mail_id}
                    />
                    <this.profileField
                        field="password"
                        iconName="key"
                        content={'••••••••'}
                        editable={true}
                    />
                    <this.profileField
                        field="phone"
                        iconName="call"
                        content={this.state.userData.phone}
                        editable={true}
                    />
                    <this.profileField
                        field="gender"
                        iconName="information-circle"
                        content={`Gender : ${
                            this.state.userData.gender
                                ? this.state.userData.gender
                                : ''
                        }`}
                        editable={true}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <Profile {...props} navigation={navigation} />;
}
