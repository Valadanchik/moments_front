import React, { Component } from 'react';

class Footer extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoaded: true,
            isLoggedIn: false,
            user: {}
        }

        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user});
        }
    }

    logOut() {
        let appState = {
          isLoggedIn: false,
          user: {}
        };
        localStorage["appState"] = JSON.stringify(appState);
        this.setState(appState);
    }

    render() {
        const { error, isLoaded } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <footer> 
                </footer> 
            )
        }
    }
}

export default Footer; // Don’t forget to use export default!