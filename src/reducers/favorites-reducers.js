import { checkAndAdd } from '../lib/util.js';

let validateFavorite = favorite => {
  if(!favorite._id || !favorite.name || !favorite.image || !favorite.url) {
    throw new Error('VALIDATION ERROR: favorite requires a id, name, image, url.');
  }
};

export default (state=[], action) => {
  let { type, payload } = action;

  switch(type) {
    case 'FAVORITE_FETCH':
      validatefavorite(payload);
      return checkAndAdd(payload, state);
    case 'FAVORITES_FETCH':
      return [payload];
    case 'FAVORITE_DELETE':
      // payload is the deleted favorite's ID
      if(state === []) throw new Error('USAGE ERROR: can not delete favorite not in state');
      return state.filter(favorite => favorite._id !== payload);
    case 'SIGN_OUT':
      return [];
    default:
      return state;
  }
};