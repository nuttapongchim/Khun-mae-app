import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { Container, Content } from 'native-base'
import CalendarStrip from 'react-native-calendar-strip';
import Icon from 'react-native-vector-icons/Ionicons'

import moment from 'moment';

export class AddRecordScreen extends Component {

    constructor(){
        super()
        this.state = {
            selectedDate: moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
        }
    }

    render() {

        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <Container>
                    <Content>
                        <View>
                            <CalendarStrip
                                calendarAnimation={{ type: 'sequence', duration: 30 }}
                                daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: '#272C35' }}
                                style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
                                calendarHeaderStyle={{ color: '#272C35' }}
                                calendarColor={'#fff'}
                                dateNumberStyle={{ color: '#272C35' }}
                                dateNameStyle={{ color: '#272C35' }}
                                highlightDateNumberStyle={{ color: '#272C35' }}
                                highlightDateNameStyle={{ color: '#272C35' }}
                                disabledDateNameStyle={{ color: 'grey' }}
                                disabledDateNumberStyle={{ color: 'grey' }}
                                iconContainer={{ flex: 0.1 }}
                                onDateSelected={ (value)=> this.setState({selectedDate: moment(new Date(value)).format("YYYY-MM-DD hh:mm:ss")}) }
                            />
                            {/* <Text> Date : { this.state.selectedDate } </Text> */}
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('FoodType', { 'DATE': this.state.selectedDate}) }>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderWidth: 2, borderColor: '#272C3555', borderStyle: 'dashed', borderRadius: 5, margin: 15 }}>
                                <Icon name='ios-restaurant' size={35} color='#272C3599' />
                                <Text style={{ fontSize: 18, fontWeight: '400', color: '#272C3599' }}>เพิ่มอาหาร</Text>
                            </View>
                        </TouchableOpacity>
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


export default AddRecordScreen
