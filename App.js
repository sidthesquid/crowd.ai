import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';

//firebase
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';

import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';
import MapInput from './MapInput';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

***REMOVED***
  apiKey: "YOUR_API_KEY_HERE",
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***
***REMOVED***

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var functions = firebase.functions();

export default class App extends Component {

  state = {
    numPeopleInRegion: 0,
    location: null,
    markers: [],
    loading: false,
    currSelected: {},
  }

  sendAndReceive(loc) {
    this.setState({loading: true, currSelected: {latitude: loc.lat, longitude: loc.lng}});
    let regionToAnimateTo = {
      longitudeDelta: 0.005,
      latitudeDelta: 0.005,
      ...this.state.currSelected
    }
    this.map.animateToRegion(regionToAnimateTo, 1000);
    Geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);

        this.setState({ location: location });
        // console.log(location)

        console.log("Device ID: " + DeviceInfo.getUniqueId)

        var gpsInfo = {
          id: DeviceInfo.getUniqueId(),
          lat: position.coords.latitude,
          long: position.coords.longitude,
          timestamp: position.timestamp
        }

        var placeInfo = {
          lat: loc.lat,
          long: loc.long,
        }

        var boundaries = {
          southWest: {
            longitude: loc.lng - 0.003,
            latitude: loc.lat - 0.003,
          },
          northEast: {
            longitude: loc.lng + 0.003,
            latitude: loc.lat + 0.003,
          }
        }

        var updateLocation = functions.httpsCallable('updateLocation');

        var that = this

        updateLocation({gpsInfo: gpsInfo, boundaries: boundaries, placeInfo: placeInfo}).then(result => {
          // Read result of the Cloud Function.
          console.log(result)
          that.setState({loading: false})
          var numPeopleInArea = result.data;
          that.setState({numPeopleInRegion: numPeopleInArea})
        }, error => {
          console.log(error)
        });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  ***REMOVED***

  componentDidMount() {
    // this.sendAndReceive()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, zIndex: -1}}>
          <MapView
            style={styles.map}
            ref={ref => {this.map = ref;}}
            showsUserLocation={true}
            initialRegion={{
              latitude: 37.600425,
              longitude: -122.385861,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            >
            { this.state.currSelected['latitude'] ?
            <Marker
              coordinate={this.state.currSelected}
            /> : null
            }
          </MapView>
          {this.state.currSelected['latitude'] ? (this.state.loading ? 
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
            :
            <View style={styles.buttonContainer}>
              <View
                style={[styles.bubble, styles.button]}
              >
              <Text>{this.state.numPeopleInRegion} people in this region.</Text>
              </View>
            </View>
            ) : null
          }
        </View>
        <View style={styles.mapInput}>
          <MapInput
            notifyChange={(loc) => this.sendAndReceive(loc)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 20,
  },
  activityIndicator: {
    flexDirection: 'row',
    marginVertical: 100,
    alignSelf: 'center',
    flex: 1,
  },
  mapInput: {
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    top: 0,
    left: 5,
    right: 5
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    // marginBottom: 400,
    marginTop: 700,
  },
  members: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
  },
});