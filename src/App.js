import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './wordart.css'
import 'bootstrap/dist/css/bootstrap.min.css'
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
  arts = [
    { name: 'Rainbow',        value: 'rainbow' },
    { name: 'Blues',          value: 'blues' },
    { name: 'Superhero',      value: 'superhero' },
    { name: 'Radial',         value: 'radial' },
    { name: 'Tilt',           value: 'tilt' },
    { name: 'Purple',         value: 'purple' },
    { name: 'Horizon',        value: 'horizon' },
    { name: 'Italic Outline', value: 'italic-outline' },
    { name: 'Slate',          value: 'slate' },
  ];
  constructor(){
    super();
    this.state = {
      arts: [],
      currentArt: this.arts[0].value
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
      this.setState({ arts: values.reverse() });
    })
  }

  submit = (e) => {
    e.preventDefault();
    let db = firebase.database();
    const { currentArt } = this.state;
    const text = this.text.current.value;
    if(text.length >= 3){
        db.ref('arts/').push({
          text: text,
          art: currentArt
        });
    } else {
        alert("O texto precisa ter pelo menos 3 caracteres.")
    }
  };

  renderArts = () => (
      this.state.arts.map((art, i) => (
          <div className="col-md-3 " style={{ borderWidth: '3px', borderStyle: 'solid', padding: 20, margin: 20}}>
              <button type="button" className="close" aria-label="Close" style={{ color: 'red'}}>
                  <span aria-hidden="true">&times;</span>
              </button>
              <div className={ `wordart ${art.art}` }  key={i}>
                  <span className="text" style={{fontSize: '60%'}}>{ art.text }</span>
              </div>
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
          <h1 className="App-title">Welcome to Firebase</h1>
        </header>
        <div className="container">
          <form onSubmit={this.submit.bind(this)} className="App-intro">
            <input type="text" placeholder="Texto" maxLength={10} ref={this.text}/> <br />

            <select value={this.state.currentArt} onChange={this.changeArt.bind(this)} >
              { this.arts.map(art => (
                  <option value={art.value} >{art.name}</option>
              )) }
            </select>
            <input type="submit" value="Enviar"/>
          </form>
          <div className="row">
            <this.renderArts />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
