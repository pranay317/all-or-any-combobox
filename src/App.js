import React, { Component } from 'react';
import Form from './components/Form/Form';
import './App.css'

class App extends Component {
  constructor() {
    super();
    this.availableToppings = [
      'BBQ Chicken',
      'Jalapeno'
    ]
    this.toppingOptions = [
      'BBQ Chicken',
      'Jalapeno',
      'Bell Pepper'
    ]
  }

  render() {
    return (
      <div className="container">
        <h1 className="page-header">🍕 The Awesome Pizza Shop</h1>
        <Form availableOptions={this.availableToppings} toppings={this.toppingOptions}/>
      </div>
    );
  }
}

export default App;
