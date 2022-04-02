import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    // Loading Screen
    loadingScreen: {
        flex: 1,
        backgroundColor: '#E6E6EA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Main App Container
    appContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // LOGIN SECTION
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#E6E6EA',
    },
    loginTabView: {
        display: 'flex',
        width: '100%',
        height: '60%',
        backgroundColor: '#525252',
        borderRadius: 10,
        elevation: 3,
    },
    heartIcon: {
        height: 100,
        width: 100,
        marginBottom: '10%',
    },
    loginWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '85%',
        width: '87.5%',
        marginTop: '10%',
    },
    loginArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    loginInput: {
        height: 50,
        fontSize: 18,
        paddingLeft: 10,
        alignSelf: 'stretch',
        elevation: 2,
        backgroundColor: 'white',
        marginBottom: 20,
        color: '#333',
        borderRadius: 10,
    },
    inputFields: {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'stretch',
    },
    loginButton: {
        width: '50%',
        backgroundColor: '#9D44B5',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 5,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    forgotPwd: {
        color: 'white',
        textDecorationLine: 'underline',
        alignSelf: 'flex-end',
    },
    loginIcons: {},
    // RECORD SECTION
    container: {
        backgroundColor: '#eeeeee',
        width: '100%',
        height: '100%',
        paddingHorizontal: '5%',
        paddingTop: '5%',
    },
    recordButton: {
        height: 75,
        width: 75,
        display: 'flex',
        backgroundColor: '#ff2e31',
        borderRadius: 75 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timer: {
        fontSize: 48,
        color: '#333',
    },
    recordArea: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffa0a1',
        alignItems: 'center',
        padding: '5%',
        borderRadius: 10,
        marginBottom: '4%',
    },
    recordScreenTitle: {
        fontSize: 36,
        fontWeight: '700',
        color: '#333',
        marginBottom: '10%',
    },
    recordActionsBar: {
        display: 'flex',
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
    },
    audioPlayer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#525252',
        justifyContent: 'space-between',
        width: '82.5%',
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    slider: {width: '70%'},
    playIcon: {},
    sendToDocButton: {
        backgroundColor: '#00b4d8',
        height: 50,
        width: 50,
        borderRadius: 25,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteRecordingButton: {
        backgroundColor: '#ff2e31',
        height: 40,
        width: 40,
        borderRadius: 50 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // SEND TO DOCTOR SCREEN
    docContainer: {
        flex: 1,
        backgroundColor: '#eee',
    },
    cardList: {flex: 1},
    cardListContainer: {paddingVertical: 30},
    card: {
        display: 'flex',
        flexDirection: 'row',
        width: '87.5%',
        height: 100,
        borderRadius: 10,
        backgroundColor: '#886fff',
        alignSelf: 'center',
        padding: 20,
    },
    cardGap: {
        height: 25,
    },
    docImage: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        alignSelf: 'center',
        backgroundColor: 'white',
        marginRight: '7.5%',
    },
    docName: {
        fontSize: 20,
        color: '#fff',
    },
    modalBoxWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0, 0.3)',
    },
    // HISTORY VIEW
    interactionsContainer: {paddingVertical: 30},
    interactionCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        height: 120,
        width: '87.5%',
        alignSelf: 'center',
        borderRadius: 10,
        padding: 20,
        elevation: 1,
    },
    docNameRow: {},
    docNameText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoRowText: {
        color: '#fff',
        fontSize: 14,
    },
    infoRowIcon: {
        marginRight: 7.5,
    },
    // HISTORY DETAILS VIEW
    detailsContainer: {paddingTop: 20, paddingLeft: 25},
    infoCard: {
        marginBottom: 30,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    rowTitleText: {
        color: '#9D44B5',
        fontSize: 20,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    titleRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rowIcon: {
        color: '#ff5456',
        marginRight: 10,
    },
    rowInfoText: {
        color: '#333',
        fontSize: 18,
    },
    // *************************
    // ******* PROFILE *********
    // *************************
    profileContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: '5%',
    },
    profileHeaderStyle: {
        backgroundColor: '#ff5456',
        paddingHorizontal: '5%',
        height: 57.5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },
    profileHeaderText: {
        color: '#fff',
        fontSize: 20,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    profileCard: {
        height: '30%',
        width: '90%',
        borderRadius: 10,
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#525252',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        backgroundColor: 'lime',
    },
    profileText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileInfo: {
        marginTop: '15%',
        display: 'flex',
        flexDirection: 'column',
        width: '82.5%',
    },
    profileField: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '5%',
    },
    profileFieldIcon: {
        marginRight: 20,
    },
    profileFieldText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        borderRadius: 30,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        alignContent: 'flex-end',
        position: 'absolute',
        right: 0,
    },
    // *************************
    // ***** EDIT PROFILE ******
    // *************************
    editProfContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: '7.5%',
        paddingTop: '7.5%',
    },
    confirmEditButton: {
        position: 'absolute',
        bottom: '3%',
        right: '5%',
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        backgroundColor: '#009FB7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    genderSelect: {},
});

export default styles;
