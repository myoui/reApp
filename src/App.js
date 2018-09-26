import React, { Component } from 'react';
import './App.css';
import {Clock, Weather, News, NewsTick} from "./AppComponents.js"
import {UserHandler} from "./ApiComponents.js"
import {Row, Column} from 'simple-flexbox'

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
        width: "800px",
        // height: "1200px",
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
      <Row>
        <Column width="100px">
          <div style={styles.element}>
            <UserHandler user={this.state.currentUser} loggedIn={this.state.loggedIn} handleUser={this.handleUser}/>
          </div>
          <div style={styles.element}><Clock /></div>
          <div style={styles.element}><Weather /></div>
        </Column>
        <Column width="600px">
          <React.Fragment>
            <div style={styles.element}><NewsTick /></div>
            <div style={styles.element}><News /></div>
          </React.Fragment>
        </Column>
      </Row>
      </div>
    )
  }
}


export default App;
