import React, {Component} from 'react';
import {
    Text,
    TextInput,
    View,
    TouchableHighlight,
    Alert,
    ScrollView,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {MainContext} from '../../components/main-context';
import RNFetchBlob from 'react-native-fetch-blob';
import {extractTime} from '../../components/utilities';

// AWS APIs
import * as mutations from '../../graphql/mutations';
import Amplify, {Auth, API} from 'aws-amplify';
import {Storage} from 'aws-amplify';

class RespondView extends Component {
    static contextType = MainContext;
    constructor(props) {
        super(props);

        this.state = {
            ...this.props.route?.params,
            filepath: '',
            audioLength: 0,
            playTime: 0,
            sliderValue: 0,
            commentText: '',
            commentBoxHeight: 0,
            // status
            audioDownloading: false,
            audioReady: false,
            isPlaying: false,
            playerActive: false,
            sliding: false,
            editing: false,
            sending: false,
        };

        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09);
        this.state.filepath = `${RNFetchBlob.fs.dirs.MusicDir}/Mobile Doctor/${this.state.mail_id}-${this.state.timestamp}`;

        if (this.state.comment !== null) {
            this.state.commentText = this.state.comment;
        }
    }

    downloadAudio = async () => {
        this.setState({audioDownloading: true});
        try {
            // Check file already downloaded
            const exist = await RNFetchBlob.fs.exists(this.state.filepath);
            if (exist) {
                console.log('Already downloaded');
                this.setState({audioReady: true, audioDownloading: false});
                return;
            }

            // Getting audio file from bucket
            const bucketPath = this.state.bucketpath_denoised.slice(
                this.state.bucketpath_denoised.indexOf('denoised'),
            );
            // console.log(bucketPath);

            // Download file
            const audioURL = await Storage.get(bucketPath);
            const filePath = `${RNFetchBlob.fs.dirs.MusicDir}/Mobile Doctor/${this.state.mail_id}-${this.state.timestamp}`;

            const {config} = RNFetchBlob;
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    path: filePath,
                    notification: false,
                    useDownloadManager: true,
                },
            };
            const res = await config(options).fetch('GET', audioURL);
            // console.log(res);

            this.setState({audioReady: true, filepath: filePath});
        } catch (error) {
            console.log(error);
        }
        this.setState({audioDownloading: false});
    };

    confirmSend = () => {
        Keyboard.dismiss();
        Alert.alert('Confirm Send', 'Do you want to submit this response?', [
            {
                text: 'Cancel',
                onPress: () => undefined,
                style: 'cancel',
            },
            {
                text: 'YES',
                onPress: () => this.sendComment(),
            },
        ]);
    };

    sendComment = async () => {
        if (this.state.commentText.trim() === '') {
            alert("You can't send an empty response!");
            return;
        }

        this.setState({editing: false, sending: true});

        try {
            const updateStatus = await API.graphql({
                query: mutations.updateRecording,
                variables: {
                    input: {
                        user_doctor: this.context.profile.mail_id,
                        timestamp: this.state.timestamp,
                        mail_id: this.state.userInfo.mail_id,
                        comment: this.state.commentText,
                    },
                },
                authMode: 'API_KEY',
            });
            console.log(updateStatus);
            this.setState({comment: this.state.commentText});
        } catch (error) {
            console.log(error);
        }
        this.setState({sending: false});
    };

    render() {
        return (
            <SafeAreaView style={styles.doctorResponseContainer}>
                <ScrollView
                    style={styles.doctorResponseScroll}
                    keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.infoSection}>
                        <View style={styles.titleRow}>
                            <Icon
                                name="person"
                                style={styles.rowIcon}
                                size={30}></Icon>
                            <Text style={styles.rowTitleText}>Patient</Text>
                        </View>
                        <View style={styles.patientInfoTextBox}>
                            <Text style={styles.patientInfoText}>{`Name : ${
                                this.state.userInfo.first_name +
                                ' ' +
                                this.state.userInfo.last_name
                            }`}</Text>
                            <Text
                                style={
                                    styles.patientInfoText
                                }>{`Phone : ${this.state.userInfo.phone}`}</Text>
                            <Text style={styles.patientInfoText}>{`Gender : ${
                                this.state.userInfo.gender || 'Not specified'
                            }`}</Text>
                        </View>
                    </View>
                    <View style={styles.infoSection}>
                        <View style={styles.titleRow}>
                            <Icon
                                name="mic"
                                style={styles.rowIcon}
                                size={30}></Icon>
                            <Text style={styles.rowTitleText}>Recording</Text>
                        </View>
                        <this.Player />
                    </View>
                    <View style={styles.infoSection}>
                        <View style={styles.titleRow}>
                            <Icon
                                name="calendar"
                                style={styles.rowIcon}
                                size={30}></Icon>
                            <Text style={styles.rowTitleText}>Received On</Text>
                        </View>
                        <Text style={styles.patientInfoText}>
                            {extractTime(this.state.timestamp)}
                        </Text>
                    </View>
                    <View style={styles.infoSection}>
                        <View style={styles.titleRow}>
                            <Icon
                                name="fitness"
                                style={styles.rowIcon}
                                size={30}></Icon>
                            <Text style={styles.rowTitleText}>
                                BPM (Approx.)
                            </Text>
                        </View>
                        <Text style={styles.patientInfoText}>
                            {this.state.bpm || 'Not calculated yet'}
                        </Text>
                    </View>
                    <View style={styles.infoSection}>
                        <View style={styles.titleRow}>
                            <Icon
                                name="chatbox-ellipses"
                                style={styles.rowIcon}
                                size={30}></Icon>
                            <Text style={styles.rowTitleText}>
                                Your Response
                            </Text>
                            {this.state.sending ? (
                                <ActivityIndicator style={{marginLeft: 15}} />
                            ) : undefined}
                        </View>
                        <View
                            style={[
                                styles.commentArea,
                                this.state.sending
                                    ? {opacity: 0.65}
                                    : undefined,
                            ]}
                            pointerEvents={
                                this.state.sending ? 'none' : 'auto'
                            }>
                            <TextInput
                                ref={ref => (this.commentInput = ref)}
                                value={this.state.commentText}
                                multiline={true}
                                textAlignVertical={'top'}
                                onChangeText={text =>
                                    this.setState({commentText: text})
                                }
                                placeholder={'Type a response...'}
                                placeholderTextColor={'#aaa'}
                                style={[
                                    styles.commentContent,
                                    styles.smoothShadow,
                                    {
                                        height: Math.max(
                                            50,
                                            this.state.commentBoxHeight,
                                        ),
                                    },
                                ]}
                                onContentSizeChange={event => {
                                    this.setState({
                                        commentBoxHeight:
                                            event.nativeEvent.contentSize
                                                .height,
                                    });
                                }}
                            />
                            <TouchableHighlight
                                style={styles.commentButton}
                                onPress={this.confirmSend}
                                underlayColor={'#b33b3c'}>
                                <Icon name="chatbox" size={30} color="white" />
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    Player = props => {
        const playing = this.state.isPlaying;
        const callback = this.state.playerActive
            ? this.onPause
            : this.onStartPlay;

        const pickupSliderCallback = value => {
            this.setState({sliding: true});
        };
        const ready = this.state.audioReady;

        const playButton = this.state.audioDownloading ? (
            <ActivityIndicator />
        ) : (
            <TouchableHighlight
                onPress={callback}
                underlayColor={'rgba(255,255,255,0.3)'}
                style={{borderRadius: 24}}>
                <Icon
                    name={playing ? 'pause-outline' : 'play'}
                    size={35}
                    color={'white'}
                    style={styles.playIcon}
                />
            </TouchableHighlight>
        );

        const releasedSliderCallback = value => {
            try {
                if (value === 0) {
                    this.onStopPlayer();
                    this.onStartPlay();
                    return;
                }

                this.setState({sliding: false, sliderValue: value});
                if (!this.state.playerActive) {
                    this.onStartPlay();
                    if (!this.state.isPlaying) {
                        this.audioRecorderPlayer.pausePlayer();
                    }
                }
                this.audioRecorderPlayer.seekToPlayer(value);
            } catch (error) {
                console.log(error);
            }
            console.log('Slider released');
        };
        return (
            <View
                style={[
                    styles.audioPlayerDoctor,
                    ready ? undefined : {opacity: 0.65},
                ]}
                pointerEvents={ready ? 'auto' : 'none'}>
                {playButton}
                <Slider
                    minimumValue={0}
                    maximumValue={this.state.audioLength}
                    onSlidingStart={pickupSliderCallback}
                    onSlidingComplete={releasedSliderCallback}
                    value={this.state.playTime}
                    style={styles.doctorSlider}
                />
            </View>
        );
    };

    onStartPlay = async () => {
        try {
            this.setState({isPlaying: true, playerActive: true});
            const res = await this.audioRecorderPlayer.startPlayer(
                this.state.filepath,
            );
            console.log(res);
            this.audioRecorderPlayer.addPlayBackListener(event => {
                if (event.currentPosition === event.duration) {
                    this.onStopPlayer();
                    console.log('Player Stopped');
                }
                this.setState({
                    playTime: event.currentPosition,
                    audioLength: event.duration,
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    onPause = async () => {
        try {
            let res;
            if (this.state.isPlaying) {
                res = await this.audioRecorderPlayer.pausePlayer();
            } else {
                res = await this.audioRecorderPlayer.resumePlayer();
            }
            this.setState({isPlaying: !this.state.isPlaying});
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    onStopPlayer() {
        try {
            this.audioRecorderPlayer.stopPlayer();
            this.audioRecorderPlayer.removePlayBackListener();
            this.setState({
                playerActive: false,
                isPlaying: this.state.sliding && this.state.isPlaying,
                playTime: 0,
                audioLength: 0,
            });
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        console.log(this.state);
        this.downloadAudio();
    }

    componentWillUnmount() {
        this.audioRecorderPlayer.removePlayBackListener();
        this.audioRecorderPlayer.stopPlayer();
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <RespondView {...props} navigation={navigation} />;
}
