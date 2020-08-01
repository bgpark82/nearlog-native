import React, {useEffect, useState} from 'react';
import Styled from 'styled-components/native';
import {Text, Image, Button, Platform} from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const Container = Styled.View`
    flex: 1;
`;

const Loading = Styled.View`
  flex:1;
  justify-content:center;
  align-items:center;
`;

const LoadingMessage = Styled.Text`
  fontSize:20px;
`;

const ProfileWrapper = Styled.View`
  position:relative;
`;

const Emoji = Styled.Text`
  position:absolute;
  top:0;
  left:50;
  right:50;
`;

const Profile = Styled.Image`
 height: 70px;
    width: 70px;
    borderRadius: 75px;
    borderWidth: 3px;
    borderColor: rgb(255,255,255);
`;

const ButtonGroup = Styled.View`
    flex-direction: row;
    justify-content: center;
    padding: 5px 0px;
    align-items:center;
`;

const ImagePickerButton = Styled.TouchableOpacity`
`;

const ButtonTitle = Styled.Text`
    fontSize: 18px;
    color:rgb(29,137,255);
    fontWeight: 500;
    padding:10px 15px;
`;

const GoogleMap = () => {
  const options = {
    title: 'Load Photo',
    customButtons: [
      {name: 'button_id_1', title: 'CustomButton 1'},
      {name: 'button_id_2', title: 'CustomButton 2'},
      ,
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    maxWidth: 8000,
    maxHeight: 8000,
  };

  const [location, setLocation] = useState();
  const [imageSource, setImageSource] = useState('');
  const [user, setUser] = useState({});
  const [markers, setMarkers] = useState([
    {
      latitude: 37.506892,
      longitude: 127.020445,

      image: 'https://nearlog.s3.ap-northeast-2.amazonaws.com/static/home.png',
    },
    {
      latitude: 37.505973,
      longitude: 127.022733,

      image: 'https://nearlog.s3.ap-northeast-2.amazonaws.com/static/bien.png',
    },
    {
      latitude: 37.506214,
      longitude: 127.021748,

      image: 'https://nearlog.s3.ap-northeast-2.amazonaws.com/static/dopio.png',
    },
  ]);

  let _watchId;

  useEffect(() => {
    _watchId = Geolocation.watchPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 100,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  }, [location]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    axios.get('http://13.209.217.56/api/v1/user').then((response) => {
      setUser(response.data.data[0]);
      const email = response.data.data[0].email;
      axios.get(`http://13.209.217.56/api/v1/poi/list/${email}`).then((res) => {
        setMarkers([...markers, ...res.data.data]);
        console.log(markers);
      });
    });

    return () => {
      if (_watchId !== null) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, []);

  useEffect(() => {}, [markers]);

  const showCamera = (): void => {
    ImagePicker.launchCamera(options, (response) => {
      if (response.error) {
        console.log('LaunchCamera Error: ', response.error);
      } else {
        axios
          .post('http://13.209.217.56/api/v1/image/upload', {
            image: response.data,
            type: response.type,
            latitude: location.latitude,
            longitude: location.longitude,
            userId: 'bgpark82@gmail.com',
          })
          .then((res) => {
            setMarkers([...markers, res.data.data]);
          })
          .catch((err) => console.log(err));
        setImageSource(response.uri);
      }
    });
  };

  const showCameraRoll = (): void => {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.error) {
        console.log('LaunchImageLibrary Error: ', response.error);
      } else {
        axios
          .post('http://13.209.217.56/api/v1/image/upload', {
            image: response.data,
            type: response.type,
            latitude: location.latitude,
            longitude: location.longitude,
            userId: 'bgpark82@gmail.com',
          })
          .then((res) => {
            setMarkers([...markers, res.data.data]);
          })
          .catch((err) => console.log(err));
        setImageSource(response.uri);
      }
    });
  };

  return (
    <Container>
      {location ? (
        <MapView
          onRegionChange={() => {
            setLocation({
              latitude: location.latitude,
              longitude: location.longitude,
            });
          }}
          onRegionChangeComplete={() => {
            setLocation({
              latitude: location.latitude,
              longitude: location.longitude,
            });
          }}
          style={{flex: 1}}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}>
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="this is a marker"
            description="this is a marker example">
            <Profile source={{url: user.profile}} />
          </Marker>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}>
              <Profile source={{url: marker.image}} />
            </Marker>
          ))}
        </MapView>
      ) : (
        <Loading>
          <LoadingMessage>Loading...</LoadingMessage>
        </Loading>
      )}
      <ButtonGroup>
        <ImagePickerButton onPress={showCamera}>
          <ButtonTitle>촬영</ButtonTitle>
        </ImagePickerButton>
        <ImagePickerButton onPress={showCameraRoll}>
          <ButtonTitle>앨범</ButtonTitle>
        </ImagePickerButton>
      </ButtonGroup>
    </Container>
  );
};

export default GoogleMap;
