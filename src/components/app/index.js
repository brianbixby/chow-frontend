import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from '../navbar';
import LandingContainer from '../landing-container';
import RecipesContainer from '../recipes-container';
import RecipeContainer from '../recipe-container';
import ProfileContainer from '../profile-container';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <section>
          <Route path='*' component={Navbar} />
          <Route exact path='/' component={LandingContainer} />
          <Route exact path='/search/:searchQuery' component={RecipesContainer} />
          <Route exact path='/recipe/:recipeQuery' component={RecipeContainer} />
          <Route exact path='/profile/:profileID' component={ProfileContainer} />
        </section>
      </BrowserRouter>
    );
  }
}

export default App;