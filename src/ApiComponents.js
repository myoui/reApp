import React, { Component } from 'react';

export class UserHandler extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        }
    };

    handleUsername = (e) => {
        this.setState({username: e.target.value})
    }
    handlePassword = (e) => {
        this.setState({password: e.target.value})
    }

    handleLogin = (e) => {
        fetch(`http://192.168.1.80:3005/users`).then(response => response.json()).then(json => {
            if (json[this.state.username].exists && 
                json[this.state.username].password === this.state.password) {
                    this.props.handleUser(this.state.username, true).bind(this);
                } else {
                    this.setState({password: ""});
                    alert("Wrong username and/or password.")
                }
        })
        e.preventDefault()
    }
    handleLogout = () => {
        this.setState({password: ""});
        this.props.handleUser("guest", false)
    }

    render() {
        if (window.location.href !== "http://localhost:3000/") {
            return (
                <div>Login Disabled for this URL.</div>
            )
        }else if (this.props.loggedIn) {
            return (
                <div>
                    Logged in as {this.props.user}<br/>
                    <button onClick={this.handleLogout}>Logout</button>
                </div> 
            )
        } else {
            return (
            <div>
                <form>
                    <input type="text" value={this.state.username} onChange={this.handleUsername}/>
                    <input type="password" value={this.state.password} onChange={this.handlePassword}/>
                    <input type="submit" value="Login" onClick={this.handleLogin}/>
                </form>
            </div>
            )
        }
    }
}