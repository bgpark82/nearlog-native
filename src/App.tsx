import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.View`
  height: 40px;
  flex:1;
  justify-content: center;
  align-items: center;
  background-color: #EEE;
`;

const Label = Styled.Text`
  font-weight: bold;
`;

interface Props {}

const App = ({}: Props) => {
  return (
    <Container>
      <Label>Hello</Label>
    </Container>
  );
};

export default App;
