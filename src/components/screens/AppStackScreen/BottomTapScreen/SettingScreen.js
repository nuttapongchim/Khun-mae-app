import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Button, AsyncStorage, TouchableOpacity } from 'react-native'
import { Container, Content } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons'


export class SettingScreen extends Component {

    signOut = async () => {
        AsyncStorage.clear()
        this.props.navigation.navigate('AuthLoading')
    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'right', padding: 10 }}>
                                ตั้งค่า
                        </Text>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <TouchableOpacity>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', padding: 20, borderWidth: .5, borderColor: '#272C3555' }}>
                                    <Icon name='logo-facebook' size={24} />
                                    <Text style={{ fontSize: 18, fontWeight: '200', paddingLeft: 10 }}>Facebook </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', padding: 20, borderWidth: .5, borderColor: '#272C3555' }}>
                                    <Icon name='ios-call' size={24} />
                                    <Text style={{ fontSize: 18, fontWeight: '200', paddingLeft: 10 }}>Phone </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.signOut()}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', padding: 20, borderWidth: .5, borderColor: '#272C3555', backgroundColor: '#D1CECE44' }}>
                                    <Icon name='ios-log-out' size={24} />
                                    <Text style={{ fontSize: 18, fontWeight: '400', paddingLeft: 10 }}>ออกจากระบบ </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Content>
                </Container>
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

export default SettingScreen
