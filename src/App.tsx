import React, {useEffect, useState} from 'react';
import Styled from 'styled-components/native';
import {Text, Image} from 'react-native';
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

const GoogleMap = () => {
  const [user, setUser] = useState({});

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
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider={PROVIDER_GOOGLE}>
        <Marker
          coordinate={{latitude: 37.78825, longitude: -122.4324}}
          title="this is a marker"
          description="this is a marker example">
          <Profile source={{url: user.profile}} />
        </Marker>
      </MapView>
    </Container>
  );
};

export default GoogleMap;
