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
import * as firebase from 'firebase';
import DeviceInfo from 'react-native-device-info';

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

firebase.initializeApp(firebaseConfig);
var functions = firebase.functions();

export default class App extends Component {

  state = {
    numPeopleInRegion: 0,
    location: null,
    markers: [],
    loading: false,
  }

  sendAndReceive() {
    this.setState({loading: true});
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);

        this.setState({ location: location });
        // console.log(location)

        var locationInfo = {
          id: DeviceInfo.getUniqueId(),
          lat: position.coords.latitude,
          long: position.coords.longitude,
          timestamp: position.timestamp
        }

        var updateLocation = firebase.functions().httpsCallable('updateLocation');

        var that = this

        this.map.getMapBoundaries().then(function(value) {
          updateLocation({locationInfo: locationInfo, boundaries: value}).then(result => {
            // Read result of the Cloud Function.
            that.setState({loading: false})
            var numPeopleInArea = result.data.numPeopleInArea;
            this.setState({numPeopleInRegion: numPeopleInArea})
          }, error => {
            console.log(error)
          });
        }, error => {
          console.log(error)
        });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  ***REMOVED***

  componentDidMount() {
    this.sendAndReceive()
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          ref={ref => {this.map = ref;}}
          initialRegion={{
            latitude: 37.600425,
            longitude: -122.385861,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onRegionChange={this.sendAndReceive}
        >
          {this.state.markers != null ? this.state.markers.map(marker => (
            <Marker
              key = {marker.key}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          )) : null}
        </MapView>
        {this.state.loading ? 
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
          :
          <Text>{this.state.numPeopleInRegion}</Text>
        }
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.sendAndReceive()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Refresh</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    flex: 1,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
    // marginBottom: 400,
    marginBottom: 100,
  },
  members: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
  },
});