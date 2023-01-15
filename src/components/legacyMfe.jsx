import React from 'react';
import Counter from '../features/Counter/Counter';
import { LazyLoadIKS } from '../mfe/getMfe';

function LegacyMfe() {
  return (
    <div>
      <LazyLoadIKS /> <Counter />
    </div>
  );
}

export default LegacyMfe;
