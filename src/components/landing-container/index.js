import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { signUpRequest, signInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { recipesFetchRequest } from '../../actions/search-actions.js';
import Modal from '../helpers/modal';
import UserAuthForm from '../userAuth-form';
import SeachBar from '../searchBar';
import { logError, renderIf } from './../../lib/util.js';

class LandingContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = { authFormAction: '', formDisplay: false, };
  }

  handleSignin = (user, errCB) => {
    return this.props.signIn(user)
      .then(() => this.props.userProfileFetch())
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };
  handleSignup = (user, errCB) => {
    return this.props.signUp(user)
      .then(() => this.props.userProfileFetch())
      .catch(err => {
        logError(err);
        errCB(err);
      });
  };
  handleSearch = (searchParams) => {
    console.log('searchParams: ',searchParams);
    if(!searchParams.minCals) searchParams.minCals='0';
    if(!searchParams.maxCals) searchParams.maxCals='10000';
    let ingredients = searchParams.maxIngredients ? `&ingr=${searchParams.maxIngredients}` : '';
    let diet = searchParams.dietOption ? `&diet=${searchParams.dietOption}` : '';
    let health = searchParams.healthOption ? `&health=${searchParams.healthOption}` : '';
    let queryParams = `&calories=${searchParams.minCals}-${searchParams.maxCals}${health}${diet}${ingredients}`;
    let queryString = searchParams.searchTerm ? `search?q=${searchParams.searchTerm}` : null;
    console.log('queryString: ', queryString);
    console.log('queryParams: ', queryParams);
  
    return this.props.recipesFetch(queryString, queryParams)
      .then(() => {
        if(queryString) {
          return this.props.history.push(`/search/${queryString}${queryParams}`);
        } else {
          return this.props.history.push(`/search/?q=${queryString}${queryParams}`);
        }
      })
      .catch(err => {
        logError(err);
        // errCB(err);
      });
  };

  render() {
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    return (
      <section className='container'>
        <p> landing container</p>
        {renderIf(!this.props.userAuth,
          <div id='signupOrLogin' className='row'>
            <div className='col-xs-12 col-sm-12 com-lg-12 col-lg-12'>
              <p id='signupOrLoginText'><span className='line'>Save the recipes </span> <span className='line'> you love!</span></p>
              <span className='button orange' onClick={() => this.setState({formDisplay: true, authFormAction: 'Sign Up'})}>Sign Up</span>
              <span className='button green' onClick={() => this.setState({formDisplay: true, authFormAction: 'Sign In'})}>Log In</span>
            </div>
          </div>
        )}
        <SeachBar onComplete={this.handleSearch} />
        <div>
          {renderIf(this.state.formDisplay,
            <div>
              <Modal heading='Chow' close={() => this.setState({ formDisplay: false })}>
                <UserAuthForm authFormAction={this.state.authFormAction} onComplete={handleComplete} />
                <div>
                  {renderIf(this.state.authFormAction==='Sign In',
                    <button onClick={() => this.setState({authFormAction: 'Sign Up'})}>Sign Up</button>
                  )}
                  {renderIf(this.state.authFormAction==='Sign Up',
                    <button onClick={() => this.setState({authFormAction: 'Sign In'})}>Sign In</button>
                  )}
                </div>
              </Modal>
            </div>
          )}
        </div>
      </section>
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
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);