import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    PermissionsAndroid,
    TouchableOpacity,
    TouchableHighlight,
    Image,
} from 'react-native';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-fetch-blob';
import styles from './Styles';

(async () => {
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
                console.log('Permissions granted');
            } else {
                console.log('All required permissions not granted');
                return;
            }
        } catch (err) {
            console.warn(err);
            return;
        }
    }
})();

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.userIcon = require('./assets/person.png');
        this.pwdIcon = require('./assets/lock-closed.png');
        this.heartIcon = require('./assets/heart-icon.png');
        console.log(this.props);
    }

    handleLogin() {
        console.log('Trying to login...');
        this.props.login();
    }

    render() {
        return (
            <View style={styles.loginContainer}>
                <View style={styles.loginTopArea}>
                    <Image style={styles.heartIcon} source={this.heartIcon} />
                    <View style={styles.inputFields}>
                        <View style={styles.loginRow}>
                            <Image
                                style={styles.loginIcons}
                                source={this.userIcon}
                            />
                            <TextInput
                                textContentType="username"
                                placeholder="Phone Number"
                                placeholderTextColor={'grey'}
                                style={styles.loginInput}></TextInput>
                        </View>
                        <View style={styles.loginRow}>
                            <Image
                                style={styles.loginIcons}
                                source={this.pwdIcon}
                            />
                            <TextInput
                                textContentType="password"
                                placeholder="Password"
                                secureTextEntry={true}
                                placeholderTextColor={'grey'}
                                style={styles.loginInput}></TextInput>
                        </View>
                    </View>
                </View>
                <TouchableHighlight
                    onPress={() => this.handleLogin()}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

class RecordView extends Component {
    constructor(props) {
        super(props);

        this.state = {isRecording: false, recordTime: '00:00:00'};

        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09);
        this.micIcon = require('./assets/mic-outline.png');
        this.stopIcon = require('./assets/stop-circle-outline.png');
    }

    render() {
        const btnCallback = this.state.isRecording
            ? () => this.onStopRecord()
            : () => this.onStartRecord();
        const btnIcon = this.state.isRecording ? this.stopIcon : this.micIcon;

        return (
            <View style={styles.container}>
                <View style={styles.recordArea}>
                    <Text style={styles.timer}>{this.state.recordTime}</Text>
                    <TouchableOpacity
                        style={styles.recordButton}
                        onPress={btnCallback}>
                        <Image
                            source={btnIcon}
                            style={styles.recordButtonIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onStartRecord = async () => {
        this.setState({isRecording: true});
        console.log('Started Recording');

        const musicFolder = RNFetchBlob.fs.dirs.MusicDir;
        // const cacheFolder = RNFetchBlob.fs.dirs.CacheDir;
        const path = musicFolder + '/recorde.mp3';
        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        console.log('audioSet', audioSet);
        try {
            const uri = await this.audioRecorderPlayer.startRecorder(
                path,
                audioSet,
            );
            console.log(`uri: ${uri}`);
            // Update timer
            this.audioRecorderPlayer.addRecordBackListener(event => {
                this.setState({
                    recordTime: this.audioRecorderPlayer.mmssss(
                        event.currentPosition,
                    ),
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    onStopRecord = async () => {
        this.setState({isRecording: false});
        console.log('Stopped Recording');
        try {
            const result = await this.audioRecorderPlayer.stopRecorder();
            this.audioRecorderPlayer.removeRecordBackListener;
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {isLogged: false};
    }

    login() {
        this.setState({isLogged: true});
    }

    render() {
        const screen = this.state.isLogged ? (
            <RecordView />
        ) : (
            <LoginView login={() => this.login()} />
        );

        return <View style={styles.container}>{screen}</View>;
    }
}

export default App;
