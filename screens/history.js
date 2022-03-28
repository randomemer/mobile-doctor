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

const interactions = [];
for (let index = 0; index < 10; index++) {
    interactions.push({
        status: index > 6 ? 'Pending' : 'Resolved',
        doctorInfo: {name: 'B. Ranganathan', desc: 'Info about the doctor'},
        time: new Date().toLocaleString(),
        analysis: `Pulse : 89, State: Normal`,
        comments:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    });
}
interactions.reverse();

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {interactions: interactions};
    }

    interactionCard(props) {
        const bgColor = props.item.status === 'Pending' ? '#F49F0A' : '#00A6A6';
        const activeBgColor =
            props.item.status === 'Pending' ? '#ab6f07' : '#007474';

        return (
            <TouchableHighlight
                style={[styles.interactionCard, {backgroundColor: bgColor}]}
                key={props.index}
                onPress={this.showDetails.bind(this, props.index)}
                underlayColor={activeBgColor}>
                <React.Fragment>
                    <View style={styles.docNameRow}>
                        <Text style={styles.docNameText}>
                            {props.item.doctorInfo.name}
                        </Text>
                    </View>
                    <View style={[styles.infoRow, {marginBottom: 7.5}]}>
                        <Icon
                            name="cloud"
                            size={16}
                            color={'#fff'}
                            style={styles.infoRowIcon}></Icon>
                        <Text style={styles.infoRowText}>
                            {props.item.status}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon
                            name="calendar"
                            size={16}
                            color={'#fff'}
                            style={styles.infoRowIcon}></Icon>
                        <Text style={styles.infoRowText}>
                            {props.item.time}
                        </Text>
                    </View>
                </React.Fragment>
            </TouchableHighlight>
        );
    }

    render() {
        const gap = () => <View style={styles.cardGap}></View>;
        return (
            <SafeAreaView>
                <FlatList
                    data={this.state.interactions}
                    contentContainerStyle={styles.interactionsContainer}
                    renderItem={this.interactionCard.bind(this)}
                    ItemSeparatorComponent={gap}></FlatList>
            </SafeAreaView>
        );
    }

    showDetails(index) {
        this.props.navigation.navigate(
            'details-screen',
            this.state.interactions[index],
        );
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <History {...props} navigation={navigation} />;
}
