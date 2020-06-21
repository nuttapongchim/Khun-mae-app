import { AsyncStorage } from 'react-native';

import axios from 'axios';
import join from 'url-join';

var isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async (config) => {

    try {
        if (!isAbsoluteURLRegex.test(config.url)) {

            const userToken = await AsyncStorage.getItem('userToken')

            if (userToken != null) {
                config.headers = { 
                    'x-access-token': userToken,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            }

            config.url = join('http://203.150.243.150:3003/api/v1', config.url);

        }
        

        return config;
        
    } catch (err) {
        console.log('Error in HttpClient : ' + err)
    }

});
 
export const httpClient = axios;
