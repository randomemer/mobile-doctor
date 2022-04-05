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

class HistoryDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.route.params;
        console.log(data);
        return (
            <View style={styles.detailsContainer}>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Icon
                            name="send"
                            style={styles.rowIcon}
                            size={30}></Icon>
                        <Text style={styles.rowTitleText}>Doctor</Text>
                    </View>
                    <View style={[styles.card, {alignSelf: 'flex-start'}]}>
                        <View style={styles.docImage}></View>
                        <View>
                            <Text style={styles.docName}>
                                {data.doctorInfo.name}
                            </Text>
                            <Text>{data.doctorInfo.desc}</Text>
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
                    <Text style={styles.rowInfoText}>{data.status}</Text>
                </View>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Icon
                            name="calendar"
                            style={styles.rowIcon}
                            size={30}></Icon>
                        <Text style={styles.rowTitleText}>Date Sent</Text>
                    </View>
                    <Text style={styles.rowInfoText}>{data.time}</Text>
                </View>
                <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                        <Icon
                            name="search"
                            style={styles.rowIcon}
                            size={30}></Icon>
                        <Text style={styles.rowTitleText}>Our Analysis</Text>
                    </View>
                    <Text style={styles.rowInfoText}>{data.analysis}</Text>
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
                    <Text style={styles.rowInfoText}>{data.comments}</Text>
                </View>
            </View>
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <HistoryDetails {...props} navigation={navigation} />;
}
