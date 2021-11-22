import React, { Component } from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import { motion } from "framer-motion";
import Loader from '../blocks/Loader.js';
import BackStrip from '../blocks/BackStrip.js'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessages: [],
            isLoaded: false,
            isLoggedIn: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        let state = localStorage["appState"];

        if (state) {
            let AppState = JSON.parse(state);
            this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
        }

        this.setState({isLoaded: true});
    }

    handleChange(event) {

        if (!event.target.checkValidity()) {
            this.setState({ displayErrors: true });
            return;
        }
        this.setState({ displayErrors: false });
    }

    goBack(e){
        e.preventDefault();
        this.props.history.go(-1);
        return false;
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ isLoaded: false });

        const data = new FormData(event.target);
        data.append('email', data.get('email'));
        data.append('password', data.get('password'));
        data.append('remember_me', data.get('remember_me'));

        axios({
            method: 'post',
            url: API_BASE_URL + '/user/login',
            data: data,
            headers: {'Content-Type': 'multipart/form-data' }
        })
        .then(res => {

            if (res.data.error === true) {
                this.setState({ errorMessages: res.data.message });

            } else if (res.data.error === false) {

                let userData = {
                    id: res.data.data.id,
                    name: res.data.data.name,
                    email: res.data.data.email,
                    role: res.data.data.role,
                    access_token: res.data.data.token,
                };

                let appState = {
                    isLoggedIn: true,
                    user: userData
                };
                
                localStorage["appState"] = JSON.stringify(appState);
                
                this.setState({
                    isLoggedIn: appState.isLoggedIn,
                    user: appState.user,
                    error: ''
                });

                window.location.reload();

            }

            this.setState({ isLoaded: true });
        })
        .catch(function (error) {
            localStorage["appState"] = '';
            window.location.href = "/";
        });
    }

    render() {
        const { error, isLoaded, errorMessages, isLoggedIn } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div>
                    <div className="page-wrapper grid">
                        <div className="register-form-wrapper">
                            <div className="single-upload-item add">
                                <Loader isLoading={true} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (isLoggedIn) {
            return <Redirect to={{ pathname: "/order" }} />
        } else {
            return (
                <div className="page-login">
                    <BackStrip goBack={this.goBack} />
                    <div className="page-wrapper grid">
                        <div className="register-form-wrapper">
                            <motion.div
                                animate={{
                                  scale: [0, 1]
                                }}
                                transition={{ duration: 0.3 }}
                                className="logo-wrap"
                            >
                                <Link to="/"> 
                                    <img className="logo-white" src="/img/logo-white.png" alt="Logo" />
                                </Link>
                            </motion.div>

                            <motion.div
                                    animate={{
                                      scale: [0, 1]
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="form-inner"
                                >

                                <h4 className="main-title"> Hi there, you need an account to get started. <br/> </h4>
                                <br />
                                <form method="post" className="register-form" onSubmit={this.handleSubmit} >
                                    <div className="form-group">
                                        <input type="email" name="email" className={errorMessages.length > 0 ? 'form-control is-invalid' : 'form-control'} placeholder="Email" onChange={this.handleChange} required="required"/>
                                    </div>

                                    <div className="form-group ">
                                        <input type="password" name="password" className={errorMessages.length > 0  ? 'form-control is-invalid' : 'form-control'} placeholder="Password" onChange={this.handleChange} required="required"/>
                                        <small className="invalid-feedback">{( errorMessages.length > 0  ? errorMessages : '' )}</small>  
                                        <small> Don’t have an account? <Link to="/register" className="main-color">Register now</Link> </small> 
                                    </div>

                                    <div className="form-group">
                                        <div className="form-check">
                                            <input type="checkbox" name="remember_me" className="form-check-input" onChange={this.handleChange} />
                                            <label className="form-check-label">Remember me</label>
                                        </div>
                                    </div>

                                    <div className="form-group login-trouble">
                                        <input type="submit" className="btn" value="Login" />
                                        <small> <Link to="/resetpasswordrequest" className="main-color">Trouble Logging in?</Link>  </small> 
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(Login); // Don’t forget to use export default!