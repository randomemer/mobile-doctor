import React, {Component} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AudioRecord from 'react-native-audio-record';
import {
    Text,
    View,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import styles from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import reactNativeFetchBlob from 'react-native-fetch-blob';

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
            underlayColor={'#007e97'}>
            <Icon name="send" size={24} color={'white'} />
        </TouchableHighlight>
    );
}

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recordTimeString: '00:00',
            isRecording: false,
            recordTime: 0,
            // audioPath: '/storage/emulated/0/Music/recording.mp3',
            audioPath: '',
            finishedRecording: false, // change it back to false later
            audioLength: 0,
            isPlaying: false,
            playTime: 0,
            playerActive: false,
            sliding: false,
            sliderValue: 0,
        };
        this.initialState = this.state;
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09);

        askPerms();
    }

    updateTimer() {
        const minutes = (this.state.recordTime / 60).toFixed(0);
        const seconds = this.state.recordTime % 60;
        const timerString = `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
        this.setState({recordTimeString: timerString});
    }

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
            <View style={styles.audioPlayer}>
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
                    underlayColor={'#b32022'}
                    style={styles.deleteRecordingButton}>
                    <Icon name="trash" size={24} color={'white'} />
                </TouchableHighlight>
            </View>
        );
    };

    render() {
        const recordBtnCallback = this.state.isRecording
            ? () => this.onStopRecord()
            : () => this.onStartRecord();
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
        const path = `${musicFolder}/r-${hash}.wav`;
        console.log(path);

        const options = {
            sampleRate: 44100, // default 44100
            channels: 1, // 1 or 2, default 1
            bitsPerSample: 16, // 8 or 16, default 16
            audioSource: 1, // android only
            wavFile: `r-${hash}.wav`,
        };

        AudioRecord.init(options);
        AudioRecord.start();
        // AudioRecord.on('data', data => {
        //     console.log(data);
        // });

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
            const exist = await reactNativeFetchBlob.fs.exists(
                this.state.audioPath,
            );
            if (!exist) {
                console.log('File does not exist.');
                return;
            }
            await reactNativeFetchBlob.fs.unlink(this.state.audioPath);
            this.setState(this.initialState);
        } catch (error) {
            console.log(error);
        }
    };

    componentWillUnmount() {
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
