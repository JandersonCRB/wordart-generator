import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './wordart.css'
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
  constructor(){
    super();
    this.state = {
      arts: [],
      currentArt: ''
    }
  }
  componentWillMount(){
    initFirebase();
    this.listenToArts();
    this.text = React.createRef();
  }

  listenToArts() {
    let db = firebase.database();
    db.ref('arts').on('value', snapshot => {
      let values = snapshot.val();
      if(values) {
        values = Object.values(snapshot.val())
      } else {
        values = []
      }
      this.setState({ arts: values });
    })
  }

  submit = (e) => {
    e.preventDefault();
    let db = firebase.database();
    db.ref('arts/').push({
      text: this.text.current.value,
      art: this.state.currentArt
    });
    console.log(this.text.current.value);
  };
  arts = [
    {
      name: 'Rainbow',
      value: 'rainbow'
    },
    {
      name: 'Blues',
      value: 'blues'
    },
    {
      name: 'Superhero',
      value: 'superhero'
    },
    {
      name: 'Radial',
      value: 'radial'
    },
    {
      name: 'Tilt',
      value: 'tilt'
    },
    {
      name: 'Purple',
      value: 'purple'
    },
    {
      name: 'Horizon',
      value: 'horizon'
    },
    {
      name: 'Italic Outline',
      value: 'italic-outline'
    },
    {
      name: 'Slate',
      value: 'slate'
    },
  ];

  renderArts = () => (
      this.state.arts.map((art, i) => (
          <div className="wordart rainbow" key={i}>
            <span className="text">{ art.text }</span>
          </div>
      ))
  );
  changeArt(e) {
    this.setState({ currentArt: e.target.value })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <form onSubmit={this.submit.bind(this)} className="App-intro">
          <input type="text" placeholder="Texto" ref={this.text}/> <br />

          <select value={this.state.currentArt} onChange={this.changeArt.bind(this)} >
            { this.arts.map(art => (
                  <option value={art.value} >{art.name}</option>
            )) }
          </select>
          <input type="submit" value="Enviar"/>
        </form>
        <div style={{ marginTop: 20 }}>
          <this.renderArts />
        </div>
      </div>
    );
  }
}

export default App;
