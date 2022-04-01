import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    FlatList,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../Styles';
import {useNavigation} from '@react-navigation/native';

// Amplify and AWS API
import {Storage} from '@aws-amplify/storage';
import Amplify, {Auth, API} from 'aws-amplify';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';

const docs = [];
for (let i = 0; i < 10; i++) {
    docs.push({title: 'Example Doctor', work: 'Brief Description'});
}

class SendDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: docs,
            modalVisible: false,
            audioPath: this.props.route.params,
        };
    }

    handleSend = async index => {
        this.setState({modalVisible: true});
        try {
            let fileName = this.state.audioPath.split('/');
            fileName = fileName[fileName.length - 1];
            const userID = await Auth.currentAuthenticatedUser();
            // console.log(userID.username, userID.attributes);
            // Convert file to blob
            let file = await fetch(`file://${this.state.audioPath}`);
            file = await file.blob();
            // Send blob to AWS S3
            const res = await Storage.put(
                `recordings/${userID.attributes.email}/${fileName}`,
                file,
            );
            console.log(res);
            // put recording in database
            const curDate = new Date();
            const {attributes} = await Auth.currentAuthenticatedUser();
            const recordingData = {
                mail_id: attributes.email,
                timestamp: `${curDate.getHours()}.${curDate.getMinutes()}.${curDate.getSeconds()}-${curDate.getDate()}.${curDate.getMonth()}.${curDate.getFullYear()}`,
                bucketpath_recording: `public/${res.key}`,
                bucketpath_denoised: null,
                pulse: null,
                user_doctor: 'mydoc@gmail.com',
            };
            const response = API.graphql({
                query: mutations.createRecording,
                variables: {input: recordingData},
                authMode: 'API_KEY',
            });
            console.log(response);
            // Show modal dialog
            Alert.alert(
                'Successfully Sent!',
                'Your doctor will respond to you soon.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            this.props.navigation.navigate('record-screen', {
                                test: 'Hello from another world',
                            });
                        },
                    },
                ],
                {
                    onDismiss: () => {
                        this.props.navigation.navigate('record-screen', {
                            test: 'Hello from another world',
                        });
                    },
                },
            );
        } catch (error) {
            console.log(error);
        }
        this.setState({modalVisible: false});
    };

    card(props) {
        return (
            <TouchableHighlight
                style={styles.card}
                key={props.index}
                onPress={() => this.handleSend(props.index)}
                underlayColor="#6d59cc">
                <React.Fragment>
                    <View style={styles.docImage}></View>
                    <View>
                        <Text style={styles.docName}>{props.item.title}</Text>
                        <Text>{props.item.work}</Text>
                    </View>
                </React.Fragment>
            </TouchableHighlight>
        );
    }

    render() {
        const gap = () => <View style={styles.cardGap}></View>;

        return (
            <SafeAreaView style={styles.docContainer}>
                <Modal transparent={true} visible={this.state.modalVisible}>
                    <View style={styles.modalBoxWrapper}>
                        <ActivityIndicator size={'large'} color={'limegreen'} />
                    </View>
                </Modal>
                <FlatList
                    style={styles.cardList}
                    contentContainerStyle={styles.cardListContainer}
                    data={this.state.data}
                    renderItem={this.card.bind(this)}
                    ItemSeparatorComponent={gap}
                />
            </SafeAreaView>
        );
    }
}

// export default SendDoc;
export default function (props) {
    const navigation = useNavigation();
    return <SendDoc {...props} navigation={navigation} />;
}
