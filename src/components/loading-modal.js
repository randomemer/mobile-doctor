import React, {Component} from 'react';
import {View, ActivityIndicator, Modal} from 'react-native';
import styles from '../Styles';

class LoadingModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal transparent={true} visible={this.props.modalVisible}>
                <View style={styles.modalBoxWrapper}>
                    <ActivityIndicator size={'large'} color={'limegreen'} />
                </View>
            </Modal>
        );
    }
}

export default LoadingModal;
