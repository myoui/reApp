import React, { Component } from 'react';
import './App.css';
import {Clock, Weather, News, NewsTick} from "./AppComponents.js"
import {UserHandler} from "./ApiComponents.js"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: "",
      loggedIn: false,
    }
  }

  handleUser = (name,login) => {
    this.setState({currentUser: name, loggedIn: login})
  }

  render() {
    const styles = {
      main: {
        width: "600px",
        height: "1000px",
        color: "white",
        fontFamily: "Arial",
        fontSize: "18px",
        margin: "auto",
        padding: "15px"
      },
      element: {
        backgroundColor: "gray",
        margin: "5px",
        padding: "5px",
        borderRadius: "3px"
      }
    }
    return (
      <div className="App" style={styles.main}>
        <div>{this.state.currentUser}</div>
        <div style={styles.element}>
          <UserHandler user={this.state.currentUser} loggedIn={this.state.loggedIn} handleUser={this.handleUser}/>
        </div>
        <div style={styles.element}><Clock /></div>
        <div style={styles.element}><Weather /></div>
        <React.Fragment>
          <div style={styles.element}><NewsTick /></div>
          <div style={styles.element}><News /></div>
        </React.Fragment>
      </div>
    )
  }
}


export default App;
