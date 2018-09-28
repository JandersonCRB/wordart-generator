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
  constructor(){
    super();
    this.state = {
      arts: [],
    }
  }

  componentWillMount(){
    initFirebase();
    this.listenToArts();
  }

  listenToArts() {
    let db = firebase.database();
    db.ref('arts').on('value', snapshot => {
      let values = snapshot.val();
      if(values) {
          values = Object.keys(values).map(key => {
              return { ...values[key], key }
          });
      } else {
        values = []
      }
      this.setState({ arts: values.reverse() });
    })
  }

  delete = key => {
      let db = firebase.database();
      db.ref('arts/' + key).remove();
  };

  renderArts = () => (
      this.state.arts.map((art, i) => (
          <div className="col-md-3 " style={{ borderWidth: '3px', borderStyle: 'solid', padding: 20, margin: 20}} key={i}>
              <button type="button" className="close" aria-label="Close" style={{ color: 'red'}} onClick={ () => this.delete(art.key) }>
                  <span aria-hidden="true">&times;</span>
              </button>
              <button type="button" className="close" aria-label="Close" data-toggle="modal" data-target="#exampleModal" style={{ color: 'red'}} onClick={ () => this.setState({editArt: art}) }>
                  <span aria-hidden="true">&times;</span>
              </button>
              <div className={ `wordart ${art.art}` } >
                  <span className="text" style={{fontSize: '60%'}}>{ art.text }</span>
              </div>
          </div>
      ))
  );

  render() {
    return (
      <div className="App">
        <EditBox art={this.state.editArt} />
        <header className="App-header">
          <button type="button" className="close" data-toggle="modal" data-target="#exampleModal" style={{ color: 'green'}} onClick={() => this.setState({editArt: undefined}) }>
            <span aria-hidden="true">&times;</span>
          </button>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Firebase</h1>
        </header>
        <div className="container">
          <div className="row">
            <this.renderArts />
          </div>
        </div>
      </div>
    );
  }
}

class EditBox extends Component {
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

    constructor(props){
        super(props);
        this.text = React.createRef();
        this.state = {
            currentArt: this.arts[0].value,
        };

    }

    componentWillReceiveProps(props) {
        if(props.art){
            this.text.current.value = props.art.text;
            this.setState({ currentArt: props.art.art});
        } else {
            this.text.current.value = "";
            this.setState({ currentArt: this.arts[0].value })
        }
    }


    changeArt(e) {
        this.setState({ currentArt: e.target.value })
    }

    reset() {
        this.text.current.value = "";
        this.setState({ currentArt: this.arts[0].value });
    }

    submit = () => {
        if (this.props.art){
            this.update(this.props.art.key);
        } else {
            this.create();
        }
        this.reset();
    };

    create() {
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
    }

    update() {
        let db = firebase.database();
        db.ref('arts/' + this.props.art.key).set({
            art: this.state.currentArt,
            text: this.text.current.value
        })

    }

    render() {
        console.log(this.text)
        return(
            <div className="modal" tabIndex="-1" role="dialog" id="exampleModal">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form className="App-intro">
                            <div className="modal-body">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Texto" maxLength={10} ref={this.text}/> <br />
                                </div>
                                <div className="form-group">
                                    <select value={this.state.currentArt} className="form-control" onChange={this.changeArt.bind(this)} >
                                        { this.arts.map((art, key) => (
                                            <option value={art.value} key={key} >{art.name}</option>
                                        )) }
                                    </select>
                                </div>
                                <div>
                                    <h4>Preview</h4>
                                    <div className={ `wordart ${this.state.currentArt}` }>
                                        <span className="text" style={{fontSize: '60%'}}>{ this.text.current.value }</span>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.submit.bind(this)}>Save changes</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
