import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { signOut, signUpRequest, signInRequest } from '../../actions/userAuth-actions.js';
import Modal from '../helpers/modal';
import UserAuthForm from '../userAuth-form';
import { classToggler, renderIf } from '../../lib/util.js';


class Navbar extends React.Component {
  constructor(props){
    super(props);
    this.state={ navOpen: false, authFormAction: '', formDisplay: false };
  }

  handleHamburgerClick = () => this.setState({ navOpen: !this.state.navOpen });
  closeHamburger = () => this.setState({ navOpen: false });
  handleSignUpModal = () => this.setState({ authFormAction: 'Sign Up', formDisplay: true, navOpen: false });
  handleSignInModal = () => this.setState({ authFormAction: 'Sign In', formDisplay: true, navOpen: false });
  handleFormSwitchToSignUp = () => this.setState({ authFormAction: 'Sign Up' });
  handleFormSwitchToSignIn = () => this.setState({ authFormAction: 'Sign In' });
  closeModal = () => this.setState({ formDisplay: false });

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

  handleSignOut = () => {
    this.props.signOut();
    this.setState({ navOpen: false });
    this.props.history.push('/');
  };

  render() {
    let profileLink = this.props.userProfile && this.props.userProfile._id ? `/profile/${this.props.userProfile._id}` : '';
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    const { location } = this.props;
    return (
      <div>
        <header>
          <nav>
            <div>
              <div className='logo'>
                  <Link to='/' onClick={this.closeHamburger}>
                    <span id='navLogo'>CHOW</span> <span id='navTagline'className='disable-link '>     Eat Great</span>
                  </Link>
              </div>
              <div className={classToggler({ 'hamburger': true, 'open': this.state.navOpen })} onClick={this.handleHamburgerClick}>
                <span className="top buns"></span>
                <span className="bottom buns"></span>
              </div>
              <section className={classToggler({ 'hamburgerToggle': true, 'slideIn': this.state.navOpen })}>
                {renderIf(!this.props.userAuth,
                  <ul className="dropDownList">
                    <li className="dropDownListItem"><p className="dropDownLink" onClick={this.handleSignUpModal}>Signup</p></li>
                    <li className="dropDownListItem"><p className="dropDownLink" onClick={this.handleSignInModal}>Login</p></li>
                  </ul>
                )}
                {renderIf(this.props.userAuth,
                  <ul className="dropDownList">
                    <li className="dropDownListItem"><Link to={profileLink} className="dropDownLink" onClick={this.closeHamburger}>Favorites</Link></li>
                    <li className="dropDownListItem"><p className="dropDownLink" onClick={this.handleSignOut}>Logout</p></li>
                  </ul>
                )}
              </section>
              {/* {renderIf(this.state.navOpen, */}
                <div className={classToggler({ 'dropdownOverlay': true, 'overlayFadeIn': this.state.navOpen })} onClick={this.closeHamburger}></div>
              {/* )} */}
            </div>
          </nav>
      </header>
      <div>
        {renderIf(this.state.formDisplay,
          <div>
            <Modal heading='Chow' close={this.closeModal}>
              <UserAuthForm authFormAction={this.state.authFormAction} onComplete={handleComplete} />
              <div>
                {renderIf(this.state.authFormAction==='Sign In',
                  <button onClick={this.handleFormSwitchToSignUp}>Sign Up</button>
                )}
                {renderIf(this.state.authFormAction==='Sign Up',
                  <button onClick={this.handleFormSwitchToSignIn}>Sign In</button>
                )}
              </div>
            </Modal>
          </div>
        )}
      </div>
      {renderIf(!this.props.userAuth && location.pathname == '/',
        <div id='signupOrLogin' className='row'>
          <div className='col-xs-12 col-sm-12 com-lg-12 col-lg-12'>
            <p id='signupOrLoginText'><span className='line'>Save the recipes </span> <span className='line'> you love!</span></p>
            <span className='button orange' onClick={this.handleSignUpModal}>Sign Up</span>
            <span className='button green' onClick={this.handleSignInModal}>Log In</span>
          </div>
        </div>
      )}
    </div>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
});

let mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut()),
  signUp: user => dispatch(signUpRequest(user)),
  signIn: user => dispatch(signInRequest(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);