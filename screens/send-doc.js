import React, {Component} from 'react';
import {Text, View, TouchableHighlight, FlatList, Modal} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../Styles';
import {useNavigation} from '@react-navigation/native';

const docs = [];
for (let i = 0; i < 10; i++) {
    docs.push({title: 'Example Doctor', work: 'Brief Description'});
}

class SendDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: docs,
            modalVisible: false,
        };
    }

    handleSend(index) {
        this.setState({modalVisible: true});
    }

    closeModal() {
        this.setState({modalVisible: false});
        this.props.navigation.navigate('record-screen', {
            test: 'Hello from another world',
        });
    }

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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={this.closeModal.bind(this)}>
                    <View style={styles.modalBoxWrapper}>
                        <View style={styles.sentDialogBox}>
                            <TouchableHighlight
                                underlayColor={'#eee'}
                                onPress={() => this.closeModal()}
                                style={styles.modalClose}>
                                <Icon
                                    name="close"
                                    size={30}
                                    color={'#333'}></Icon>
                            </TouchableHighlight>
                            <Text style={styles.modalText}>
                                Successfully Sent!
                            </Text>
                        </View>
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
