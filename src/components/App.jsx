import React from 'react';
import { FlippedMfe } from '../mfe/getMfe';
import Header from './Header';
import LegacyMfe from './legacyMfe';

function App() {
  const [flip, setFlip] = React.useState(false);
  const flippedTheFunc = (val) => {
    localStorage.setItem('flipped', val);
    setFlip(val);
  };
  return (
    <div>
      <Header flippedTheFunc={flippedTheFunc} />
      {!flip ? (
        <LegacyMfe />
      ) : (
        <>
          <FlippedMfe />
        </>
      )}
    </div>
  );
}

export default App;
