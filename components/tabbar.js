import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
} from 'react-native';

const S = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 54,
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    tabButton: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    activeTab: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabInner: {
        width: 48,
        height: 48,
        backgroundColor: '#E1F5FE',
        borderRadius: 24,
    },
});

const TabBar = props => {
    const {
        renderIcon,
        activeTintColor,
        inactiveTintColor,
        onTabPress,
        onTabLongPress,
        getAccessibilityLabel,
        navigation,
    } = props;
    console.log(props);
    const {routes, index: activeRouteIndex} = navigation.state;
    const totalWidth = Dimensions.get('window').width;
    const tabWidth = totalWidth / routes.length;

    return (
        <SafeAreaView>
            <View style={S.container}>
                <View>
                    <View style={StyleSheet.absoluteFillObject}>
                        <View style={[S.activeTab, {width: tabWidth}]}>
                            <View style={S.activeTabInner} />
                        </View>
                    </View>
                </View>
                {routes.map((route, routeIndex) => {
                    const isRouteActive = routeIndex === activeRouteIndex;
                    const tintColor = isRouteActive
                        ? activeTintColor
                        : inactiveTintColor;

                    return (
                        <TouchableOpacity
                            key={routeIndex}
                            style={S.tabButton}
                            onPress={() => {
                                onTabPress({route});
                            }}
                            onLongPress={() => {
                                onTabLongPress({route});
                            }}
                            accessibilityLabel={getAccessibilityLabel({route})}>
                            {renderIcon({
                                route,
                                focused: isRouteActive,
                                tintColor,
                            })}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

export default TabBar;
