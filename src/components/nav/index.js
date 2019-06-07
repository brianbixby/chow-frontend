import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Avatar from '../helpers/avatar';
import SearchBar from '../searchBar';
import { signOut } from '../../actions/userAuth-actions.js';
import { recipesFetchRequest } from '../../actions/search-actions.js';
import { logError } from '../../lib/util.js';

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state={};
    }

    handleSignOut = () => {
        this.props.signOut();
        this.props.history.push('/');
    };

    handleSearch = (searchParams) => {
        if(!searchParams.minCals) searchParams.minCals='0';
        if(!searchParams.maxCals) searchParams.maxCals='10000';
        let ingredients = searchParams.maxIngredients ? `&ingr=${searchParams.maxIngredients}` : '';
        let diet = searchParams.dietOption ? `&diet=${searchParams.dietOption}` : '';
        let health = searchParams.healthOption ? `&health=${searchParams.healthOption}` : '';
        let queryParams = `&calories=${searchParams.minCals}-${searchParams.maxCals}${health}${diet}${ingredients}`;
        let queryString = searchParams.searchTerm ? `search?q=${searchParams.searchTerm}` : 'search?q=';
      
        return this.props.recipesFetch(queryString, queryParams)
          .then(() => this.props.history.push(`/search/${queryString}${queryParams}`))
          .catch(err => logError(err));
    };

    handleProfileDivClick = e => {
        let link = this.props.userAuth ? `/profile/${this.props.userProfile.username}` : '/account/signup';
        this.props.history.push(link);
    }

    render() {
        let spoon = require('./../helpers/assets/icons/spoon.icon.svg');
        let chevron = require('./../helpers/assets/icons/chevron-down.icon.svg');
        let user = require('./../helpers/assets/icons/user.icon.svg');
        let profileImage = this.props.userProfile && this.props.userProfile.image ? <Avatar url={this.props.userProfile.image} /> : <img className='noProfileImageNav' src={user} />;
        let profileText = this.props.userAuth && this.props.userProfile && this.props.userProfile.username ? this.props.userProfile.username : "Sign Up/ Sign In" ;
        return (
            <nav>
                <div className='homeLinkDiv'>
                    <Link to='/' className='homeLink'>chow <span className='spoonContainer'><img src={spoon} className='spoon'/></span></Link>
                </div>
                <div className='browseDiv'>
                    <p><span>BROWSE</span> <img src={chevron}/></p>
                </div>
                <SearchBar onComplete={this.handleSearch} />
                <div className='navProfileDiv' onClick={this.handleProfileDivClick}>
                    <div className='navProfileDivInner'>
                        <div className='profileImageDiv'>
                            {profileImage}
                        </div>
                        <div className='profileTextDiv'>
                            <p className='profileText'>
                                {profileText}
                            </p>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

let mapStateToProps = state => ({
    userAuth: state.userAuth,
    userProfile: state.userProfile,
});

let mapDispatchToProps = dispatch => ({
    signOut: () => dispatch(signOut()),
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);