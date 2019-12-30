import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, AsyncStorage } from 'react-native'
import { Container, Content } from 'native-base'
import Icon from 'react-native-vector-icons/Ionicons'


import { httpClient } from '../../../../HttpClient'

export class RecordDetailScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            recordDetailData: [],
            isFetching: false,
            SUM_KCAL: 0
        }
        this.deleteRecord = this.deleteRecord.bind(this)
        this.loadRecord = this.loadRecord.bind(this)
        this.confirmDelete = this.confirmDelete.bind(this)
        this.checkKcalElement = this.checkKcalElement.bind(this)
        this.sumKcal = this.sumKcal.bind(this)
    }

    componentWillMount() {
        this.loadRecord()
    }

    sumKcal(arr) {
        console.log('arr = ' + JSON.stringify(arr))

        var sum = 0;
        arr.forEach(item => {
            sum += parseInt(item.FOOD_KCAL) * parseInt(item.FOOD_QTY);
        });
        return sum;
    }


    async loadRecord() {
        const { navigation } = this.props;
        const date = navigation.getParam('DATE');
        const dateFormat = navigation.getParam('DATE_FORMAT');
        const userId = await AsyncStorage.getItem('userId');
        this.setState({ isFetching: true, DATE_FORMAT: dateFormat, date: date })
        httpClient
            .get('/get_record_food/' + userId + '/' + date)
            .then(res => {
                console.log(JSON.stringify(res.data))
                console.log('length : ' + res.data.data.length)
                if (res.data.auth) {
                    if (res.data.data.length != 0) {
                        console.log('data != []')
                        setTimeout(() => {
                            this.setState({
                                recordDetailData: res.data.data,
                                isFetching: false
                            })
                        }, 0)

                        this.setState({ SUM_KCAL: this.sumKcal(res.data.data) })
                        console.log('state load record  = ' + this.state.SUM_KCAL)

                    } else {
                        console.log('data == []')
                        this.props.navigation.popToTop()
                    }
                } else {
                    alert('Error : Cant find your token.')
                }
            })
    }

    confirmDelete(recordId, foodName, foodKcal) {
        Alert.alert(
            'ยืนยันการลบ',
            'คุณต้องการลบ ' + foodName + ' ' + foodKcal + ' กิโลแคลอรี่',
            [
                { text: 'ยกเลิก', onPress: () => console.log('cancel delete record'), style: 'cancel' },
                { text: 'ลบ', onPress: () => this.deleteRecord(recordId, foodKcal) },
            ]
        );
    }

    deleteRecord(recordId, foodKcal) { //delete_record_food

        // minus kcal 

        this.setState({ SUM_KCAL: this.state.SUM_KCAL - foodKcal })
        console.log('state load deleteRecord = ' + this.state.SUM_KCAL)

        console.log('deleteRecord : ' + recordId)
        httpClient
            .delete('/delete_record_food/' + recordId)
            .then(res => {
                console.log(JSON.stringify(res.data))
                if (res.data.type == 'success') {
                    setTimeout(() => {
                        this.loadRecord()
                    }, 0)
                } else {
                    alert('Error : Cant find your token.')
                }
            })
    }

    checkKcalElement() {
        if (this.state.SUM_KCAL < 1700) {
            return <Text style={{ fontSize: 28, fontWeight: '300', textAlign: 'right', paddingHorizontal: 10, marginBottom: 20, color: '#E6C02999' }}>
                ต้องกินอีก {1700 - this.state.SUM_KCAL} แคลอรี่
            </Text>;
        } else if (this.state.SUM_KCAL < 2000) {
            return <Text style={{ fontSize: 28, fontWeight: '300', textAlign: 'right', paddingHorizontal: 10, marginBottom: 20, color: '#53C22B99' }}>
                กินได้อีก {2000 - this.state.SUM_KCAL} แคลอรี่
            </Text>;
        } else {
            return <Text style={{ fontSize: 28, fontWeight: '300', textAlign: 'right', paddingHorizontal: 10, marginBottom: 20, color: '#FF5A5399' }}>
                กินเกินแคลอรี่ที่ควรได้รับต่อวัน
            </Text>;
        }
    }


    render() {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content>
                        <View>
                            <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'right', paddingTop: 10, paddingHorizontal: 10 }}>
                                {this.state.DATE_FORMAT}
                            </Text>
                            <Text style={{ fontSize: 32, fontWeight: '400', textAlign: 'right', paddingHorizontal: 10, color: '#272C3599' }}>
                                กินไปแล้ว {this.state.SUM_KCAL} แคลอรี่
                        </Text>
                            {this.checkKcalElement()}
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('FoodType', { DATE: this.state.date })}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderWidth: 2, borderColor: '#272C3555', borderStyle: 'dashed', borderRadius: 5, margin: 15 }}>
                                <Icon name='ios-restaurant' size={35} color='#272C3599' />
                                <Text style={{ fontSize: 18, fontWeight: '400', color: '#272C3599' }}>เพิ่มอาหาร</Text>
                            </View>
                        </TouchableOpacity>

                        {
                            this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                        }
                        {
                            !this.state.isFetching && this.state.recordDetailData.length ? (
                                this.state.recordDetailData.map((detail, i) => {
                                    return <View key={i}>
                                        <View style={{ marginHorizontal: 10, marginVertical: 5, padding: 10, borderColor: 'transparent', borderWidth: 1, borderRadius: 5, backgroundColor: '#272C3511' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 20, fontWeight: '400' }}>{detail.FOOD_NAME}</Text>
                                                <Text style={{ fontSize: 22, fontWeight: '400' }}>{detail.FOOD_QTY}</Text>
                                                <Text style={{ fontSize: 20, fontWeight: '400' }}>{detail.FOOD_UNIT}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 14, fontWeight: '200', color: '#272C3599' }}>{detail.FOODTYPE_NAME}</Text>
                                                <Text style={{ fontSize: 14, fontWeight: '200', color: '#272C3599' }}>{ parseInt(detail.FOOD_KCAL) * parseInt(detail.FOOD_QTY)} แคลอรี่</Text>
                                            </View>
                                            <TouchableOpacity style={{ marginTop: 20}} onPress={() => { this.confirmDelete(detail.RECORD_ID, detail.FOOD_NAME, parseInt(detail.FOOD_KCAL) * parseInt(detail.FOOD_QTY)) }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '200', color: '#F1F1F2', borderColor: '#757575', borderStyle: 'solid', borderWidth: 1, borderRadius: 5,paddingLeft:12,paddingRight:12,paddingBottom:3,paddingTop:3 , marginTop:3,backgroundColor:'#757575', width: '100%', textAlign: 'center' }}>ลบ</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                })
                            ) : null
                        }

                    </Content>
                </Container>
            </SafeAreaView>
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

export default RecordDetailScreen
