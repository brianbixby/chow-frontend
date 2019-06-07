import React from 'react';
import { isInt } from 'validator';

import Tooltip from '../helpers/tooltip';
import { renderIf, classToggler } from './../../lib/util.js';


class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      advancedSearch: false,
      searchTerm: '',
      searchTermError: null,
      exclude: '',
      excludeError: null,
      excludedArr: [],
      minCals: '',
      minCalsError: null,
      maxCals: '',
      maxCalsError: null,
      maxIngredients: '',
      maxIngredientsError: null,
      dietOption: null,
      healthOption: null,
      error: null,
      focused: null,
      submitted: false,
    };
  }
  componentWillUnmount() {
    this.setState({ advancedSearch: false, searchTerm: '', exclude: '', excludeError: null, excludedArr: [], minCals: '', maxCals: '', maxIngredients: '', dietOption: null, healthOption: null });
  }
  validateInput = e => {
    let { name, value } = e.target;
    let errors = { 
      searchTermError: this.state.searchTermError, 
      minCalsError: this.state.minCalsError, 
      maxCalsError: this.state.maxCalsError,
      maxIngredientsError: this.state.maxIngredientsError,
    };
    let setError = (name, error) => errors[`${name}Error`] = error;
    let deleteError = name => errors[`${name}Error`] = null;

    if(name === 'searchTerm') {
      if(!value)
        setError(name, `${name} can not be empty`);
      else
        deleteError(name);
    }
    if(name === 'minCals' || name === 'maxCals' || name === 'maxIngredients') {
      if(value && isInt(value))
        setError(name, `${name} must be a number`);
      else
        deleteError(name);
    }

    this.setState({ ...errors, error: !!(errors.emailError || errors.minCalsError || errors.maxCalsError || errors.maxIngredients) });
  };
  handleFocus = e => this.setState({ focused: e.target.name});
  handleBlur = e => {
    let { name } = e.target;
    this.setState(state => ({
      focused: state.focused == name ? null : state.focused,
    }));
  };
  handleChange = e => {
    let { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    if(!this.state.error) {
      this.props.onComplete(this.state)
      //   .catch(err => {
      //     this.setState({ 
      //       error: err,
      //       submitted: true,
      //   });
      // });
    }
    this.setState(state => ({
      submitted: true,
      searchTermError: state.searchTermError || state.searchTerm ? null : 'required',
      minCalsError: state.minCalsError ? null : 'required',
      maxCalsError: state.maxCalsError ? null : 'required',
      maxIngredientsError: state.maxIngredientsError ? null : 'required',
      excludeError: state.excludeError ? null : 'required',
    }));
  };

  handleExclude = e => {
    this.setState({ excludedArr: [...this.state.excludedArr, this.state.exclude ], exclude: ''});
  };

  handleBoundExcludeClick = (exclude, e) => {
    this.setState({ excludedArr: this.state.excludedArr.filter(excluded => excluded !== exclude)});
  };

  handleAdvancedSearch = e => {
    this.props.advancedSearch();
    this.setState({advancedSearch: !this.state.advancedSearch});
  };

  render() {
    let { searchTerm, searchTermError, minCalsError, maxCalsError, maxIngredientsError, advancedSearch, error, focused, submitted } = this.state;
    let magnify = require('./../helpers/assets/icons/magnify.icon.svg');
    return (
          <div className='searchContainer'>
            <form className='searchForm' onSubmit={this.handleSubmit} className={classToggler({
                'form': true,
                'error': error && submitted,
              })}>
              <div className='input-group'>
                <input 
                  className='form-control search-form'
                  type='text'
                  name='searchTerm'
                  placeholder='Find a recipe'
                  value={searchTerm}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
                <div className='advancedSearchButton' onClick={this.handleAdvancedSearch}>
                  <p>Advanced Search</p>
                </div>
                <Tooltip message={searchTermError} show={focused === 'searchTerm' || submitted} />
                <button type='submit' className='btn search-btn'><img src={magnify} /></button>
              </div>
              {renderIf(advancedSearch, 
                <div className='advancedSearchDiv'>
                  <span className='iconClose' onClick={() => this.setState({advancedSearch: !this.state.advancedSearch})}> </span>
                  <div className='inputWrapper keyWords'>
                    <span className='magnifyingGlassIcon'></span>
                    <input 
                      className='keyWordsInput'
                      type='text'
                      name='searchTerm'
                      placeholder='Find a recipe'
                      value={searchTerm}
                      onChange={this.handleChange}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                    />
                  </div>
                  <div className='inputWrapper exclude'>
                    <div className='excludeInner'>
                      <div className='addExclude'>
                        <input 
                          className='excludeInput'
                          type='text'
                          name='exclude'
                          placeholder='Exclude Ingredients'
                          value={this.state.exclude}
                          onChange={this.handleChange}
                          onFocus={this.handleFocus}
                          onBlur={this.handleBlur}
                        />
                      </div>
                    </div>
                    <p className='excludeButton' onClick={this.handleExclude}><span>—</span></p>
                  </div>
                  {renderIf(this.state.excludedArr.length > 0,
                    <div className='excludedDiv'>
                      {this.state.excludedArr.map((exclude, idx) => {
                        let boundExcludeClick = this.handleBoundExcludeClick.bind(this, exclude);
                        return <p key={idx} onClick={boundExcludeClick} className='excludedP'><span className='excludedItem'>{exclude}</span><span className='xButton'>X</span></p>
                      })}
                    </div>
                  )}
                      <div className='calSection'>
                        <span className='advancedSearchSectionHeader'>Calories</span>
                        <span className='subSection'>From 
                          <input 
                            id='textBoxInputMinCal' 
                            type='text' 
                            name='minCals'
                            placeholder='ex. 200'
                            value={this.state.minCals}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                          />
                        </span>
                        <span className='subSection'>To 
                          <input
                            id='textBoxInputMaxCal'
                            type='text'
                            name='maxCals'
                            placeholder='ex. 600'
                            value={this.state.maxCals}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                          />
                        </span>
                        <span className='advancedSearchSectionHeader mt16'>Ingredients</span>
                        <span className='subSection'>Up to 
                          <input
                            id='textBoxInputMaxResults'
                            type='text'
                            name='maxIngredients'
                            placeholder='Max Ingredients ex. 12'
                            value={this.state.maxIngredients}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                          />
                        </span>
                      </div>
                      <div className='healthSection'>
                        <span className='advancedSearchSectionHeader'>Health (click one) </span>
                        <label>
                          <input
                            type='radio'
                            name='healthOption' 
                            value='peanut-free'
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                          />  
                          <span>Peanut Free</span>
                        </label>
                          <label>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='sugar-conscious'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            <span>Sugar Conscious</span>
                          </label>
                          <label>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='tree-nut-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            <span>Tree Nut Free</span>
                          </label>
                          <label>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='vegan'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            <span>Vegan</span>
                          </label>
                          <label>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='vegetarian'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            <span>Vegetarian</span>
                          </label>
                      </div>
                      <div className='dietSection'>
                        <span className='advancedSearchSectionHeader'>Diet (click one)</span>
                        <div className='allergyFormGroup' className='form-group'>
                          <label>
                            <input
                              type='radio'
                              name='dietOption' 
                              value='balanced'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            <span>Balanced</span>
                          </label>
                          <label>
                            <input
                              type='radio'
                              name='dietOption' 
                              value='high-protein'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            <span>High Protein</span>
                          </label>
                          <label>
                            <input
                              type='radio' 
                              name='dietOption' 
                              value='low-carb'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            <span>Low Carb</span>
                          </label>
                        </div>
                        <button id='advancedSearchFormButton' type='submit'>Go</button>
                      </div>
                  <div className='advancedSearchToolTip'>
                    <Tooltip message={minCalsError} show={focused === 'minCals' || submitted} />
                    <Tooltip message={maxCalsError} show={focused === 'maxCals' || submitted} />
                    <Tooltip message={maxIngredientsError} show={focused === 'maxIngredients' || submitted} />
                  </div>
                </div>
              )}

              

            </form>
          </div>
    );
  }
}

export default SearchBar;