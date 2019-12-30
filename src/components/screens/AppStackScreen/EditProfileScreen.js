import React, { Component } from 'react'
import qs from 'qs';

import { Text, View, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, AsyncStorage, ActivityIndicator, Image } from 'react-native'
import { Container, Content } from 'native-base';
import DatePicker from 'react-native-datepicker';
import { httpClient } from '../../../../HttpClient';

export class EditProfileScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            infomationData: [],
            isFetching: false,
            firstname: '',
            lastname: '',
            birthdate: '',
            weight: '',
            height: '',
            gestation_age: ''
        }

        this.getInformation = this.getInformation.bind(this)
        this.toDate = this.toDate.bind(this)
        this.updateInformation = this.updateInformation.bind(this)
    }

    componentDidMount = () => {
        this.getInformation()
    }

    async getInformation() {
        // this.setState({ isFetching: true })

        const userId = await AsyncStorage.getItem('userId');

        httpClient
            .get('/member/' + userId)
            .then(res => {
                console.log('auth : ' + res.data.auth);
                console.log('data : ' + JSON.stringify(res.data.data));
                // console.log('gestation age : ' + res.data.data[0].MEMBER_GESTATION_AGE)
                if (res.data.auth) {
                    this.setState({
                        username: res.data.data[0].MEMBER_USERNAME,
                        firstname: res.data.data[0].MEMBER_FIRSTNAME,
                        lastname: res.data.data[0].MEMBER_LASTNAME,
                        birthdate: (new Date(res.data.data[0].MEMBER_BIRTHDATE)).toISOString().split('T')[0],
                        weight: res.data.data[0].MEMBER_WEIGHT,
                        height: res.data.data[0].MEMBER_HEIGHT,
                        gestation_age: res.data.data[0].MEMBER_GESTATION_AGE,
                        isFetching: false
                    })
                } else {
                    alert('Error : Cant find your token.')
                }
            })
    }

    async updateInformation() {

        const userId = await AsyncStorage.getItem('userId');

        const data = qs.stringify({
            userId: userId,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            birthdate: this.state.birthdate,
            weight: this.state.weight,
            height: this.state.height,
            gestation_age: this.state.gestation_age
        })

        httpClient
            .put('/edit_member/', data)
            .then(res => {
                if (res.data.type == 'success') {
                    this.props.navigation.navigate('Home')
                } else {
                    alert("Error : " + JSON.stringify(res.data.type))
                }

            })

    }

    toDate(date) {
        var months = ['0', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'];
        var d = date.split("-");
        var formatDate = `${d[2]} ${months[d[1]]} ${parseInt(d[0]) + 543} `
        return formatDate;
    }

    selectDate = () => {
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

    render() {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content contentContainerStyle={{ flexGrow: 1 }}>

                        <View style={{ flex: .3, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 100, height: 100, padding: 25 }} source={require('../../../images/avatar.png')} />
                            <Text style={{ padding: 25, fontSize: 18, fontWeight: "800" }}>username : {this.state.username}</Text>
                        </View>

                        {
                            this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                        }
                        {
                            !this.state.isFetching ? (
                                <View style={{ flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#272C3555' }}>
                                    <TextInput placeholder='ชื่อจริง' maxLength={16} onChangeText={(text) => this.setState({ firstname: text })} value={this.state.firstname} style={styles.textInput} underlineColorAndroid="transparent" />
                                    <TextInput placeholder='นามสกุล' maxLength={16} onChangeText={(text) => this.setState({ lastname: text })} value={this.state.lastname} style={styles.textInput} underlineColorAndroid="transparent" />

                                    {this.selectDate()}

                                    <TextInput placeholder='น้ำหนักก่อนตั้งครรภ์' maxLength={3} onChangeText={(text) => this.setState({ weight: text })} value={this.state.weight.toString()} style={styles.textInput} keyboardType='numeric' underlineColorAndroid="transparent" />
                                    <TextInput placeholder='ส่วนสูง' maxLength={3} onChangeText={(text) => this.setState({ height: text })} value={this.state.height.toString()} style={styles.textInput} keyboardType='numeric' underlineColorAndroid="transparent" />
                                    {/* <TextInput placeholder='อายุครรภ์ (สัปดาห์)' maxLength={2} onChangeText={(text) => this.setState({ gestation_age: text })} value={this.state.gestation_age.toString()} style={styles.textInput} keyboardType='numeric' underlineColorAndroid="transparent" /> */}

                                    <TouchableOpacity style={{ width: '90%', borderColor: 'transparent' }} onPress={() => this.updateInformation()}>
                                        <View style={{ padding: 10, marginTop: 5, alignItems: 'center', backgroundColor: '#FCE338', borderWidth: 1, borderRadius: 5 }}>
                                            <Text style={{ fontSize: 18, fontWeight: '200', color: '#000' }}>ยืนยันการแก้ไข</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ) : null
                        }


                    </Content>
                </Container>
            </SafeAreaView >
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

export default EditProfileScreen
