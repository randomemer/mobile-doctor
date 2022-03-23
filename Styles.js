import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // LOGIN SECTION
    heartIcon: {
        height: 100,
        width: 100,
        // flexGrow: 0.5,
        marginBottom: '10%',
    },
    loginContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '90%',
        width: '80%',
        // backgroundColor: 'red',
    },
    loginTopArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '50%',
        width: '100%',
    },
    loginRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    loginInput: {
        height: 60,
        fontSize: 18,
        paddingLeft: 10,
        paddingBottom: 0,
        color: '#333333',
        // backgroundColor: 'red',
        width: '90%',
    },
    inputFields: {
        display: 'flex',
        flexDirection: 'column',
        height: '22.5%',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        marginBottom: '50%',
        // backgroundColor: 'skyblue',
        // padding: 15,
    },
    loginButton: {
        width: '50%',
        backgroundColor: '#00b4d8',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 5,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
    },
    loginIcons: {
        height: 30,
        width: 30,
        marginRight: '0%',
    },
    // RECORD SECTION
    recordButton: {
        height: 75,
        width: 75,
        backgroundColor: 'red',
        borderRadius: 75 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timer: {
        fontSize: 48,
        marginBottom: 20,
        color: 'black',
    },
    recordButtonIcon: {
        height: '80%',
        width: '80%',
    },
    recordArea: {
        display: 'flex',
        flexDirection: 'column',
    },
});

export default styles;
