import React from 'react';
import { connect } from 'react-redux';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest } from '../../actions/favorite-actions.js';
import { userValidation } from './../../lib/util.js';

class LandingContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillMount() {
    return userValidation(this.props);
  }

  render() {
    return (
      <section className='container'>
        <p> landing container</p>
      </section>
    );
  }
}

let mapStateToProps = state => ({
  // userAuth: state.userAuth,
  // userProfile: state.userProfile,
});

let mapDispatchToProps = dispatch => {
  return {
    favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);