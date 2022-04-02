// React Components
import React, {Component} from 'react';
import {Image, Text, View, Alert, TouchableOpacity} from 'react-native';
import styles from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LoadingModal from '../components/loading-modal';

// AWS APIs
import * as queries from '../graphql/queries';
import Amplify, {Auth, API} from 'aws-amplify';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profileLoading: false,
            userData: {},
            loading: true,
        };

        this.loadProfileData();
    }

    loadProfileData = async () => {
        this.setState({loading: true});
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
            this.setState({loading: false});
        }
        this.setState({loading: false});
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
                <LoadingModal modalVisible={this.state.loading} />
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

    componentDidUpdate(prevProps) {
        console.log('Previous Props', prevProps);
        console.log(this.props);
        if (this.props.route?.params?.doUpdateProfile) {
            console.log('Updated', this.props.route);
            this.props.route.params.doUpdateProfile = false;
            this.loadProfileData();
        }
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <Profile {...props} navigation={navigation} />;
}
