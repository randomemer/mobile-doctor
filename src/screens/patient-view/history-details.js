import React, {Component} from 'react';
import {Platform, Text, View, Image, FlatList, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../../Styles';
import {extractTime, defaultPFP, analyseBPM} from '../../components/utilities';

class HistoryDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.route.params;
        const responded = data.comment !== null;
        // console.log(data);
        return (
            <SafeAreaView style={styles.doctorResponseContainer}>
                <ScrollView style={styles.doctorResponseScroll}>
                    <View style={styles.infoCard}>
                        <View style={styles.titleRow}>
                            <Icon
                                name="send"
                                style={styles.rowIcon}
                                size={30}></Icon>
                            <Text style={styles.rowTitleText}>DOCTOR</Text>
                        </View>
                        <View style={[styles.card, {alignSelf: 'flex-start'}]}>
                            <Image
                                style={styles.docImage}
                                source={defaultPFP}
                            />
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
                            {!responded
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
                            <Text style={styles.rowTitleText}>
                                Our Analysis
                            </Text>
                        </View>
                        <Text
                            style={
                                styles.rowInfoText
                            }>{`BPM : ${data.bpm}`}</Text>
                        <Text
                            style={
                                styles.rowInfoText
                            }>{`Condition : ${analyseBPM(data.bpm)}`}</Text>
                    </View>
                    {responded ? (
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
                            <Text style={styles.rowInfoText}>
                                {data.comment}
                            </Text>
                        </View>
                    ) : undefined}
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <HistoryDetails {...props} navigation={navigation} />;
}
