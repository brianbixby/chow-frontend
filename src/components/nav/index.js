import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Avatar from '../helpers/avatar';
import SearchBar from '../searchBar';
import { signOut } from '../../actions/userAuth-actions.js';
import { recipesFetchRequest } from '../../actions/search-actions.js';
import { logError, renderIf, classToggler } from '../../lib/util.js';

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state={showBrowse: false, showSearchBarSmall: false };
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

    handleboundCatClick = (item, e) => {
        let queryString = item.link.split("&calories=0-10000")[0];
        let queryParams = item.link.split(queryString)[1];
        return this.props.recipesFetch(queryString, queryParams)
          .then(() => {
						this.setState({showBrowse: false});
						return this.props.history.push(`/search/${queryString}${queryParams}`);
					})
          .catch(err => logError(err));
      };

    render() {
        const categories = [
					{category: "Meal Type", subCategory: [{title: "Appetizers & Snacks", link: "search?q=appetizer&calories=0-10000"}, {title: "Breakfast & Brunch", link: "search?q=brunch&calories=0-10000"}, {title: "Desserts", link: "search?q=dessert&calories=0-10000"}, {title: "Dinner", link: "search?q=dinner&calories=0-10000"}, {title: "Drinks", link: "search?q=drink&calories=0-10000"}]},
					{category: "Ingredient", subCategory: [{title: "Beef", link: "search?q=beef&calories=0-10000"}, {title: "Chicken", link: "search?q=chicken&calories=0-10000"}, {title: "Pasta", link: "search?q=pasta&calories=0-10000"}, {title: "Pork", link: "search?q=pork&calories=0-10000"}, {title: "Salmon", link: "search?q=salmon&calories=0-10000"}]},
					{category: "Diet & Health", subCategory: [{title: "High Protein", link: "search?q=&calories=0-10000&diet=high-protein"}, {title: "Low Carb", link: "search?q=&calories=0-10000&diet=low-carb"}, {title: "Peanut Free", link: "search?q=&calories=0-10000&health=peanut-free"}, {title: "Vegan", link: "search?q=&calories=0-10000&health=vegan"}, {title: "Vegetarian", link: "search?q=&calories=0-10000&health=vegetarian"}]},
					{category: "Cuisine Type", subCategory: [{title: "Italian", link: "search?q=italian&calories=0-10000"}, {title: "Mexican", link: "search?q=mexican&calories=0-10000"}, {title: "Chinese", link: "search?q=chinese&calories=0-10000"}, {title: "Indian", link: "search?q=indian&calories=0-10000"}, {title: "French", link: "search?q=french&calories=0-10000"}]},
				];
        const spoon = require('./../helpers/assets/icons/spoon.icon.svg');
        const chevron = require('./../helpers/assets/icons/chevron-down.icon.svg');
        const user = require('./../helpers/assets/icons/user.icon.svg');
        let profileImage = this.props.userProfile && this.props.userProfile.image ? <Avatar url={this.props.userProfile.image} /> : <img className='noProfileImageNav' src={user} />;
        let profileText = this.props.userAuth && this.props.userProfile && this.props.userProfile.username ? this.props.userProfile.username : "Sign Up/ Sign In" ;
        return (
            <nav>
                <div className='homeLinkDiv'>
                    <Link to='/' className='homeLink'>chow <span className='spoonContainer'><img src={spoon} className='spoon'/></span></Link>
                </div>
                <div className='browseDiv' onClick={() => this.setState({showBrowse: !this.state.showBrowse})}>
                    <p><span>BROWSE</span> <img src={chevron}/></p>
                </div>
                {renderIf(this.state.showBrowse,
									<div className='browsePopup'>
													<div className='browseWrapper'>
															<div className='linksGrid'>
																	<ul className='browseSections'>
																			{categories.map((cat, idx) => {
																					return <li key={idx} className='browseCategories'>
																							<h3>{cat.category}</h3>
																							<span className='iconRight'></span>
																							<ul className='browseSubCategories'>
																									{cat.subCategory.map((sub, subindex) => {
																											let boundCatClick = this.handleboundCatClick.bind(this, sub);
																											return <li key={subindex} onClick={boundCatClick}><p>{sub.title}</p></li>
																									})}
																					</ul>
																			</li>
																			})}
																	</ul>
															</div>
													</div>
											</div>
                )}
                <SearchBar onComplete={this.handleSearch} advancedSearch={() => this.setState({showBrowse: false, showSearchBarSmall: false})} showSearchBarSmall={this.state.showSearchBarSmall} />
                <div onClick={() => this.setState({showSearchBarSmall: !this.state.showSearchBarSmall})} className={classToggler({
									'navSearchIcon': true,
									'showSearchBarSmall': this.state.showSearchBarSmall,
                })}>
                    <div className='navSearchIconInner'>
                        <span className='navSearchIconSpan'></span>
                    </div>
                </div>

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