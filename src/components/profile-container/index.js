import React from 'react';
import { connect } from 'react-redux';

import UserProfileForm from '../userProfile-form';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest } from '../../actions/favorite-actions.js';
import { userValidation, logError, formatDate } from './../../lib/util.js';

class ProfileContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  componentWillMount() {
    return userValidation(this.props);
  }

  handleProfileUpdate = profile => {
    return this.props.userProfileUpdate(profile)
      .catch(logError);
  };
  
  render(){
    let profileImage = this.props.userProfile && this.props.userProfile.image ? this.props.userProfile.image : require('./../helpers/assets/icons/profilePlaceholder.jpeg');
    let name = this.props.userProfile.username;
    return (
      <div className='profile-container page-outer-div'>
        <div className='grid-container'>
          <div>
            <div className='row'>
              <div className='col-md-8'>
                <div className='createOuter'>
                  <div className='page-form'>
                    <UserProfileForm 
                      userProfile={this.props.userProfile} 
                      onComplete={this.handleProfileUpdate}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-4 hideMedium'>
                <div className='mainContainer'>
                  <div className='mainContainer-header'>
                    <div className='left'>
                      <p className='mainContainerHeader'>{name}</p>
                    </div>
                  </div>
                  <div className='mainContainerSection'>
                    <div className='mainContainerSectionWrapper'>
                      <div className='container'>
                        <div className='inner-wrapper'>
                          <div className='profile-image-div'>
                            <img className='profile-image' src={profileImage} />
                          </div>
                          <div className='userProfileData'>
                            <p>Member Since: {formatDate(this.props.userProfile.createdOn)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => ({
  userProfile: state.userProfile,
  favorites: state.favorites,
})

let mapDispatchToProps = (dispatch) => ({
  favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  userProfileUpdate: profile => dispatch(userProfileUpdateRequest(profile)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);