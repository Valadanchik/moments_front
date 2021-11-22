import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

//pages
import Home from './pages/Home.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Order from './pages/Order.js';

function App() {
    
    return (
        <Router>
            <div>

                {/*<nav>
                  <ul>
                    <li>
                      <Link exact to="/">Home</Link>
                    </li>
                    <li>
                      <Link exact to="/register">Register</Link>
                    </li>
                  </ul>
                </nav>*/}

                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>

                    <Route exact path="/order">
                        <Order />
                    </Route>

                    <Route exact path="/login">
                        <Login />
                    </Route>

                    <Route exact path="/register">
                        <Register />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
