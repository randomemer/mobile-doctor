import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    FlatList,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../Styles';
import {useNavigation} from '@react-navigation/native';

const docs = [];
for (let i = 0; i < 10; i++) {
    docs.push({title: 'Example Doctor', work: 'Brief Description'});
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class SendDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: docs,
            modalVisible: false,
        };
    }

    handleSend = async index => {
        this.setState({modalVisible: true});
        try {
            // await response to cloud
            await timeout(1500);
            Alert.alert(
                'Successfully Sent!',
                'Your doctor will respond to you soon.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            this.props.navigation.navigate('record-screen', {
                                test: 'Hello from another world',
                            });
                        },
                    },
                ],
                {
                    onDismiss: () => {
                        this.props.navigation.navigate('record-screen', {
                            test: 'Hello from another world',
                        });
                    },
                },
            );
        } catch (error) {
            console.log(error);
        }
        this.setState({modalVisible: false});
    };

    card(props) {
        return (
            <TouchableHighlight
                style={styles.card}
                key={props.index}
                onPress={() => this.handleSend(props.index)}
                underlayColor="#6d59cc">
                <React.Fragment>
                    <View style={styles.docImage}></View>
                    <View>
                        <Text style={styles.docName}>{props.item.title}</Text>
                        <Text>{props.item.work}</Text>
                    </View>
                </React.Fragment>
            </TouchableHighlight>
        );
    }

    render() {
        const gap = () => <View style={styles.cardGap}></View>;

        return (
            <SafeAreaView style={styles.docContainer}>
                <Modal transparent={true} visible={this.state.modalVisible}>
                    <View style={styles.modalBoxWrapper}>
                        <ActivityIndicator size={'large'} color={'limegreen'} />
                    </View>
                </Modal>
                <FlatList
                    style={styles.cardList}
                    contentContainerStyle={styles.cardListContainer}
                    data={this.state.data}
                    renderItem={this.card.bind(this)}
                    ItemSeparatorComponent={gap}
                />
            </SafeAreaView>
        );
    }
}

// export default SendDoc;
export default function (props) {
    const navigation = useNavigation();
    return <SendDoc {...props} navigation={navigation} />;
}
