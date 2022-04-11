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

export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractTime(string) {
    const [time, date] = string.split('-');

    const [hrs, min, sec] = time.split('.');
    const [day, month, year] = date.split('.');

    return new Date(year, month - 1, day, hrs, min, sec).toLocaleString();
}

export function extractDateObject(string) {
    const [time, date] = string.split('-');

    const [hrs, min, sec] = time.split('.');
    const [day, month, year] = date.split('.');

    return new Date(year, month - 1, day, hrs, min, sec);
}

export function compareDates(a, b) {
    const aDate = extractDateObject(a);
    const bDate = extractDateObject(b);
    return aDate < bDate;
}

export function analyseBPM(bpm) {
    if (bpm < 40) {
        return `
Normal heartbeat range is 60 to 100. But your heartbeat per min is ${bpm}.

Possible causes : 
• Congenital defect
• Thyroid disease

Do you expirence any of these symptoms? 
• Lightheadedness or dizziness
• Confusion or a hard time concentrating
• Fainting
• Shortness of breath (with or without chest pain)`;
    } else if (bpm > 100) {
        return `
Normal BPM is between 60 to 100. Your BPM is ${bpm}.

Possible causes :

• Physical or mental stress including illness and anxiety.
• Hypertension or high blood pressure.
• Electrolyte imbalance.
• congenital irregularities of the heart
• Excess amount of alcohol or caffiene.
• Using recreational drugs (like cocaine)

Do you experience any of these symtomps? 

• Fainting
• Sudden weakness
• a loss of consciousness
• Chest pain
• shortness of breath`;
    } else {
        return 'Normal BPM';
    }
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
                    {...this.props}
                    textContentType={'password'}
                    autoComplete={'password'}
                    secureTextEntry={this.state.hidePassword}
                />
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
