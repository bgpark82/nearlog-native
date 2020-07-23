import React, {useEffect, useState} from 'react';
import Styled from 'styled-components/native';
import {Text, Image, Button} from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const Container = Styled.View`
    
    flex: 1;
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

  const [imageSource, setImageSource] = useState('');
  const [user, setUser] = useState({});
  const [markers, setMarkers] = useState([
    {
      title: 'home',
      coordinates: {
        latitude: 37.506892,
        longitude: 127.020445,
      },
      image: 'https://nearlog.s3.ap-northeast-2.amazonaws.com/static/home.png',
    },
    {
      title: 'bien',
      coordinates: {
        latitude: 37.505973,
        longitude: 127.022733,
      },
      image: 'https://nearlog.s3.ap-northeast-2.amazonaws.com/static/bien.png',
    },
    {
      title: 'bien',
      coordinates: {
        latitude: 37.506214,
        longitude: 127.021748,
      },
      image: 'https://nearlog.s3.ap-northeast-2.amazonaws.com/static/dopio.png',
    },
  ]);

  useEffect(() => {
    axios.get('http://13.209.217.56/api/v1/user').then((response) => {
      console.log(response);
      setUser(response.data.data[0]);
    });
  }, []);

  const showCamera = (): void => {
    ImagePicker.launchCamera(options, (response) => {
      if (response.error) {
        console.log('LaunchCamera Error: ', response.error);
      } else {
        console.log(response.uri);
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
          .post('http://13.209.217.56/api/v1/base', {
            uploadFile: response.data,
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));

        axios
          .post('http://13.209.217.56/api/v1/native', {
            latitude: response.latitude,
            longitude: response.longitude,
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));

        setImageSource(response.uri);
      }
    });
  };

  return (
    <Container>
      <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: 37.506706,
          longitude: 127.021544,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider={PROVIDER_GOOGLE}>
        <Marker
          coordinate={{latitude: 37.506706, longitude: 127.021544}}
          title="this is a marker"
          description="this is a marker example">
          <Profile source={{url: user.profile}} />
        </Marker>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinates}
            title={marker.title}>
            <Profile source={{url: marker.image}} />
          </Marker>
        ))}
      </MapView>
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
