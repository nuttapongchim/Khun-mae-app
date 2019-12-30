import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, AsyncStorage, ActivityIndicator, Image, WebView } from 'react-native'
import { Container, Content, Toast, Root } from 'native-base'
import PureChart from 'react-native-pure-chart';
import Balloon from 'react-native-balloon'
import Icon from 'react-native-vector-icons/Ionicons'

import { httpClient } from '../../../../../HttpClient';
import moment from 'moment';

export class HomeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            infomationData: [],
            recordWeightData: [],
            createChart: false,
            isFetching: false
        }

        this.toDate = this.toDate.bind(this)
        this.loadInfomatoin = this.loadInfomatoin.bind(this)
        this.recordSuccess = this.recordSuccess.bind(this)
        this.loadChart = this.loadChart.bind(this)
        this.loadRecord = this.loadRecord.bind(this)
        this.checkWeight = this.checkWeight.bind(this)
    }

    componentWillMount() {
        this.loadInfomatoin()
        this.loadRecord()
    }

    componentDidMount() {
        this.loadRecord();
        this.loadInfomatoin()
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.loadRecord(); this.loadInfomatoin();
            }
        );

    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    async loadInfomatoin() {
        this.setState({ isFetching: true })
        const userId = await AsyncStorage.getItem('userId');
        httpClient
            .get('/member/' + userId)
            .then(res => {
                console.log('auth : ' + res.data.auth);
                console.log('data : ' + JSON.stringify(res.data.data));
                // console.log('gestation age : ' + res.data.data[0].MEMBER_GESTATION_AGE)
                if (res.data.auth) {
                    setTimeout(() => {
                        this.setState({
                            infomationData: res.data.data,
                            isFetching: false
                        })
                    }, 0)
                } else {
                    alert('Error : Cant find your token.')
                }
            })
    }

    async loadRecord() {
        const userId = await AsyncStorage.getItem('userId');
        httpClient
            .get('/get_record_weight/' + userId)
            .then(res => {
                console.log('record weight : ' + JSON.stringify(res.data))
                if (res.data.auth) {
                    setTimeout(() => {
                        this.setState({
                            recordWeightData: res.data.data,
                            isFetching: false
                        })
                        this.loadChart()
                    }, 0)
                } else {
                    alert('Error : Cant find your token.')
                }
            })
    }


    async loadChart() {

        const gestationAge = await AsyncStorage.getItem('gestationAge');
        const createDate = await AsyncStorage.getItem('createDate');
        const weight = await AsyncStorage.getItem('weight');

        console.log('gestationAgeLoadChart = ' + gestationAge)
        console.log('createDateLoadChart = ' + createDate)
        console.log('recordWeight : ' + JSON.stringify(this.state.recordWeightData))

        var lineUpper = [];
        var lineLower = [];
        var linePlot = [];
        var record = this.state.recordWeightData

        if (record.length != 0) {
            console.log('record if ')
            for (var key in record) {

                if (record.hasOwnProperty(key)) {
                    var diffWeight = ((record[key].RECORD_VALUE * 2.2).toFixed(2) - (record[0].RECORD_VALUE * 2.2).toFixed(2)).toFixed(2)
                    console.log('pound => ' + diffWeight);

                    var diff = (new Date(record[key].RECORD_DATE).getTime() - new Date(createDate).getTime()) / 1000;
                    diff /= (60 * 60 * 24 * 7);
                    var diffWeek = Math.abs(Math.round(diff));
                    var week = (parseFloat(gestationAge) + diffWeek);
                    console.log('diffWeek => ' + week);

                    var upper = (gestationAge - 6);
                    var lower = (0.8 * gestationAge) - 8;

                    console.log('upper ' + upper)
                    console.log('lower ' + lower)

                    var start = (record[0].RECORD_VALUE * 2.2) - (weight * 2.2)
                    var resultWeight = (parseFloat(start) + parseFloat(diffWeight))
                    var d = { 'x': (week), 'y': diffWeight == 0.0 ? parseFloat(start.toFixed(2)) : parseFloat(resultWeight.toFixed(2)) }
                    linePlot.push(d)

                }

            }
            //
            console.log('linePlot = ' + JSON.stringify(linePlot))
            console.log('plotlengt = ' + linePlot.length)

            console.log('week ' + week)

            for (var i = gestationAge; i <= week; i++) {
                var y = (i - 6);
                y = y.toFixed(1)
                var d = { 'x': i, 'y': parseFloat(y) }
                lineUpper.push(d)
            }
            console.log('lineUpper = ' + JSON.stringify(lineUpper))
            console.log('lineUpperlengt = ' + lineUpper.length)


            for (var i = gestationAge; i <= week; i++) {
                var y = (0.8 * i) - 8;
                y = y.toFixed(1)
                var d = { 'x': i, 'y': parseFloat(y) }
                lineLower.push(d)
            }
            console.log('lineLower = ' + JSON.stringify(lineLower))
        } else {
            console.log('record else ')
            d = { 'x': 1, 'y': 0 }
            lineUpper.push(d)
            lineLower.push(d)
            linePlot.push(d)
        }

        if (lineUpper.length == linePlot.length) {
            const lastUpper = lineUpper[lineUpper.length - 1].y;
            const lastPlot = linePlot[linePlot.length - 1].y
            const lastLower = lineLower[lineLower.length - 1].y
            console.log('last upper = ' + lastUpper)
            console.log('last plot = ' + lastPlot)
            console.log('last lower = ' + lastLower)

            if (lastPlot > lastUpper) {
                statusWeight = 'upper'
            } else if (lastPlot < lastLower) {
                statusWeight = 'lower'
            } else {
                statusWeight = 'normal'
            }

            this.setState({ lineUpper: lineUpper, lineLower: lineLower, linePlot: linePlot, createChart: true, statusWeight: statusWeight })
        } else {
            this.loadChart()
            console.log('wait')
        }

    }

    checkWeight() {

        const screenWidth = Dimensions.get('window').width
        const screenHeight = Dimensions.get('window').height

        if (this.state.statusWeight == 'upper') {
            return <Balloon
                borderColor="#FF5A53"
                backgroundColor="#FF5A53"
                borderWidth={1}
                borderRadius={25}
                triangleSize={14}
                triangleDirection='top'
                triangleOffset='80%'
                width={screenWidth - 30}
            >
                <Text style={{ textAlign: 'center', fontSize: 18, color: '#FFFFFF', fontWeight: '300' }}>น้ำหนักมากกว่าเกณฑ์</Text>
            </Balloon>
        } else if (this.state.statusWeight == 'lower') {
            return <Balloon
                borderColor="#FF5A53"
                backgroundColor="#FF5A53"
                borderWidth={1}
                borderRadius={25}
                triangleSize={14}
                triangleDirection='top'
                triangleOffset='80%'
                width={screenWidth - 30}
            >
                <Text style={{ textAlign: 'center', fontSize: 18, color: '#FFFFFF', fontWeight: '300' }}>น้ำหนักต่ำกว่าเกณฑ์</Text>
            </Balloon>
        } else if (this.state.statusWeight == 'normal') {
            return <Balloon
                borderColor="#94BF45"
                backgroundColor="#00BD00"
                borderWidth={1}
                borderRadius={25}
                triangleSize={14}
                triangleDirection='top'
                triangleOffset='80%'
                width={screenWidth - 30}
            >
                <Text style={{ textAlign: 'center', fontSize: 18, color: '#FFFFFF', fontWeight: '300' }}>น้ำหนักอยู่ในเกณฑ์ปกติ</Text>
            </Balloon>
        }

    }

    recordSuccess() {

        Toast.show({
            text: 'บันทึกน้ำหนักเรียบร้อยแล้ว',
            position: 'top',
            textStyle: { fontSize: 24, fontWeight: '200', color: '#fff', textAlign: 'center' },
            style: { backgroundColor: '#272C35', borderColor: '#272C3566', borderWidth: 1, width: '100%', },
            duration: 2000
        })

    }

    toDate(date) {
        var months = ['0', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'];
        var d = date.split("-");
        var day = d[2].split("T")
        var formatDate = day[0] + " " + months[parseInt(d[1])] + " " + (parseInt(d[0]) + 543);
        return (formatDate);
    }

    getAge(date) {
        var birthYear = date.split("-");
        var currentYear = moment(new Date()).format("YYYY")
        var age = currentYear - parseInt(birthYear[0])
        return age
    }

    render() {

        let chartData = [

            {
                seriesName: 'upperLine',
                data: this.state.lineUpper,
                color: 'red'
            },
            {
                seriesName: 'poltLine',
                data: this.state.linePlot,
                color: 'blue'
            },
            {
                seriesName: 'lowerLine',
                data: this.state.lineLower,
                color: 'red'
            }

        ]

        return (
            <Root>
                <SafeAreaView style={styles.safeAreaContainer}>
                    <Container>
                        <Content>
                            <View>
                                <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'right', padding: 10 }}>
                                    ข้อมูลทั่วไป
                    </Text>
                            </View>

                            <View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('RecordWeight')}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: 'transparent', borderRadius: 10, marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 0, padding: 10, backgroundColor: '#272C3511' }}>
                                        <Icon name='ios-speedometer' size={40} color='#272C35' />
                                        <View style={{ textAlign: 'left' }}>
                                            <Text style={{ fontSize: 20, color: '#272C35', fontWeight: '400' }}>บันทึกน้ำหนักประจำสัปดาห์ </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {
                                this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                            }
                            {
                                !this.state.isFetching && this.state.infomationData.length ? (
                                    this.state.infomationData.map((info, i) => {
                                        return <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('EditProfile')}>
                                            <View style={{ alignItems: 'center', borderWidth: 1, borderColor: '#DDDFE2', borderRadius: 5, margin: 10 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold' }}> {info.MEMBER_FIRSTNAME} {info.MEMBER_LASTNAME}</Text>
                                                        <Text>อายุ : {this.getAge(info.MEMBER_BIRTHDATE)} ปี</Text>
                                                        <Text>น้ำหนัก : {info.MEMBER_WEIGHT} กก.</Text>
                                                        <Text>ส่วนสูง : {info.MEMBER_HEIGHT} ซม.</Text>
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                        {/* <Thumbnail large source={{ uri: '../../images/avatar.png' }} /> */}
                                                        <Image style={{ width: 100, height: 100, borderWidth: 1, borderRadius: 50, borderColor: '#DDDFE2' }} source={require('../../../../images/avatar.png')} />
                                                    </View>

                                                    <View style={{ flex: 1 }}>
                                                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ fontSize: 45 }}> {info.MEMBER_BMI.toFixed(1)} </Text>
                                                            <Text style={{ fontSize: 25 }}>ดัชนีมวล</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    })
                                ) : null

                            }

                            {
                                !this.state.createChart && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                            }
                            {
                                this.state.createChart &&
                                <View style={{ height: 250 }}>
                                    <PureChart
                                        data={chartData}
                                        type='line'
                                        height={200} />
                                </View>
                            }

                            <View style={{ marginTop: 0 }}>

                                {this.checkWeight()}


                                <View style={{ padding: 10 }}>
                                    <Text style={{ textAlign: 'justify', marginTop: 5, marginBottom: 10, fontSize: 18, fontWeight: '200', color: '#FF6369' }}>
                                        Tips {"\n"}น้ำหนักควรเพิ่ม 0.4 - 0.5 กิโลกรัมต่อสัปดาห์ {"\n"} ตลอดการตั้งครรภ์ควรเพิ่ม 11.5 – 16 กิโลกรัมต่อสัปดาห์
    
                    </Text>
                                    {/* <Text style={{ textAlign: 'justify',  marginBottom: 10, fontSize: 18, fontWeight: '200', color: '#FF6369' }}>
                                    
                    </Text> */}
                                    <Text style={{ textAlign: 'justify', marginBottom: 10, fontSize: 18, fontWeight: '200', color: '#202124' }}>
                                        คำอธิบายกราฟ {"\n"}จุดสีแดง หมายถึง เกณฑ์ต่ำสุดและสูงสุดของน้ำหนักที่ควรเพิ่มขึ้นในแต่ละสัปดาห์ ,จุดสีน้ำเงิน หมายถึง น้ำหนักปัจจุบันของคุณแม่
    
                    </Text>
                                </View>
                            </View>


                        </Content>
                    </Container>
                </SafeAreaView >
            </Root>
        )
    }
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HomeScreen
