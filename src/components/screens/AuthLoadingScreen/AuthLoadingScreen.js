import React, { Component } from 'react'
import { Text, View, ActivityIndicator, StyleSheet, SafeAreaView, AsyncStorage } from 'react-native'

export class AuthLoadingScreen extends Component {

    constructor() {
        super()
        this.loadApp()
    }

    loadApp = async () => {

        const userToken = await AsyncStorage.getItem('userToken')
        
        setTimeout( ()=> {
            this.props.navigation.navigate(userToken ? 'App' : 'Auth')
        },500)
        
    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <View style={styles.container}>
                    <ActivityIndicator size='large' />
                    <Text style={{marginTop:20, fontSize:24, fontWeight: '200'}}></Text>
                </View>
            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


export default AuthLoadingScreen
