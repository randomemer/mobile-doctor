import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    TouchableHighlight,
    FlatList,
    Alert,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../Styles';
import {useNavigation} from '@react-navigation/native';
import {MainContext} from '../../components/main-context';
import {LoadingModal, defaultPFP, timeout} from '../../components/utilities';

// Amplify and AWS API
import {Storage} from '@aws-amplify/storage';
import Amplify, {API} from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';

async function notifyMLModel(server_url, bucket_url, id) {
    try {
        console.log(server_url);
        const res = await fetch(server_url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                s3_url: bucket_url,
                email: id,
            }),
        });

        // const j = await res.json();

        // server response
        if (!res.ok) {
            console.log(`Server Error ${res.status} : \n`, res);
            // console.log(j);
            return false;
        }

        return true;
    } catch (error) {
        console.log('Error connecting to server : \n', error);
        throw error;
    }
}

class SendDoc extends Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalVisible: false,
            refreshing: false,
            audioPath: this.props.route.params,
        };
    }

    loadDoctors = async () => {
        this.setState({refreshing: true});
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
        this.setState({refreshing: false});
    };

    handleSend = async index => {
        this.setState({modalVisible: true});
        try {
            let timer = timeout(15 * 1000);

            let fileName = this.state.audioPath.split('/');
            fileName = fileName[fileName.length - 1];
            const userID = this.context.profile.mail_id;

            // Convert file to blob
            let file = await fetch(`file://${this.state.audioPath}`);
            file = await file.blob();

            // Send blob to AWS S3
            const res = await Promise.race([
                Storage.put(`recordings/${userID}/${fileName}`, file),
                timer,
            ]);
            if (!res) {
                throw new Error('Request Timed out');
            }
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
            const response = await Promise.race([
                API.graphql({
                    query: mutations.createRecording,
                    variables: {input: recordingData},
                    authMode: 'API_KEY',
                }),
                timer,
            ]);
            if (!response) {
                throw new Error('Request Timed out');
            }
            console.log(response);

            // Notify the ML model
            const serverResponse = await Promise.race([
                notifyMLModel(
                    `http://${this.context.ip}/inference`,
                    `s3://mobile-doctor-app-storage25650-staging/public/${res.key}`,
                    userID,
                ),
                timer,
            ]);
            if (!serverResponse) {
                throw new Error(`Failed to connect to server`);
            }

            if (timer) {
                clearTimeout(timer);
            }

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
            SimpleToast.show(error.message);
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
                <LoadingModal modalVisible={this.state.modalVisible} />
                <FlatList
                    style={styles.cardList}
                    contentContainerStyle={styles.cardListContainer}
                    data={this.state.data}
                    renderItem={this.card.bind(this)}
                    ItemSeparatorComponent={gap}
                    refreshing={this.state.refreshing}
                    onRefresh={this.loadDoctors}
                />
            </SafeAreaView>
        );
    }

    componentDidMount() {
        this.loadDoctors();
        console.log('IP : ', this.context.ip);
    }
}

// export default SendDoc;
export default function (props) {
    const navigation = useNavigation();
    return <SendDoc {...props} navigation={navigation} />;
}
