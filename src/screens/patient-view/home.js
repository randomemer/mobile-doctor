import React, {Component} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AudioRecord from 'react-native-audio-record';
import {
    Text,
    View,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
    ScrollView,
    Modal,
    Alert,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import styles, {colors} from '../../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import reactNativeFetchBlob from 'react-native-fetch-blob';
import {timeout} from '../../components/utilities';

async function askPerms() {
    if (Platform.OS === 'android') {
        try {
            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);

            // console.log('write external stroage', grants);

            if (
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
            ) {
                SimpleToast.show('Permissions Granted');
            } else {
                console.log('permissions not granted');
                return;
            }
        } catch (err) {
            console.warn(err);
            return;
        }
    }
}

function SendButton(props) {
    const navigation = useNavigation();
    return (
        <TouchableHighlight
            style={styles.sendToDocButton}
            onPress={() => navigation.navigate('send-screen', props.audiofile)}
            underlayColor={colors.pacificBlueDim}>
            <Icon name="send" size={24} color={'white'} />
        </TouchableHighlight>
    );
}

async function AsyncDeleteAlert() {
    return new Promise(resolve => {
        Alert.alert(
            'Delete Recording?',
            '',
            [
                {
                    text: 'cancel',
                    onPress: () => {
                        resolve(false);
                    },
                },
                {
                    text: 'delete',
                    onPress: () => {
                        resolve(true);
                    },
                },
            ],
            {cancelable: false},
        );
    });
}
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            audioPath: '',
            recordTimeString: '00:00',
            recordTime: 0,
            playTime: 0,
            countdown: 3,
            // audioPath: '/storage/emulated/0/Music/recording.mp3',
            sliderValue: 0,
            audioLength: 0,
            // status variables
            isRecording: false,
            finishedRecording: false, // change it back to false later
            isPlaying: false,
            playerActive: false,
            sliding: false,
            counting: false,
        };
        this.initialState = this.state;
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09);

        askPerms();
    }

    updateTimer() {
        const minutes = Math.floor(this.state.recordTime / 60);
        const seconds = this.state.recordTime % 60;
        const timerString = `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
        this.setState({recordTimeString: timerString});

        if (this.state.recordTime === 30) {
            this.onStopRecord();
        }
    }

    startCountdown = async () => {
        if (this.state.finishedRecording) {
            const reply = await this.deleteRecording();
            if (!reply) {
                return;
            }
        }
        this.setState({countdown: 3, counting: true});
        for (let index = 0; index < 3; index++) {
            await timeout(1000);
            this.setState({countdown: this.state.countdown - 1});
        }
        this.setState({counting: false});
        this.onStartRecord();
    };

    Player = props => {
        const playing = this.state.isPlaying;
        const callback = this.state.playerActive
            ? this.onPause
            : this.onStartPlay;

        const pickupSliderCallback = value => {
            this.setState({sliding: true});
        };

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
            <View style={[styles.audioPlayer]}>
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
                <Slider
                    minimumValue={0}
                    maximumValue={this.state.audioLength}
                    onSlidingStart={pickupSliderCallback}
                    onSlidingComplete={releasedSliderCallback}
                    value={this.state.playTime}
                    style={styles.slider}></Slider>
                <TouchableHighlight
                    onPress={() => this.deleteRecording()}
                    underlayColor={colors.mainThemeDim}
                    style={styles.deleteRecordingButton}>
                    <Icon name="trash" size={24} color={'white'} />
                </TouchableHighlight>
            </View>
        );
    };

    Tip = props => {
        return (
            <View style={styles.tipBox}>
                <Icon
                    name="information-circle"
                    color={'white'}
                    size={30}
                    style={styles.tipIcon}
                />
                <Text style={styles.tipText}>{props.content}</Text>
            </View>
        );
    };

    render() {
        const recordBtnCallback = this.state.isRecording
            ? () => this.onStopRecord()
            : () => this.startCountdown();
        const btnIcon = this.state.isRecording ? (
            <Icon
                name="stop-outline"
                size={50}
                color={'white'}
                style={styles.recordButtonIcon}
            />
        ) : (
            <Icon
                name="mic-outline"
                size={50}
                color={'white'}
                style={styles.recordButtonIcon}
            />
        );

        return (
            <View style={styles.container}>
                <Modal transparent={true} visible={this.state.counting}>
                    <View style={styles.countdownModal}>
                        <Text style={styles.countdownText}>
                            {this.state.countdown}
                        </Text>
                    </View>
                </Modal>
                <Text style={styles.recordScreenTitle}>
                    Record Your Heart Beat!
                </Text>
                <View style={styles.recordArea}>
                    <TouchableHighlight
                        style={styles.recordButton}
                        onPress={recordBtnCallback}
                        underlayColor={'#b32022'}>
                        {btnIcon}
                    </TouchableHighlight>
                    <Text style={styles.timer}>
                        {this.state.recordTimeString}
                    </Text>
                </View>

                <View
                    pointerEvents={
                        this.state.finishedRecording ? 'auto' : 'none'
                    }
                    style={[
                        styles.recordActionsBar,
                        this.state.finishedRecording ? {} : {opacity: 0.7},
                    ]}>
                    <this.Player enabled={this.state.finishedRecording} />
                    <SendButton audiofile={this.state.audioPath} />
                </View>
                <View style={styles.tipsBox}>
                    <Text style={styles.tipTitle}>Some tips :</Text>
                    <ScrollView style={styles.tipsScrollBox}>
                        <this.Tip
                            content={`Before you start, make sure you're in a place with minimal external noise.`}
                        />
                        <this.Tip
                            content={`Keep your phone's microphone as close as possible to your chest. Consider removing your phone cover and clothing if neccessary`}
                        />
                        <this.Tip
                            content={`Press the mic button to start recording. A short countdown will start to help you get ready.`}
                        />
                        <this.Tip
                            content={`You can record upto 30 seconds. When you're done, you can listen to your recording before sending to us. If you think your recording isn't perfect, you can delete it and record it again.`}
                        />
                    </ScrollView>
                </View>
            </View>
        );
    }

    onStartRecord = async () => {
        this.setState({isRecording: true});
        console.log('Started Recording');

        const musicFolder = reactNativeFetchBlob.fs.dirs.MusicDir;
        const curDate = new Date();
        const hash = `${curDate.getHours()}.${curDate.getMinutes()}.${curDate.getSeconds()}-${curDate.getDate()}.${
            curDate.getMonth() + 1
        }.${curDate.getFullYear()}`;

        const options = {
            sampleRate: 44100, // default 44100
            channels: 1, // 1 or 2, default 1
            bitsPerSample: 16, // 8 or 16, default 16
            audioSource: 1, // android only
            wavFile: `r-${hash}.wav`,
        };

        AudioRecord.init(options);
        AudioRecord.start();

        this.timer = setInterval(() => {
            this.setState({recordTime: this.state.recordTime + 1});
            this.updateTimer();
        }, 1000);
    };

    onStopRecord = async () => {
        console.log('Stopped Recording');
        try {
            const path = await AudioRecord.stop();
            console.log(path);
            this.setState({
                isRecording: false,
                finishedRecording: true,
                audioPath: path,
            });
            clearInterval(this.timer);
        } catch (error) {
            console.log(error);
        }
    };

    onStartPlay = async () => {
        try {
            this.setState({isPlaying: true, playerActive: true});
            const res = await this.audioRecorderPlayer.startPlayer(
                this.state.audioPath,
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
                    // sliderValue: this.state.isPlaying
                    //     ? event.currentPosition
                    //     : this.state.sliderValue,
                });
                // if (this.state.sliderValue !== this.state.playTime) {
                //     console.log('Conflict', this.state.sliderValue);
                //     this.audioRecorderPlayer.seekToPlayer(
                //         this.state.sliderValue,
                //     );
                // }
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

    deleteRecording = async () => {
        try {
            // Ask confirmation
            this.res = await AsyncDeleteAlert();
            if (!this.res) {
                return false;
            }
            // Stop playing if already playing
            this.audioRecorderPlayer.removePlayBackListener();
            this.audioRecorderPlayer.stopPlayer();
            // Delete file
            const exist = await reactNativeFetchBlob.fs.exists(
                this.state.audioPath,
            );
            if (!exist) {
                console.log('File does not exist.');
            } else {
                await reactNativeFetchBlob.fs.unlink(this.state.audioPath);
            }
            this.setState(this.initialState);
            return true;
        } catch (error) {
            console.log(error);
        }
    };

    componentWillUnmount() {
        console.log('Home unmounted');
        this.audioRecorderPlayer.removePlayBackListener();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.audioRecorderPlayer.stopPlayer();
        this.audioRecorderPlayer.stopRecorder();
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <Home {...props} navigation={navigation} />;
}
