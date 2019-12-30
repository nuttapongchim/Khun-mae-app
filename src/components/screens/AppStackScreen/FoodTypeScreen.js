import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, AsyncStorage } from 'react-native'
import { Container, Content } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons'
import qs from 'qs';
import { Dialog } from 'react-native-simple-dialogs';

import { httpClient } from '../../../../HttpClient';

export class FoodTypeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            foodTypeData: [],
            foodData: [],
            isFetching: false,
            searchText: '',
            foodFetching: false,
            dialogVisible: false,
            foodName: '',
            foodId: '',
            foodQty: 1
        }
    }

    componentWillMount() {
        const { navigation } = this.props;
        const date = navigation.getParam('DATE');
        console.log('date : ' + date)

        this.setState({ isFetching: true, date: date })
        httpClient
            .get('/foodtypes')
            .then(res => {
                if (res.data.auth) {
                    setTimeout(() => {
                        this.setState({
                            foodTypeData: res.data.data,
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

    searchFood = (text) => {

        if (text != "") {
            this.setState({ foodFetching: true })

            const data = qs.stringify({
                foodname: text
            })

            httpClient
                .post('/search_food/', data)
                .then(res => {
                    if (res.data.auth) {
                        this.setState({
                            foodData: res.data.data,
                            foodFetching: false
                        })
                    } else {
                        alert('Error : Cant find your token.')
                    }
                })
        } else {
            this.setState({
                foodData: [],
                foodFetching: false
            })
        }
    }

    render() {

        return (
            <SafeAreaView style={styles.safeAreaContainer}>

                <View>
                    <TextInput
                        style={{ fontSize: 25, borderColor: '#242424', borderWidth: 1, padding: 10, margin: 10, borderRadius: 5 }}
                        onChangeText={(text) => this.searchFood(text)}
                        placeholder="ค้นหา.."
                        placeholderTextColor="#24242477"
                    />
                </View>
                <Container>
                    <Content contentContainerStyle={{ flexGrow: 1 }}>

                        <View>
                            <View>
                                <View style={{ marginTop: 10 }}>
                                    {
                                        this.state.foodFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                                    }
                                    {
                                        !this.state.foodFetching && this.state.foodData.length ? (
                                            this.state.foodData.map((food, i) => {
                                                return <TouchableOpacity key={i} onPress={() => this.setState({ dialogVisible: true, foodName: food.FOOD_NAME, foodId: food.FOOD_ID })}>
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
                            </View>
                        </View>

                        {
                            this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
                        }
                        {
                            !this.state.isFetching && this.state.foodTypeData.length ? (
                                this.state.foodTypeData.map((foodtype, i) => {
                                    return <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('Food', { 'FOODTYPE_ID': foodtype.FOODTYPE_ID, 'DATE': this.state.date })}>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: .5, borderColor: '#272C3555' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <View>
                                                    <Icon name='ios-restaurant' size={47} />
                                                </View>
                                                <View style={{ flexDirection: 'column', paddingLeft: 15 }}>
                                                    <Text style={{ fontSize: 18, fontWeight: '400' }}> {foodtype.FOODTYPE_NAME} </Text>
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



export default FoodTypeScreen;
