import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    SafeAreaView,
    Image,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import styles from '../Styles';

function extractTime(string) {
    const [time, date] = string.split('-');

    const [hrs, min, sec] = time.split('.');
    const [day, month, year] = date.split('.');

    return new Date(year, month - 1, day, hrs, min, sec).toLocaleString();
}

const defaultPFP = require('../../assets/default-pfp.jpg');

class HistoryDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.route.params;
        const responded = data.comment === null;
        console.log(data);
        return (
            <View style={styles.detailsContainer}>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Icon
                            name="send"
                            style={styles.rowIcon}
                            size={30}></Icon>
                        <Text style={styles.rowTitleText}>DOCTOR</Text>
                    </View>
                    <View style={[styles.card, {alignSelf: 'flex-start'}]}>
                        <Image style={styles.docImage} source={defaultPFP} />
                        <View>
                            <Text style={styles.docName}>
                                {`${data.doctorInfo.first_name} ${data.doctorInfo.last_name}`}
                            </Text>
                            <Text>{data.doctorInfo.phone}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Icon
                            name="cloud"
                            style={styles.rowIcon}
                            size={30}></Icon>
                        <Text style={styles.rowTitleText}>Status</Text>
                    </View>
                    <Text style={styles.rowInfoText}>
                        {data.comment === null
                            ? 'Waiting for response from your doctor'
                            : 'Doctor has responded'}
                    </Text>
                </View>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Icon
                            name="calendar"
                            style={styles.rowIcon}
                            size={30}></Icon>
                        <Text style={styles.rowTitleText}>Date Sent</Text>
                    </View>
                    <Text style={styles.rowInfoText}>
                        {extractTime(data.timestamp)}
                    </Text>
                </View>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Icon
                            name="search"
                            style={styles.rowIcon}
                            size={30}></Icon>
                        <Text style={styles.rowTitleText}>Our Analysis</Text>
                    </View>
                    <Text style={styles.rowInfoText}>{`BPM : ${
                        data.bpm
                    }, Condition : ${''}`}</Text>
                </View>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Icon
                            name="chatbox"
                            style={styles.rowIcon}
                            size={30}></Icon>
                        <Text style={styles.rowTitleText}>
                            Doctor's Response
                        </Text>
                    </View>
                    <Text style={styles.rowInfoText}>{data.comment}</Text>
                </View>
            </View>
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <HistoryDetails {...props} navigation={navigation} />;
}
