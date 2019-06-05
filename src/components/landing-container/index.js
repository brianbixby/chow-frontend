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

  handleBoundItemClick = (item, e) => {
    return this.props.history.push(item.link);
  };

  handleBoundSubitemClick = (subItem, e) => {
    return this.props.history.push(subItem.link);
  };

  render() {
    var sliderItems = [{header: "Sensational Sangria Recipes", subHeader: "Browse hundreds of variations on this fun and fruity punch.", image: "https://i.imgur.com/Cdm8uLo.jpg", link: "/search/search?q=sangria&calories=0-10000" }, 
    {header: "Hummus Recipes", subHeader: "Browse hundreds of ways to get your dip on.", image: "https://i.imgur.com/U2S3zqF.jpg", link: "/search/search?q=hummus&calories=0-10000" }, 
    {header: "Greek Pasta Salad", subHeader: "These salads are filled with bold flavors: kalamata olives, feta cheese and fresh herbs.", image: "https://i.imgur.com/ZJTqzVc.jpg", link: "/search/search?q=greek%20pasta%20salad&calories=0-10000" },
    {header: "Sloppy Bulgogi and other Fusion Mashups.", subHeader: "Try these delicious cross-cultural combos.", image: "https://i.imgur.com/U58wzmg.jpg", link: "/search/search?q=fusion&calories=0-10000" },
    {header: "Chicken Teriyaki Skewers", subHeader: "See how to make delicious Summery chicken teriyaki skewers.", image: "https://i.imgur.com/mHOTbhs.jpg", link: "/search/search?q=chicken%20teriyaki%20skewers&calories=0-10000" }];

    var subItems = [{title: "World Cuisine", image: "https://i.imgur.com/OQv9K29.png", link: "/search/search?q=world%20cuisine&calories=0-10000"},
    {title: "Vegan Recipes", image: "https://i.imgur.com/RnxBP1l.jpg", link: "/search/search?q=vegan&calories=0-10000"},
    {title: "Slow Cooker", image: "https://i.imgur.com/LWNK25s.jpg", link: "/search/search?q=slow%20cooker&calories=0-10000"},
    {title: "Shrimp Recipes", image: "https://i.imgur.com/cKdLXB2.jpg", link: "/search/search?q=shrimp&calories=0-10000"},
    {title: "Cookies", image: "https://i.imgur.com/yuIHLRS.jpg", link: "/search/search?q=cookie&calories=0-10000"},
    {title: "Chicken Recipes", image: "https://i.imgur.com/XpxJcn0.jpg", link: "/search/search?q=chicken&calories=0-10000"},
    {title: "Cake Recipes", image: "https://i.imgur.com/UVo3FF8.jpg", link: "/search/search?q=cake&calories=0-10000"},
    {title: "Breakfast", image: "https://i.imgur.com/guAsD12.png", link: "/search/search?q=breakfast&calories=0-10000"},
    {title: "Bread Recipes", image: "https://i.imgur.com/BNQZO8L.png", link: "/search/search?q=bread&calories=0-10000"},
    {title: "Appetizers", image: "https://i.imgur.com/2bNJ7AZ.png", link: "/search/search?q=appetizers&calories=0-10000"}];
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
      </section>
    );
  }
}

let mapStateToProps = state => ({
  userAuth: state.userAuth,
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