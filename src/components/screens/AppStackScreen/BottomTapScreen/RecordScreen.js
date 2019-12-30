import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage, Dimensions } from 'react-native'
import { Container, Content } from 'native-base'
import PureChart from 'react-native-pure-chart';
import Icon from 'react-native-vector-icons/Ionicons'

import { httpClient } from '../../../../../HttpClient';

export class RecordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordFoodData: [],
            isFetching: false,
            graphDraw: false,
            graph: []
        }
        this.toDate = this.toDate.bind(this);
        this.loadRecord = this.loadRecord.bind(this)
    }

    toDate(date) {
        var months = ['0', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'];
        var d = date.split("-");
        var day = d[2].split("T")
        var formatDate = day[0] + " " + months[parseInt(d[1])] + " " + (parseInt(d[0]) + 543);
        return (formatDate);
    }

    componentWillMount() {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear() + 543;
        var months = ['0', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'];
        this.setState({ month: months[month], year: year })
        this.loadRecord()
    }

    componentDidMount() {
        this.loadRecord();
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.loadRecord();
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    async loadRecord() {

        const userId = await AsyncStorage.getItem('userId');
        const date = new Date();
        const month = date.getMonth() + 1;

        httpClient
            .get('/get_record_foods/' + userId + '/' + month)
            .then(res => {
                if (res.data.auth) {
                    this.setState({
                        recordFoodData: res.data.data,
                        graph: res.data.data,
                        isFetching: false
                    })
                } else {
                    alert('Error : Cant find your token.')
                }

                console.log(`precall fn = ${JSON.stringify(this.state.recordFoodData)}`)
                this.createGraph()
            })
    }

    createGraph = () => {

        const d = this.state.graph.reverse()

        var plot = [];

        for (var i = 0; i < 31; i++) {
            for (var j = 0; j < d.length; j++) {
                var date = d[j].RECORD_DATE.split("-");
                var day = parseInt(date[2])

                if (i + 1 == day) {
                    plot[i] = {
                        x: i + 1,
                        y: d[j].SUM_KCAL
                    };
                    break
                } else {
                    plot[i] = {
                        x: i + 1,
                        y: 0
                    };
                }
            }
        }

        this.setState({ graphData: plot, graphDraw: true });

    }

    drawGraph = () => {


        var dataWithLabel = [
            {
                seriesName: '',
                data: this.state.graphData,
                color: '#19191b'
            }
        ]

        if (this.state.graphDraw) {
            return <PureChart
                data={dataWithLabel}
                type='bar'
                style={{ color: '#000000' }}
                width={'100%'}
                height={200} />
        }
    }

    render() {

        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content>
                        <View>
                            <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'right', padding: 10 }}>
                                บันทึกอาหาร
                        </Text>
                            <Text style={{ marginTop: 5, marginBottom: 10, textAlign: 'center', fontSize: 18, fontWeight: '200', color: '#FF6369' }}>
                                คุณแม่ควรได้รับพลังงาน 1700 - 2000 แคลอรี่ต่อวัน
                    </Text>
                        </View>

                        <View>

                            {this.drawGraph()}

                        </View>

                        <View>
                            <Text style={{ padding: 20, textAlign: 'center', fontSize: 16, fontWeight: '400', color: '#000000' }}>กราฟจำนวนแคลอรี่ต่อวันในเดือน {this.state.month} {this.state.year}</Text>
                        </View>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddRecord')}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderWidth: 2, borderColor: '#272C3555', borderStyle: 'dashed', borderRadius: 5, margin: 15 }}>
                                <Icon name='ios-add-circle-outline' size={35} color='#272C3599' />
                                <Text style={{ fontSize: 18, fontWeight: '400', color: '#272C3599' }}>สร้างรายการบันทึก</Text>
                            </View>
                        </TouchableOpacity>

                        {
                            this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                        }
                        {
                            !this.state.isFetching && this.state.recordFoodData.length ? (
                                this.state.recordFoodData.map((record, i) => {
                                    return <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('RecordDetail', { DATE: record.RECORD_DATE, DATE_FORMAT: this.toDate(record.RECORD_DATE) })}>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: .5, borderColor: '#272C3555' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View>
                                                    <Icon name='ios-restaurant' size={47} />
                                                </View>
                                                <View style={{ flexDirection: 'column', paddingLeft: 15 }}>
                                                    <Text style={{ fontSize: 18, fontWeight: '400' }}> {this.toDate(record.RECORD_DATE)} </Text>
                                                    <Text style={{ fontSize: 16, color: '#272C3599' }}> {record.SUM_KCAL} แคลอรี่</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Icon name='ios-arrow-forward' size={30} color='#272C35' />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
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
        flex: 1,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default RecordScreen
