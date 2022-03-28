import React, {Component} from 'react';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {Text, View, TouchableHighlight} from 'react-native';
import styles from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import reactNativeFetchBlob from 'react-native-fetch-blob';

function SendButton(props) {
    const navigation = useNavigation();

    return (
        <TouchableHighlight
            style={styles.sendToDocButton}
            onPress={() => navigation.navigate('send-screen')}
            underlayColor={'#007e97'}>
            <Icon name="send" size={24} color={'white'} />
        </TouchableHighlight>
    );
}

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRecording: false,
            finishedRecording: true,
            recordTimeString: '00:00:00',
            isPlaying: false,
            playerActive: false,
            playTime: 0,
            audioLength: 0,
            audioPath: '',
        };
        this.props = props;
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09);
    }

    Player(props) {
        const playing = props.state.isPlaying;
        const callback = playing ? props.pauseCallback : props.playCallback;
        const position = props.state.playTime / props.state.audioLength;

        const pickupSliderCallback = value => {
            props.pauseCallback();
        };

        const releasedSliderCallback = value => {
            try {
                if (value === 0) {
                    props.parent.onStopPlayer();
                    props.playCallback();
                    return;
                }
                const newPosition = Math.floor(value * props.state.audioLength);
                props.parent.audioRecorderPlayer.seekToPlayer(newPosition);
                props.playCallback();
            } catch (error) {
                console.log(error);
            }
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
                    maximumValue={1}
                    minimumTrackTintColor={'#ff5456'}
                    onSlidingStart={pickupSliderCallback}
                    onSlidingComplete={releasedSliderCallback}
                    value={isNaN(position) ? 0 : position}
                    style={styles.slider}></Slider>
                <TouchableHighlight
                    onPress={props.deleteCallback}
                    underlayColor={'#b32022'}
                    style={styles.deleteRecordingButton}>
                    <Icon name="trash" size={24} color={'white'} />
                </TouchableHighlight>
            </View>
        );
    }

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
                    <this.Player
                        playCallback={() => this.onStartPlay()}
                        pauseCallback={() => this.onPause()}
                        deleteCallback={() => this.deleteRecording()}
                        enabled={this.state.finishedRecording}
                        state={this.state}
                        parent={this}
                    />
                    <SendButton func={() => this.sendToDoc()} />
                </View>
            </View>
        );
    }

    sendToDoc() {
        console.log('Sending to Doc...');
    }

    onStartRecord = async () => {
        this.setState({isRecording: true});
        console.log('Started Recording');

        const musicFolder = reactNativeFetchBlob.fs.dirs.MusicDir;
        // const musicFolder = RNFetchBlob.MusicDir;
        // const cacheFolder = RNFetchBlob.fs.dirs.CacheDir;
        const curDate = new Date();
        const hash = `${curDate.getHours()}.${curDate.getMinutes()}.${curDate.getSeconds()}-${curDate.getDate()}.${curDate.getMonth()}.${curDate.getFullYear()}`;
        const path = `${musicFolder}/r-${hash}.mp3`;
        console.log(path);
        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        try {
            const uri = await this.audioRecorderPlayer.startRecorder(
                path,
                audioSet,
            );
            console.log(`uri: ${uri}`);
            // Update timer
            this.audioRecorderPlayer.addRecordBackListener(event => {
                this.setState({
                    recordTimeString: this.audioRecorderPlayer.mmssss(
                        event.currentPosition,
                    ),
                    audioLength: event.currentPosition,
                });
            });
            this.setState({audioPath: path});
        } catch (error) {
            console.log(error);
        }
    };

    onStopRecord = async () => {
        console.log('Stopped Recording');
        try {
            const result = await this.audioRecorderPlayer.stopRecorder();
            this.audioRecorderPlayer.removeRecordBackListener;
            this.setState({isRecording: false, finishedRecording: true});
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    onStartPlay = async () => {
        try {
            this.setState({isPlaying: true, playerActive: true});
            const res = await this.audioRecorderPlayer.startPlayer(
                reactNativeFetchBlob.fs.dirs.MusicDir +
                    '/recording - 19.1.21 27.2.2022.mp3',
            );
            console.log(res);
            this.audioRecorderPlayer.addPlayBackListener(event => {
                const progress = event.currentPosition / event.duration;
                if (progress === 1) {
                    this.onStopPlayer();
                } else if (progress === 0) {
                    console.log('Begin');
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
            this.setState({isPlaying: !this.state.isPlaying});
            const res = await this.audioRecorderPlayer.pausePlayer();
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
                isPlaying: false,
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
            const temp = await reactNativeFetchBlob.fs.unlink(
                this.state.audioPath,
            );
            this.setState({audioPath: '', finishedRecording: false});
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
