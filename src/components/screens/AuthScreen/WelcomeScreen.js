import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, AsyncStorage, Image } from 'react-native'
import { Container, Content } from 'native-base';
import qs from 'qs';
import { httpClient } from '../../../../HttpClient';

export class WelcomeScreen extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: ''
        }

        this.sigIn = this.sigIn.bind(this)
    }

    async sigIn() {

        const data = qs.stringify({
            username: this.state.username,
            password: this.state.password
        })

        httpClient
            .post('/check_login/', data)
            .then(async response => {
                const result = response.data

                if (result.type == "success") {
                    // save token
                    await AsyncStorage.setItem("userToken", result.userToken);
                    await AsyncStorage.setItem("userId", result.userId.toString());
                    await AsyncStorage.setItem("username", result.username);
                    await AsyncStorage.setItem("gestationAge", result.gestationAge.toString());
                    await AsyncStorage.setItem("createDate", result.createDate.toString());
                    await AsyncStorage.setItem("weight", result.weight.toString())
                    this.props.navigation.navigate('AuthLoading');
                } else {
                    Alert.alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "",
                        [
                            { text: 'OK', onPress: () => this.setState({ password: '' }) },
                        ])
                }
            })
            .catch(error => {
                Alert.alert('เกิดข้อผิดพลาด : ' + error.message + ' กรุณาติดต่อผู้ดูแลระบบ')
            });
    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container >
                    <Content contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Image style={{width: 200, height: 200}} source={ require('../../../images/logo.png')} />
                            <Text style={{ fontSize: 20, textAlign: 'center' }}> แอปพลิเคชันสำหรับคุณแม่ </Text>
                        </View>
                        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'flex-start' }}>

                            <TextInput
                                placeholder='ชื่อผู้ใช้'
                                onChangeText={(text) => this.setState({ username: text })}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                value={this.state.username} />

                            <TextInput placeholder='รหัสผ่าน'
                                onChangeText={(text) => this.setState({ password: text })}
                                style={styles.textInput}
                                secureTextEntry={true}
                                underlineColorAndroid="transparent"
                                value={this.state.password} />

                            <TouchableOpacity style={{ width: '90%' }} onPress={() => this.sigIn()}>
                                <View style={{ padding: 10, marginTop: 5, alignItems: 'center', backgroundColor: '#272C35', borderWidth: 1, borderRadius: 5 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '200', color: '#fff' }}>เข้าสู่ระบบ</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ width: '90%' }} onPress={() => this.props.navigation.navigate('SignUp')}>
                                <View style={{ padding: 10, marginTop: 5, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, fontWeight: '200', color: '#272C35', textDecorationLine: 'underline' }}>สมัครสมาชิก</Text>
                                </View >
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
    textInput: {
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        padding: 10,
        width: '90%',
        fontSize: 18,
        fontWeight: '200'
    }
})


export default WelcomeScreen
