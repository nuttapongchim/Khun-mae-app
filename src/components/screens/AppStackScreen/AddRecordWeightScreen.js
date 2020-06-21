import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native'
import { Container, Content, Root, Toast } from 'native-base'
import CalendarStrip from 'react-native-calendar-strip';
import { Dialog } from 'react-native-simple-dialogs';

import moment from 'moment';
import { httpClient } from '../../../../HttpClient';
import qs from 'qs'

export class AddRecordWeightScreen extends Component {

  constructor() {
    super()
    this.state = {
      showToast: false,
      selectedDate: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      recordWeightData: [],
      recordWeightDataRev: [],
      isFetching: false,
      dialogVisible: false,
      editRecordDate: '',
      editRecordValue: '',
      whitelist:[
        {
          start:moment().startOf("week"),
          end:moment().endOf("week")
        }
      ],
    };

    this.recordWeight = this.recordWeight.bind(this);
    this.editWeight = this.editWeight.bind(this);
    this.confirmRecord = this.confirmRecord.bind(this);
    this.toDate = this.toDate.bind(this);
    this.loadRecord = this.loadRecord.bind(this)
  }

  componentDidMount() {
    this.loadRecord();
    //this.setWhitelist()
  }

  setWhitelist = () =>{
    const today = moment();
    const from_date = today.startOf('week');
    const to_date = today.endOf('week');
    this.setState({
      whitelist:[
        {
          "start":from_date.toString(),
          "end":to_date.toString()
        }
      ]
    })
  }

  toDate(date) {
    var months = ['0', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤษจิกายน', 'ธันวาคม'];
    var d = date.split("-");
    var day = d[2].split("T")
    var formatDate = day[0] + " " + months[parseInt(d[1])] + " " + (parseInt(d[0]) + 543);
    return (formatDate);
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
              recordWeightDataRev: res.data.data.reverse(),
              isFetching: false
            })

          }, 0)
        } else {
          alert('Error : Cant find your token.')
        }
      })
  }

  confirmRecord() {
    Alert.alert(
      'ยืนยันการบันทึก',
      'บันทึกน้ำหนัก ' + this.state.weight + ' กิโลกรัม \n วันที่ ' + this.toDate(this.state.selectedDate),
      [
        { text: 'ยกเลิก', onPress: () => console.log('cancel record weight'), style: 'cancel' },
        { text: 'บันทึก', onPress: () => this.recordWeight(this.state.weight, this.state.selectedDate) },
      ]
    );
  }

  async recordWeight(weight, date) {

    const userId = await AsyncStorage.getItem('userId');
    const username = await AsyncStorage.getItem('username');

    const data = qs.stringify({
      weight: weight,
      userId: userId,
      username: username,
      date: this.state.selectedDate
    })

    httpClient
      .post('/record_weight/', data)
      .then(res => {
        if (res.data.type == 'success') {
          console.log('navigate')
          this.props.navigation.popToTop();
        } else {
          alert("Error : " + res.data.type)
        }

      })

  }

  dateToData = (date) => {
    const months = {
      'null': 0,
      'มกราคม': 1,
      'กุมภาพันธ์': 2,
      'มีนาคม': 3,
      'เมษายน': 4,
      'พฤษภาคม': 5,
      'มิถุนายน': 6,
      'กรกฎาคม': 7,
      'สิงหาคม': 8,
      'กันยายน': 9,
      'ตุลาคม': 10,
      'พฤษจิกายน': 11,
      'ธันวาคม': 12,
    }
    const splitDate = date.split(" ");
    const day = splitDate[0];
    const month = months[splitDate[1]];
    const year = splitDate[2] - 543;

    return `${year}-${month}-${day}`
  }

  async editWeight(newWeight, date) {

    const userId = await AsyncStorage.getItem('userId');
    const username = await AsyncStorage.getItem('username');

    const data = qs.stringify({
      weight: newWeight,
      userId: userId,
      date: this.dateToData(date)
    })

    httpClient
      .put('/edit_record_weight/', data)
      .then(res => {
        if (res.data.type == 'success') {
          console.log('navigate')
          this.setState({ dialogVisible: false, newWeight: '', editRecordDate: '' })
          this.loadRecord()
        } else {
          alert("Error : " + res.data.type)
        }

      })

  }

  render() {
    return (
      <Root>
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
                  updateWeek={true}
                  datesWhitelist={this.state.whitelist}
                  onDateSelected={(value) => this.setState({ selectedDate: moment(new Date(value)).format("YYYY-MM-DD hh:mm:ss") })}
                />
              </View>
              {/* <Text> Date : { this.state.selectedDate } </Text> */}
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10, borderColor: '#272C35', borderWidth: 1, borderRadius: 5 }}>
                <View style={{ justifyContent: 'center', padding: 10 }}>
                  <TextInput
                    autoFocus
                    placeholder='กรอกน้ำหนัก'
                    style={{ flex: 1, fontSize: 34, fontWeight: '200' }}
                    keyboardType='numeric'
                    maxLength={3}
                    underlineColorAndroid="transparent"
                    onChangeText={(weight) => this.setState({ weight })}
                    placeholderTextColor="#24242477"
                  />
                  <Text style={{ flex: 1, fontSize: 24, fontWeight: '200', textAlign: 'right' }}>กิโลกรัม</Text>
                </View>
                <View style={{ justifyContent: 'center', backgroundColor: '#272C35', }}>

                  {
                    this.state.weight == undefined && this.state.weight == "" && <Text></Text>
                  }
                  {
                    this.state.weight !== undefined && this.state.weight !== "" && <TouchableOpacity onPress={this.confirmRecord} >
                      <Text style={{ flex: 1, fontWeight: '200', fontSize: 20, padding: 30, color: '#fff' }}>
                        บันทึก
                </Text>
                    </TouchableOpacity>
                  }

                </View>
              </View>
              {
                this.state.isFetching && <ActivityIndicator size="large" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} />
              }
              {
                !this.state.isFetching && this.state.recordWeightDataRev.length ? (
                  this.state.recordWeightDataRev.map((recordWeight, i) => {
                    return <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 0 }}>
                      <View style={{ flexDirection: 'column', padding: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '400' }}>{recordWeight.RECORD_VALUE} กิโลกรัม</Text>
                        <Text style={{ fontSize: 16, color: '#272C3599' }}>{this.toDate(recordWeight.RECORD_DATE)}</Text>
                      </View>
                      <View style={{ flexDirection: 'column', padding: 10 }}>
                        <TouchableOpacity onPress={() => this.setState({ dialogVisible: true, editRecordDate: this.toDate(recordWeight.RECORD_DATE), editRecordValue: recordWeight.RECORD_VALUE })}>
                          <Text style={{ color: '#272C35', fontSize: 16, fontWeight: '400', backgroundColor: '#ffffff', borderWidth: 1, borderRadius: 5, padding: 5, borderColor: '#272C35' }}>
                            แก้ไข
                        </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
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
                      <Text style={{ fontSize: 20 }}>
                        แก้ไขน้ำหนัก
                      </Text>
                      <Text style={{ fontSize: 20 }}>
                        วันที่ {this.state.editRecordDate}
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center', padding: 0, marginTop: 5, marginBottom: 5 }}>
                      <TextInput
                        value={this.state.editRecordValue}
                        style={{ fontSize: 20, fontWeight: '200', padding: 10, color: '#000000', borderColor: '#000000', borderWidth: 1, borderRadius: 5 }}
                        keyboardType='numeric'
                        maxLength={3}
                        underlineColorAndroid="#272C35"
                        onChangeText={(newWeight) => this.setState({ newWeight })}
                      />
                    </View>

                    {
                      this.state.newWeight == undefined && this.state.newWeight == "" && <Text></Text>
                    }

                    {
                      this.state.newWeight !== undefined && this.state.newWeight !== "" && <TouchableOpacity onPress={() => this.editWeight(this.state.newWeight, this.state.editRecordDate)}>
                        <Text style={{ fontSize: 20, textAlign: 'center', color: '#F1F1F2', borderColor: '#757575', borderStyle: 'solid', borderWidth: 1, borderRadius: 5, paddingLeft: 12, paddingRight: 12, paddingBottom: 3, paddingTop: 3, marginTop: 3, backgroundColor: '#757575', width: '100%' }}>
                          ยืนยันการแก้ไข
                                        </Text>
                      </TouchableOpacity>
                    }

                    <TouchableOpacity onPress={() => this.setState({ dialogVisible: false, newWeight: '', editRecordDate: '' })}>
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
      </Root>


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

export default AddRecordWeightScreen
