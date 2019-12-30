import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native'
import { Container, Content, Button } from 'native-base';
import { Dialog } from 'react-native-simple-dialogs';

import { httpClient } from '../../../../HttpClient';
import qs from 'qs';

export class FoodScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            foodData: [],
            isFetching: false,
            dialogVisible: false,
            foodName: '',
            foodId: '',
            foodQty: 1
        }
        this.recordFood = this.recordFood.bind(this);
    }

    componentWillMount() {
        const { navigation } = this.props;
        const foodtypeId = navigation.getParam('FOODTYPE_ID');
        const date = navigation.getParam('DATE');
        console.log('date : ' + date)
        this.setState({ isFetching: true, date: date })
        httpClient
            .get('/food/' + foodtypeId)
            .then(res => {
                console.log('auth : ' + res.data.auth);
                console.log('data : ' + res.data.data);
                if (res.data.auth) {
                    setTimeout(() => {
                        this.setState({
                            foodData: res.data.data,
                            isFetching: false
                        })
                    }, 0)
                } else {
                    alert('Error : Cant find your token.')
                }
            })
    }

    async recordFood() {

        console.log('foodId : ' + this.state.foodId);
        const userId = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem('username');
        const data = qs.stringify({
            foodId: this.state.foodId,
            userId: userId,
            username: username,
            date: this.state.date,
            foodQty: this.state.foodQty
        })


        console.log(`data food : ${data}`)

        httpClient
            .post('/record_food/', data)
            .then(res => {
                if (res.data.type == 'success') {
                    console.log('navigate')
                    this.props.navigation.popToTop();
                } else {
                    alert("Error : " + res.data.type)
                }
            })

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ marginTop: 10 }}>
                            {
                                this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                            }
                            {
                                !this.state.isFetching && this.state.foodData.length ? (
                                    this.state.foodData.map((food, i) => {
                                        // onPress={() => this.recordFood(food.FOOD_ID)}
                                        return <TouchableOpacity key={i} onPress={() => this.setState({ dialogVisible: true, foodName: food.FOOD_NAME, foodId: food.FOOD_ID })} >
                                            <View style={{ marginHorizontal: 10, marginVertical: 5, padding: 10, borderColor: 'transparent', borderWidth: 1, borderRadius: 5, backgroundColor: '#272C3511' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 20, fontWeight: '400' }}> {food.FOOD_NAME} </Text>
                                                    <Text style={{ fontSize: 22, fontWeight: '400' }}>1</Text>
                                                    <Text style={{ fontSize: 20, fontWeight: '400' }}> {food.FOOD_UNIT} </Text>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 14, fontWeight: '200', color: '#272C3599' }}> {food.FOODTYPE_NAME} </Text>
                                                    <Text style={{ fontSize: 14, fontWeight: '200', color: '#272C3599' }}> {food.FOOD_KCAL} แคลอรี่</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    })
                                ) : null
                            }
                        </View>

                        <Dialog
                            visible={this.state.dialogVisible}
                            title={this.state.foodName}
                            style={{ textAlign: 'center' }}
                            onTouchOutside={() => this.setState({ dialogVisible: false })} >
                            <View>
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        {
                                            this.state.foodQty != 1 && <TouchableOpacity onPress={() => this.setState({ foodQty: this.state.foodQty - 1 })} ><Text style={{ fontSize: 30, color: '#292D3E' }} > - </Text></TouchableOpacity>
                                        }
                                        {
                                            this.state.foodQty == 1 && <TouchableOpacity disabled={true} ><Text style={{ fontSize: 30, color: '#757575' }}> - </Text></TouchableOpacity>
                                        }
                                        <Text style={{ fontSize: 25 }}> {this.state.foodQty} </Text>
                                        <TouchableOpacity onPress={() => this.setState({ foodQty: this.state.foodQty + 1 })} ><Text style={{ fontSize: 30, color: '#292D3E' }}> + </Text></TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={() => this.recordFood()} style={{ marginTop: 20 }}>
                                        <Text style={{ fontSize: 20, textAlign: 'center', color: '#F1F1F2', borderColor: '#757575', borderStyle: 'solid', borderWidth: 1, borderRadius: 5, paddingLeft: 12, paddingRight: 12, paddingBottom: 3, paddingTop: 3, marginTop: 3, backgroundColor: '#757575', width: '100%' }}>
                                            เพิ่มอาหาร
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ dialogVisible: false })}>
                                        <Text style={{ fontSize: 20, textAlign: 'center', color: '#757575', borderColor: '#757575', borderStyle: 'solid', borderWidth: 1, borderRadius: 5, paddingLeft: 12, paddingRight: 12, paddingBottom: 3, paddingTop: 3, marginTop: 3, backgroundColor: '#ffffff', width: '100%' }}>
                                            ยกเลิก
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Dialog>
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

export default FoodScreen
