import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    TouchableHighlight,
    FlatList,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../Styles';
import {useNavigation} from '@react-navigation/native';
import {MainContext} from '../../components/main-context';
import {defaultPFP} from '../../components/utilities';

// Amplify and AWS API
import {Storage} from '@aws-amplify/storage';
import Amplify, {API} from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';

class SendDoc extends Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalVisible: false,
            audioPath: this.props.route.params,
        };

        this.loadDoctors();
    }

    loadDoctors = async () => {
        try {
            const {data} = await API.graphql({
                query: queries.listDoctors,
                variables: {},
                authMode: 'API_KEY',
            });
            // console.log(data.listDoctors.items);
            this.setState({data: data.listDoctors.items});
        } catch (error) {
            console.log(error);
        }
    };

    handleSend = async index => {
        this.setState({modalVisible: true});
        try {
            console.log(this.state.data[index]);
            let fileName = this.state.audioPath.split('/');
            fileName = fileName[fileName.length - 1];
            const userID = this.context.profile.mail_id;

            // console.log(userID.username, userID.attributes);
            // Convert file to blob
            let file = await fetch(`file://${this.state.audioPath}`);
            file = await file.blob();
            // Send blob to AWS S3
            const res = await Storage.put(
                `recordings/${userID}/${fileName}`,
                file,
            );
            console.log(res);
            // put recording in database
            const recordingData = {
                mail_id: userID,
                user_doctor: this.state.data[index].mail_id,
                timestamp: fileName.slice(2).replace('.wav', ''),
                bucketpath_recording: `public/${res.key}`,
                bucketpath_denoised: null,
                bpm: null,
                comment: null,
                audio_length: null,
            };
            const response = await API.graphql({
                query: mutations.createRecording,
                variables: {input: recordingData},
                authMode: 'API_KEY',
            });
            // console.log(response);
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
                    <Image style={styles.docImage} source={defaultPFP}></Image>
                    <View>
                        <Text style={styles.docName}>
                            {`${props.item.personalInfo.first_name} ${props.item.personalInfo.last_name}`}
                        </Text>
                        <Text>{props.item.expertise}</Text>
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
