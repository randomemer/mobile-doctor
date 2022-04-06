import React, {Component} from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from 'react-native';
import styles, {colors} from '../Styles';
import Icon from 'react-native-vector-icons/Ionicons';

export const defaultPFP = require('../../assets/default-pfp.jpg');

export function extractTime(string) {
    const [time, date] = string.split('-');

    const [hrs, min, sec] = time.split('.');
    const [day, month, year] = date.split('.');

    return new Date(year, month - 1, day, hrs, min, sec).toLocaleString();
}

export class LoadingModal extends Component {
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

export class PasswordInput extends Component {
    constructor(props) {
        super(props);

        this.state = {hidePassword: true};
    }

    render() {
        return (
            <View style={styles.loginInput}>
                <TextInput
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor}
                    secureTextEntry={this.state.hidePassword}
                    onChangeText={text => this.props.onChangeText(text)}
                    onSubmitEditing={() => this.props.onSubmitEditing()}
                    style={this.props.style}></TextInput>
                <TouchableOpacity
                    onPress={() =>
                        this.setState({
                            hidePassword: !this.state.hidePassword,
                        })
                    }
                    style={{marginRight: 15}}>
                    <Icon
                        name={`eye${
                            this.state.hidePassword ? '' : '-off'
                        }-outline`}
                        size={30}
                        color={colors.mainTheme}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

// export PasswordInput();
