import React from 'react';
import { connect } from 'react-redux';

import UserAuthForm from '../userAuth-form';
import { signUpRequest, signInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest } from '../../actions/favorite-actions.js';
import { logError, renderIf } from './../../lib/util.js';

class AuthContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = { authFormAction: '' };
  }
  componentWillMount() {
    if (this.props.userAuth) this.props.history.push(`/profile/${this.props.userProfile.username}`);
    let authAction = this.props.match.params.authAction === "signin" ? "Sign In" : "Sign Up";
    this.setState({ authFormAction: authAction });
  }

  handleSignin = (user, errCB) => {
    return this.props.signIn(user)
      .then(() => {
        return this.props.userProfileFetch()
          .catch(err => logError(err));
      })
      .then(profile => {
        return this.props.favoritesFetch(profile.body)
          .catch(err => logError(err));
      })
      // .then(() => this.props.history.goBack)
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };

  handleSignup = (user, errCB) => {
    return this.props.signUp(user)
      .then(() => {
        return this.props.userProfileFetch()
          .catch(err => logError(err));
      })
      .then(profile => {
        return this.props.favoritesFetch(profile.body)
          .catch(err => logError(err));
      })
      // .then(() => this.props.history.goBack)
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };

  render() {
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    return (
      <div >
          <p>HELLO</p> 
          <div>
            <div>
                <UserAuthForm authFormAction={this.state.authFormAction} onComplete={handleComplete} />

                <div className='userauth-buttons'>
                {renderIf(this.state.authFormAction==='Sign In',
                    <button className='b-button dark-button' onClick={() => this.setState({authFormAction: 'Sign Up'})}>Sign Up</button>
                )}

                {renderIf(this.state.authFormAction==='Sign Up',
                    <button className='b-button dark-button' onClick={() => this.setState({authFormAction: 'Sign In'})}>Sign In</button>
                )}
                </div>
            </div>
          </div>
      </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
});

let mapDispatchToProps = dispatch => {
  return {
    signUp: user => dispatch(signUpRequest(user)),
    signIn: user => dispatch(signInRequest(user)),
    favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);