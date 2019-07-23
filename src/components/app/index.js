import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { makeAsyncComponent } from "./../../lib/util.js";
import LandingContainer from '../landing-container';
import Navbar from '../nav';

const RecipesContainer = makeAsyncComponent(import('../recipes-container'));
const RecipeContainer = makeAsyncComponent(import('../recipe-container'));
const ProfileContainer = makeAsyncComponent(import('../profile-container'));

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <section>
          <Route path='*' component={Navbar} />
          <Route exact path='/' component={LandingContainer} />
          <Route exact path='/profile/:userName' component={ProfileContainer} />
          <Route exact path='/search/:searchQuery' component={RecipesContainer} />
          <Route exact path='/recipe/:recipeQuery' component={RecipeContainer} />
        </section>
      </BrowserRouter>
    );
  }
}

export default App;