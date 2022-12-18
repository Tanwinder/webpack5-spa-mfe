/* eslint-disable react/button-has-type */
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from './counterSlice';
import { FETCH_NUMBER_SAGA } from './counterActionTypes';

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <div>
      <div>
        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          -
        </button>
        <span>{count}</span>
        <button aria-label="Increment value" onClick={() => dispatch(increment())}>
          +
        </button>
      </div>
      <div>
        <input
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        {/* buttons */}
        {/* add random number asynchronously with redux saga */}
        <button onClick={() => dispatch({ type: FETCH_NUMBER_SAGA })}>
          Add Random number with Saga
        </button>
      </div>
    </div>
  );
};

export default Counter;
