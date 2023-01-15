import { Button } from '@mui/material';
import React from 'react';

function Header({ flippedTheFunc }) {
  return (
    <div>
      <div>Header</div>
      <Button onClick={() => flippedTheFunc(true)}>flipped</Button>
      <Button onClick={() => flippedTheFunc(false)}>unflip</Button>
    </div>
  );
}

export default Header;
