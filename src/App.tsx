import React, {useEffect, useState} from 'react';
import Styled from 'styled-components/native';
import {Text, Image, Button} from 'react-native';
import axios from 'axios';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const Container = Styled.View`
    
    flex: 1;
`;

const Profile = Styled.Image`
 height: 70;
    width: 70;
    borderRadius: 75;
    borderWidth: 3;
    borderColor: rgb(255,255,255);
`;

const ButtonGroup = Styled.View`
    flex-direction: row
    justify-content: center
    padding: 10px 0px
`;

const GoogleMap = () => {
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
        <Button title="촬영" />
        <Button title="앨범" />
      </ButtonGroup>
    </Container>
  );
};

export default GoogleMap;
