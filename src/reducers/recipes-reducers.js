export default (state=[], action) => {
  let { type, payload } = action;

  switch(type) {
    case 'RECIPES_FETCH':
      return payload;
    default:
      return state;
  }
};