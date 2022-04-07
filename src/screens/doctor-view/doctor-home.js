import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    FlatList,
    Image,
    Modal,
    Alert,
    ActivityIndicator,
    SectionList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../../Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {MainContext} from '../../components/main-context';
import {
    extractTime,
    defaultPFP,
    compareDates,
} from '../../components/utilities';

// AWS APIs
import * as queries from '../../graphql/queries';
import Amplify, {Auth, API} from 'aws-amplify';

class DoctorHome extends Component {
    static contextType = MainContext;
    constructor(props) {
        super(props);

        this.state = {refreshing: false};

        this.sections = [
            {title: 'Pending', data: []},
            {title: 'Reviewed', data: []},
        ];
    }

    getRequests = async () => {
        this.setState({refreshing: true});
        try {
            const {data} = await API.graphql({
                query: queries.listRecordingsToDoctor,
                variables: {
                    filter: {
                        user_doctor: {contains: this.context.profile.mail_id},
                    },
                },
                authMode: 'API_KEY',
            });
            // console.log(data.listRecordingsToDoctor.items);

            // Could be optimized to single loop
            const pending = data.listRecordingsToDoctor.items.filter(
                item => item.comment === null,
            );
            const reviewed = data.listRecordingsToDoctor.items.filter(
                item => item.comment !== null,
            );

            this.sections = [
                {
                    title: 'Pending',
                    data: pending.sort((a, b) =>
                        compareDates(a.timestamp, b.timestamp),
                    ),
                }, // change back to original order after modifying resolver in cloud
                {
                    title: 'Reviewed',
                    data: reviewed.sort((a, b) =>
                        compareDates(a.timestamp, b.timestamp),
                    ),
                },
            ];
            // this.setState({dummyUpdateVar: !this.state.dummyUpdateVar});
        } catch (error) {
            console.log(error);
        }
        this.setState({refreshing: false});
    };

    respond(item) {
        this.props.navigation.navigate('respond-screen', item);
    }

    sectionHeader = props => {
        const {section} = props;
        // console.log(title, props);
        const icon =
            section.title === 'Pending' ? (
                <Icon
                    name="time"
                    size={32}
                    color={'#ff5456'}
                    style={{marginRight: 15}}></Icon>
            ) : (
                <Icon
                    name="checkmark-circle"
                    size={32}
                    color={'#ff5456'}
                    style={{marginRight: 15}}
                />
            );
        return (
            <View style={styles.docSectionHeader}>
                {icon}
                <Text style={styles.docSectionText}>{section.title}</Text>
            </View>
        );
    };

    itemRenderer = props => {
        const bgColor =
            props.section.title === 'Pending' ? '#F49F0A' : '#00A6A6';
        const activeBgColor =
            props.section.title === 'Pending' ? '#ab6f07' : '#007474';

        return (
            <TouchableHighlight
                style={[styles.docRequestCard, {backgroundColor: bgColor}]}
                key={props.index}
                onPress={() => this.respond(props.item)}
                underlayColor={activeBgColor}>
                <React.Fragment>
                    <Image style={styles.docImage} source={defaultPFP}></Image>
                    <View>
                        <Text style={styles.docName}>
                            {`${props.item.userInfo.first_name} ${props.item.userInfo.last_name}`}
                        </Text>
                        <Text>{extractTime(props.item.timestamp)}</Text>
                    </View>
                </React.Fragment>
            </TouchableHighlight>
        );
    };

    render() {
        const title = () => (
            <Text style={styles.docWelcomeText}>
                Welcome, {this.context.profile.first_name}!
            </Text>
        );
        const itemGap = () => <View style={{height: 20}}></View>;
        const sectionGap = () => <View style={{height: 35}}></View>;

        return (
            <SafeAreaView style={styles.docHomeContainer}>
                <SectionList
                    sections={this.sections}
                    keyExtractor={(item, index) =>
                        index.toString() + item.section
                    }
                    renderSectionHeader={this.sectionHeader}
                    renderItem={this.itemRenderer}
                    ItemSeparatorComponent={itemGap}
                    SectionSeparatorComponent={sectionGap}
                    style={styles.doctorRequests}
                    ListHeaderComponent={title}
                    refreshing={this.state.refreshing}
                    onRefresh={this.getRequests}
                />
            </SafeAreaView>
        );
    }

    componentDidMount() {
        this.getRequests();
    }
}

export default function (props) {
    const navigation = useNavigation();
    return <DoctorHome {...props} navigation={navigation} />;
}
