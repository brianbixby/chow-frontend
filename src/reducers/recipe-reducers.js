export default (state=null, action) => {
  let { type, payload } = action;

  switch(type) {
    case 'RECIPE_FETCH':
      return payload;
    default:
      return state;
  }
};