// React Components
import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import styles from '../../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainContext} from '../../components/main-context.js';
import {LoadingModal, defaultPFP} from '../../components/utilities';

// AWS APIs
import * as queries from '../../graphql/queries';
import Amplify, {API} from 'aws-amplify';

class Profile extends Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        this.state = {
            profileLoading: false,
            userData: {},
            loading: true,
        };
    }

    loadProfileData = async () => {
        this.setState({loading: true});
        let user;
        try {
            if (this.context.profile.is_doctor) {
                const {data: docData} = await API.graphql({
                    query: queries.fetchDoctor,
                    variables: {mail_id: this.context.profile.mail_id},
                    authMode: 'API_KEY',
                });
                user = {
                    ...docData.fetchDoctor,
                    ...docData.fetchDoctor.personalInfo,
                };
                delete user.personalInfo;
            } else {
                const {data} = await API.graphql({
                    query: queries.getUser,
                    variables: {mail_id: this.context.profile.mail_id},
                    authMode: 'API_KEY',
                });
                user = data.getUser;
            }
            // console.log(data);
            this.setState({userData: user});
        } catch (error) {
            console.log(error);
            this.setState({loading: false});
        }
        this.setState({loading: false});
    };

    editField = field => {
        this.props.navigation.navigate('edit-profile', field);
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

    render() {
        const doc = this.state.userData.is_doctor ? (
            <View style={styles.doctorInfo}>
                <this.profileField
                    field="expertise"
                    iconName="medkit"
                    content={this.state.userData.expertise}
                    editable={true}
                />
                <this.profileField
                    field="years"
                    iconName="calendar"
                    content={`${this.state.userData.years} Years Experience`}
                    editable={true}
                />
                <this.profileField
                    field="clinic_name"
                    iconName="briefcase"
                    content={this.state.userData.clinic_name}
                    editable={true}
                />
                <this.profileField
                    field="clinic_phone"
                    iconName="call"
                    content={this.state.userData.clinic_phone}
                    editable={true}
                />
                <this.profileField
                    field="clinic_address"
                    iconName="location"
                    content={this.state.userData.clinic_address}
                    editable={true}
                />
            </View>
        ) : undefined;

        return (
            <SafeAreaView style={styles.profileContainer}>
                <ScrollView
                    ref={ref => (this.sv = ref)}
                    style={styles.profileScrollView}
                    contentContainerStyle={styles.profileScrollViewContainer}>
                    <LoadingModal modalVisible={this.state.loading} />
                    <View style={styles.profileCard}>
                        <Image
                            style={styles.profileImage}
                            source={defaultPFP}></Image>
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
                    {doc}
                </ScrollView>
            </SafeAreaView>
        );
    }

    componentDidMount() {
        this.loadProfileData();
    }

    componentDidUpdate() {
        if (this.props.route?.params?.doUpdateProfile) {
            this.props.route.params.doUpdateProfile = false;
            this.loadProfileData();
        }
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <Profile {...props} navigation={navigation} />;
}
