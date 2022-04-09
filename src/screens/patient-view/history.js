import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    SafeAreaView,
    Image,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {MainContext} from '../../components/main-context';
import {extractTime, extractDateObject} from '../../components/utilities';
import styles, {colors} from '../../Styles';

// AWS APIs
import * as queries from '../../graphql/queries';
import Amplify, {API} from 'aws-amplify';

class History extends Component {
    static contextType = MainContext;
    constructor(props) {
        super(props);
        this.state = {interactions: [], refreshing: false};
    }

    loadHistory = async () => {
        // console.log(this.context);
        this.setState({refreshing: true});
        try {
            const {data} = await API.graphql({
                query: queries.listRecordings,
                variables: {
                    filter: {mail_id: {contains: this.context.profile.mail_id}},
                },
                authMode: 'API_KEY',
            });
            // console.log(data.listRecordings.items);

            const sort = data.listRecordings.items.sort((a, b) => {
                const aDate = extractDateObject(a.timestamp);
                const bDate = extractDateObject(b.timestamp);
                return aDate < bDate;
            });
            this.setState({interactions: sort});
            // console.log(sort);

            extractTime(data.listRecordings.items[0].timestamp);
        } catch (error) {
            console.log(error);
        }
        this.setState({refreshing: false});
    };

    interactionCard(props) {
        const curStatus = props.item.comment === null ? 'Pending' : 'Reviewed';

        const bgColor =
            curStatus === 'Pending'
                ? colors.yellowMunsel
                : colors.lightSeaGreen;
        const activeBgColor =
            curStatus === 'Pending'
                ? colors.yellowMunselDim
                : colors.lightSeaGreenDim;

        return (
            <TouchableHighlight
                style={[styles.interactionCard, {backgroundColor: bgColor}]}
                key={props.index}
                onPress={this.showDetails.bind(this, props.index)}
                underlayColor={activeBgColor}>
                <React.Fragment>
                    <View style={styles.docNameRow}>
                        <Text style={styles.docNameText}>
                            {`${props.item.doctorInfo?.first_name} ${props.item.doctorInfo?.last_name}`}
                        </Text>
                    </View>
                    <View style={[styles.infoRow, {marginBottom: 7.5}]}>
                        <Icon
                            name="cloud"
                            size={16}
                            color={'#fff'}
                            style={styles.infoRowIcon}></Icon>
                        <Text style={styles.infoRowText}>{curStatus}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon
                            name="calendar"
                            size={16}
                            color={'#fff'}
                            style={styles.infoRowIcon}></Icon>
                        <Text style={styles.infoRowText}>
                            {extractTime(props.item.timestamp)}
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
                    ItemSeparatorComponent={gap}
                    refreshing={this.state.refreshing}
                    onRefresh={this.loadHistory}
                />
            </SafeAreaView>
        );
    }

    showDetails(index) {
        this.props.navigation.navigate(
            'details-screen',
            this.state.interactions[index],
        );
    }

    componentDidMount() {
        // To make sure the context is not undefined before fetching results
        this.loadHistory();
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <History {...props} navigation={navigation} />;
}
