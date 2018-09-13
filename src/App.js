import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase'

const initFirebase = () => {
  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyCktqAzrp6Los2d59aaebsg8S3yb7mTbr4",
    authDomain: "wordart-generator.firebaseapp.com",
    databaseURL: "https://wordart-generator.firebaseio.com",
    projectId: "wordart-generator",
    storageBucket: "wordart-generator.appspot.com",
    messagingSenderId: "527506378785"
  };
  firebase.initializeApp(config);
};

class App extends Component {
  componentWillMount(){
    initFirebase();
    this.text = React.createRef();
  }

  submit = (e) => {
    e.preventDefault();
    let db = firebase.database();
    db.ref('arts/').push({
      text: this.text.current.value
    });
    console.log(this.text.current.value);
  };

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <form onSubmit={this.submit.bind(this)} className="App-intro">
          <input type="text" placeholder="Texto" ref={this.text}/> <br />
          <input type="radio" name="art" value="male"/> Male<br/>
          <input type="radio" name="art" value="female"/> Female<br/>
          <input type="radio" name="art" value="other"/> Other<br/>
          <input type="submit" value="Enviar"/>
        </form>
      </div>
    );
  }
}

export default App;
