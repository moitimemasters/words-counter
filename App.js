import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import styled from "react-native-styled.macro"
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

const RootStack = createStackNavigator();

export default function App() {
    return <NavigationContainer>
        <RootStack.Navigator>
            <RootStack.Group screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="Home" component={HomeScreen} />
            </RootStack.Group>
            <RootStack.Group screenOptions={{ presentation: "modal", headerShown: false }}>
                <RootStack.Screen name="Picture" component={PictureInfoScreen} />
            </RootStack.Group>
        </RootStack.Navigator>
    </NavigationContainer>
}

const PictureInfoScreen = ({ route: { params }, navigation }) => {
    return <View {...styled(["flex-1", "p-3 "])}>
        <Image source={params} {...styled(["flex-1", "rounded-xl"])} />
        <Text {...styled(["text-3xl", "text-center"])}>... Counting words ... </Text>
        <TouchableOpacity
            {...styled(["self-end", "items-center"])}
            onPress={() => {
                navigation.navigate("Home")
            }}>
            <Text {...styled(["text-indigo-500", "text-2xl"])}> Go Home </Text>
        </TouchableOpacity>
    </View>
}

const HomeScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const camera = useRef(null);
    const focused = useIsFocused();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        const photo = await camera.current.takePictureAsync();
        const uri = photo.uri;
        navigation.navigate("Picture", { uri })
    }
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View {...styled(["w-full", "h-full"])}>
            <StatusBar translucent={true} backgroundColor="transparent"/>
            {focused && <Camera ref={camera} style={styles.camera} type={type} ratio="20:9">
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <Text style={styles.text}> Flip </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={takePicture}>
                        <Text style={styles.text}> take picture </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'space-between',
    },
    button: {
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});
