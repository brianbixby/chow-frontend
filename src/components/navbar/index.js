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
    this.state={ visible: false, authFormAction: '', formDisplay: false,};
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

  handleSignOut = () => {
    this.props.signOut();
    this.props.history.push('/');
  };

  render() {
    let user = require('./../helpers/assets/icons/user.icon.svg');
    let caretDown = require('./../helpers/assets/icons/caret-down.icon.svg');
    let profileLink = this.props.userProfile && this.props.userProfile._id ? `/profile/${this.props.userProfile._id}` : '';
    let handleComplete = this.state.authFormAction === 'Sign Up' ? this.handleSignup : this.handleSignin;
    const { location } = this.props;
 
    return (
      <div>
        <header className='navbar'>
          <nav>
            <div className='logo'>
                <Link to='/' className={classToggler({ 'link': true, 'logo-text': true, 'intro-text': !this.props.userAuth })}>
                  <span id='navLogo'>CHOW</span> <span id='navTagline'className='disable-link '>     Eat Great</span>
                </Link>
            </div>
            <ul className='socials'>
              <li className='social dropdown'>
                  <div>
                    <div className='avatarDiv' onClick={() => this.setState({ visible: !this.state.visible })} >
                      <img className='caretDown' src={caretDown}/>
                      <img className='noProfileImageNav' src={user} />
                    </div>
                    <div className={ this.state.visible ? 'slideIn dropdownDiv' : 'slideOut dropdownDiv' }>
                      {renderIf(!this.props.userAuth,
                        <div>
                          <Link to='/' className='link' onClick={() => this.setState({ visible: !this.state.visible })}>Signup</Link>
                          <Link to='/leagues' className='link' onClick={() => this.setState({ visible: !this.state.visible })}>Login</Link>
                        </div>
                      )}
                      {renderIf(this.props.userAuth,
                        <div>
                          <Link to={profileLink} className='link' onClick={() => this.setState({ visible: !this.state.visible })}>Favorites</Link>
                          <p className='logout link' onClick={this.handleSignOut}>Logout</p>
                        </div>
                      )}
                    </div>
                  </div>
              </li>
            </ul>
          </nav>
      </header>
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
      {renderIf(!this.props.userAuth && location.pathname == '/',
          <div id='signupOrLogin' className='row'>
            <div className='col-xs-12 col-sm-12 com-lg-12 col-lg-12'>
              <p id='signupOrLoginText'><span className='line'>Save the recipes </span> <span className='line'> you love!</span></p>
              <span className='button orange' onClick={() => this.setState({formDisplay: true, authFormAction: 'Sign Up'})}>Sign Up</span>
              <span className='button green' onClick={() => this.setState({formDisplay: true, authFormAction: 'Sign In'})}>Log In</span>
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