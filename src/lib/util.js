export const log = (...args) => console.log(...args);
export const logError = (...args) => console.error(...args);
export const renderIf = (test, component) => test ? component : undefined;
export const classToggler = options => Object.keys(options).filter(key => !!options[key]).join(' ');

export const checkAndAdd = (payload, state) => {
  var found = state.some(function (el) {
      return el._id === payload._id;
  });
  if (!found) state.push(payload);
  return state;
};

export const formatDate = date => {
  let dateArr = new Date(date).toDateString().split(' ');
  return `${dateArr[1]} ${dateArr[2]}, ${dateArr[3]}`;
};

export const userValidation = props => {
  if(!props.userAuth) {
    let { history } = props;
    
    let token = localStorage.token;  
    if(token) {
      props.tokenSignIn(token)
        .then(() => {
          return props.userProfileFetch()
            .catch(err => logError(err));
        })
        .then(profile => {
          return props.favoritesFetch(profile.body)
            .catch(err => logError(err));
        })
        .catch(err => {
          localStorage.removeItem("token");
          logError(err);
          if(props.location.pathname == '/profile/*')
            return history.replace('/');
        });
    } else {
      if(props.location.pathname == '/profile/*')
        return history.replace('/');
    }
  }
  return;
};