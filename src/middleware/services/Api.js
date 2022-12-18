import axios from 'axios';

export const getService = ({ url }) =>
  /* istanbul ignore next */

  axios
    .get(url)
    .then((response) => response)
    .catch((error) => error);
