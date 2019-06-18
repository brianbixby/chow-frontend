import React from 'react';
import { connect } from 'react-redux';

import RecipesMap from '../recipes-map';
import { homepageFetchRequest, homepageFetch, recipeFetch, recipesFetchRequest, recipesFetch } from '../../actions/search-actions.js';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest } from '../../actions/favorite-actions.js';
import { userValidation, logError } from './../../lib/util.js';

class LandingContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillMount() {
    userValidation(this.props);
    if (localStorage.random  && JSON.parse(localStorage.getItem('random'))['timestamp'] > new Date().getTime()) {
      this.props.homepageFetchRequest(JSON.parse(localStorage.getItem('random'))['content']);
    }
    else if (!this.props.homepage || this.props.homepage.length == 0) {
      this.props.homepageFetch()
        .catch(err => logError(err));
    }
    window.scrollTo(0, 0);
  }

  handleBoundItemClick = (item, e) => {
    let queryString = item.link.split("&calories=0-10000")[0];
    let queryParams = "&calories=0-10000";

    if (localStorage.getItem(`${queryString}${queryParams}`) && JSON.parse(localStorage.getItem(`${queryString}${queryParams}`))['timestamp'] > new Date().getTime()) {
      this.props.recipesFetchRequest(JSON.parse(localStorage.getItem(`${queryString}${queryParams}`))['content']);
      return this.props.history.push(`/search/${queryString}${queryParams}`);
    }

    return this.props.recipesFetch(queryString, queryParams)
      .then(() => this.props.history.push(`/search/${queryString}${queryParams}`))
      .catch(err => logError(err));
  };

  handleBoundSubitemClick = (subItem, e) => {
    let queryString = subItem.link.split("&calories=0-10000")[0];
    let queryParams = "&calories=0-10000";

    if (localStorage.getItem(`${queryString}${queryParams}`) && JSON.parse(localStorage.getItem(`${queryString}${queryParams}`))['timestamp'] > new Date().getTime()) {
      this.props.recipesFetchRequest(JSON.parse(localStorage.getItem(`${queryString}${queryParams}`))['content']);
      return this.props.history.push(`/search/${queryString}${queryParams}`);
    }

    return this.props.recipesFetch(queryString, queryParams)
      .then(() => this.props.history.push(`/search/${queryString}${queryParams}`))
      .catch(err => logError(err));
  };

  handleRedirect = url => {
    return this.props.history.push(url);
  };

  calsPS = (cals, servings) => Math.round(cals/servings);

  render() {
    const sliderItems = [{header: "Sensational Sangria Recipes", subHeader: "Browse hundreds of variations on this fun and fruity punch.", image: "https://i.imgur.com/Cdm8uLo.jpg", link: "search?q=sangria&calories=0-10000" }, 
    {header: "Hummus Recipes", subHeader: "Browse hundreds of ways to get your dip on.", image: "https://i.imgur.com/U2S3zqF.jpg", link: "search?q=hummus&calories=0-10000" }, 
    {header: "Greek Pasta Salad", subHeader: "These salads are filled with bold flavors: kalamata olives, feta cheese and fresh herbs.", image: "https://i.imgur.com/ZJTqzVc.jpg", link: "search?q=greek%20pasta%20salad&calories=0-10000" },
    {header: "Sloppy Bulgogi and other Fusion Mashups.", subHeader: "Try these delicious cross-cultural combos.", image: "https://i.imgur.com/U58wzmg.jpg", link: "search?q=fusion&calories=0-10000" },
    {header: "Chicken Teriyaki Skewers", subHeader: "See how to make delicious Summery chicken teriyaki skewers.", image: "https://i.imgur.com/mHOTbhs.jpg", link: "search?q=chicken%20teriyaki%20skewers&calories=0-10000" }];

    const subItems = [{title: "World Cuisine", image: "https://i.imgur.com/OQv9K29.png", link: "search?q=world%20cuisine&calories=0-10000"},
    {title: "Vegan Recipes", image: "https://i.imgur.com/RnxBP1l.jpg", link: "search?q=vegan&calories=0-10000"},
    {title: "Slow Cooker", image: "https://i.imgur.com/LWNK25s.jpg", link: "search?q=slow%20cooker&calories=0-10000"},
    {title: "Shrimp Recipes", image: "https://i.imgur.com/cKdLXB2.jpg", link: "search?q=shrimp&calories=0-10000"},
    {title: "Cookies", image: "https://i.imgur.com/yuIHLRS.jpg", link: "search?q=cookie&calories=0-10000"},
    {title: "Chicken Recipes", image: "https://i.imgur.com/XpxJcn0.jpg", link: "search?q=chicken&calories=0-10000"},
    {title: "Cake Recipes", image: "https://i.imgur.com/UVo3FF8.jpg", link: "search?q=cake&calories=0-10000"},
    {title: "Breakfast", image: "https://i.imgur.com/guAsD12.png", link: "search?q=breakfast&calories=0-10000"},
    {title: "Bread Recipes", image: "https://i.imgur.com/BNQZO8L.png", link: "search?q=bread&calories=0-10000"},
    {title: "Appetizers", image: "https://i.imgur.com/2bNJ7AZ.png", link: "search?q=appetizers&calories=0-10000"}];
    return (
      <section className='container'>
        <div className='slider'>
          {sliderItems.map((item, idx) => {
            let boundItemClick = this.handleBoundItemClick.bind(this, item);
            return <div key={idx} className='sliderItemContainer' onClick={boundItemClick}>
                <div className="sliderText">
                  <h3 className='sliderHeader'>{item.header}</h3>
                  <p className='sliderSubheader'>{item.subHeader}</p>
                </div>
                <img src={item.image} className="sliderItemImage"/>
              </div>
          })}
        </div>
        <div className='sliderSubItem'>
          <div className='subItemInnerWrapper'>
            {subItems.map((subItem, idx) => {
              let boundSubitemClick = this.handleBoundSubitemClick.bind(this, subItem);
              return <div key={idx} className='sliderSubitemContainer' onClick={boundSubitemClick}>
                  <div className='subItemInsideWrapper'>
                    <img src={subItem.image} className="sliderSubitemImage"/>
                    <p className='sliderSubitemTitle'>{subItem.title}</p>
                  </div>
                </div>
            })}
            </div>
        </div>
        <RecipesMap recipes={this.props.homepage} containerClass={"homepageRecipesOuter"} redirect={this.handleRedirect}/>
      </section>
    );
  }
}

let mapStateToProps = state => ({
  homepage: state.homepage,
});

let mapDispatchToProps = dispatch => {
  return {
    favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    homepageFetch: () => dispatch(homepageFetchRequest()),
    homepageFetchRequest: recipes => dispatch(homepageFetch(recipes)),
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
    recipesFetchRequest: recipes => dispatch(recipesFetch(recipes)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);