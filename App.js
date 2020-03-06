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

export default class App extends Component {

  state = {
    location: null,
    markers: [],
    loading: false,
  }

  // sendReceiveMarkers() {
    
  // }

  sendAndReceive() {
    this.setState({loading: true});
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);

        this.setState({ location: location });

        if (location != null) {
          firebase.database().ref('locations/1').set({
            location: this.state.location,
          });
        }
        // if (location != null) {
        //   const dbh = firebase.firestore();

        //   dbh.collection("locations").doc(1).set({
        //     lastLocation: location,
        //   })
        // }
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    var ref = firebase.database().ref("locations");
    // console.log("hi");
    var that = this;
    ref.on("value", function(snapshot) {
      var people = snapshot.val();
      // Alert.alert(JSON.stringify(people));
      // Alert.alert(JSON.stringify(people[1].location));
      person = JSON.parse(people[1].location)
      // console.log("hi" + people);
      // Alert.alert(newUpdate);
      // console.log("Author: " + newUpdate);
      that.state.markers = [
        {
          key: "1",
          latlng: {
            latitude: person.coords.latitude,
            longitude: person.coords.longitude,
          },
          title: "1",
          description: "In this area for 1 hour",
        },
      ]
      that.state.loading = false;
    });
    // this.state.markers = [
    //   {
    //     key: 1,
    //     latlng: {
    //       latitude: 37.869054554003895,
    //       longitude: -122.2601645033542,
    //     },
    //     title: "1",
    //     description: "In this area for 1 hour",
    //   },
    // ]
  ***REMOVED***

  componentDidMount() {
    // findCoordinates();
    // sendReceiveMarkers();
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
        >
          {this.state.markers != null ? this.state.markers.map(marker => (
            <Marker
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
          null
        }
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.sendAndReceive()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Refresh</Text>
          </TouchableOpacity>
        </View>
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