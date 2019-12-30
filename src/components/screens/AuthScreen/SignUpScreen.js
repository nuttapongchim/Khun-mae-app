import React, { Component } from 'react'
import qs from 'qs';

import { Text, View, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, AsyncStorage, Alert } from 'react-native'
import { Container, Content } from 'native-base';
import DatePicker from 'react-native-datepicker';
import { httpClient } from '../../../../HttpClient';

export class SignUpScreen extends Component {

    constructor() {
        super()
        this.state = {
            username: '',
            checkUsername: '',
            password: '',
            firstname: '',
            lastname: '',
            birthdate: '',
            weight: '',
            height: '',
            gestation_age: ''
        }

        this.toDate = this.toDate.bind(this)
        this.selectDate = this.selectDate.bind(this)
        this.signUp = this.signUp.bind(this)
    }

    signUp() {

        const data = qs.stringify({
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            birthdate: this.state.birthdate,
            weight: this.state.weight,
            height: this.state.height,
            gestation_age: this.state.gestation_age
        })

        httpClient
            .post('/create_member/', data)
            .then(async res => {
                const result = res.data
                if (result.type == "success") {
                    // show successful alert
                    Alert.alert("สมัครสมาชิกสำเร็จ", "",
                        [
                            { text: 'OK', onPress: () => this.props.navigation.navigate('AuthLoading') },
                        ])
                } else {

                    Alert.alert("กรอกข้อมูลไม่ถูกต้องกรุณากรอกข้อมูลให้ครบถ้วน")

                }
            })
            .catch(async error => {
                Alert.alert('เกิดข้อผิดพลาด : ' + error.message + 'กรุณาติดต่อผู้ดูแลระบบ')
            });


    }

    checkDuplicate = () => {
        httpClient
            .get('/check_member/' + this.state.username)
            .then(res => {
                const result = res.data
                console.log(`username => ${JSON.stringify(this.state.username)} lenght = ${result.data.length}`)
                if (result.data.length > 0) {
                    Alert.alert(`มีผู้ใช้ชื่อว่า ${this.state.username} แล้ว`, '',
                        [
                            {
                                text: 'เปลี่ยนชื่อผู้ใช้', onPress: () => this.setState({ username: '' })
                            }
                        ])

                } else {
                    this.setState({ username: this.state.username })
                }
            })
            .catch(async error => {
                Alert.alert('เกิดข้อผิดพลาด : ' + error.message + 'กรุณาติดต่อผู้ดูแลระบบ')
            });
    }

    selectDate() {
        if (this.state.birthdate == '') {
            return <DatePicker
                style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    margin: 5,
                    padding: 10,
                    width: '90%',
                    fontSize: 18,
                    fontWeight: '200'
                }}
                date={this.state.birthdate}
                mode="date"
                placeholder="เลือกวันเกิด"
                format="YYYY-MM-DD"
                minDate="1975-01-01"
                maxDate="2020-01-01"
                confirmBtnText="เลือก"
                cancelBtnText="ยกเลิก"
                customStyles={{
                    dateInput: {
                        borderWidth: 0,
                        fontSize: 18,
                        fontWeight: '200'
                    }
                    // ... You can check the source to find the other keys.
                }}
                showIcon={false}
                onDateChange={(date) => { this.setState({ birthdate: date }) }}
            />
        } else {
            return <TextInput style={styles.textInput} value={this.toDate(this.state.birthdate)} onFocus={() => this.setState({ birthdate: '' })} keyboardType='numeric' underlineColorAndroid="transparent" />
        }
    }

    toDate(date) {
        var months = ['0', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'];
        var d = date.split("-");
        var formatDate = `${d[2]} ${months[d[1]]} ${parseInt(d[0]) + 543} `
        return formatDate;
    }

    render() {

        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>

                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Text style={{ color: '#272C35', fontSize: 20, fontWeight: '200' }} >ยกเลิก</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'right' }}>
                                สมัครสมาชิก
                        </Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#272C3555' }}>
                            <TextInput placeholder='ชื่อผู้ใช้' maxLength={16} value={this.state.username} onBlur={() => this.checkDuplicate()} onChangeText={(text) => this.setState({ username: text })} style={styles.textInput} underlineColorAndroid="transparent" />
                            <TextInput placeholder='รหัสผ่าน' maxLength={16} onChangeText={(text) => this.setState({ password: text })} style={styles.textInput} secureTextEntry={true} underlineColorAndroid="transparent" />
                            <TextInput placeholder='ชื่อจริง' maxLength={16} onChangeText={(text) => this.setState({ firstname: text })} style={styles.textInput} underlineColorAndroid="transparent" />
                            <TextInput placeholder='นามสกุล' maxLength={16} onChangeText={(text) => this.setState({ lastname: text })} style={styles.textInput} underlineColorAndroid="transparent" />

                            {this.selectDate()}

                            <TextInput placeholder='น้ำหนักก่อนตั้งครรภ์' maxLength={3} onChangeText={(text) => this.setState({ weight: text })} style={styles.textInput} keyboardType='numeric'  underlineColorAndroid="transparent" />
                            <TextInput placeholder='ส่วนสูง' maxLength={3} onChangeText={(text) => this.setState({ height: text })} style={styles.textInput} keyboardType='numeric' underlineColorAndroid="transparent" />
                            <TextInput placeholder='อายุครรภ์ (สัปดาห์)' maxLength={2} onChangeText={(text) => this.setState({ gestation_age: text })} style={styles.textInput} keyboardType='numeric' underlineColorAndroid="transparent" />

                            <TouchableOpacity style={{ width: '90%' }} onPress={() => this.signUp()}>
                                <View style={{ padding: 10, marginTop: 5, alignItems: 'center', backgroundColor: '#272C35', borderWidth: 1, borderRadius: 5 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '200', color: '#fff' }}>สมัครสมาชิก</Text>
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
    textInput: {
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        padding: 10,
        width: '90%',
        fontSize: 18,
        fontWeight: '200',
    }
})

export default SignUpScreen

