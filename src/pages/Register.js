import React, { Component } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import { motion } from "framer-motion";
import Loader from '../blocks/Loader.js';
import BackStrip from '../blocks/BackStrip.js'
import {Link, withRouter} from 'react-router-dom';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessages: [],
            isLoaded: false,
            isLoggedIn: false,
            loginEmail: '',
            loginName: ''
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

        if ( event.target.name === 'name' ) {
            this.setState({ loginName: event.target.value });
        }

        if ( event.target.name === 'email' ) {
            this.setState({ loginEmail: event.target.value });
        }

    }

    goBack(e){
        e.preventDefault();
        this.props.history.go(-1);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ isLoaded: false });

        const data = new FormData(event.target);
        data.append('name', data.get('name'));
        data.append('email', data.get('email'));
        data.append('password', data.get('password'));
        data.append('password_confirmation', data.get('password_confirmation'));

        this.setState({ loginEmail: data.get('email'), loginName: data.get('name') });

        axios({
            method: 'post',
            url: API_BASE_URL + '/user/register',
            data: data,
            headers: {'Content-Type': 'multipart/form-data' }
        })
        .then(res => {

            if (res.data.error === true) {
                this.setState({ errorMessages: res.data.message });
                this.setState({ isLoaded: true });
            } else if (res.data.error === false) {
                let userData = {
                    id: res.data.data.id,
                    name: res.data.data.name,
                    email: res.data.data.email,
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

                window.location = "/order";

            } else {
                this.setState({ isLoaded: true });
            }
            
        })
        .catch(function (error) {
            localStorage["appState"] = '';
            window.location.href = "/";
        });
    }

    render() {
        const { error, isLoaded, errorMessages, loginEmail, loginName } = this.state;

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
        } else {
            return (
                <div className="page-register">
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
                                <h4 className="main-title"> Glad to see you with us! <br/> <small>Create an account to get started.</small> </h4>
                                <br />
                                
                                <form method="post" className="register-form" onSubmit={this.handleSubmit} autoComplete="off" >
                                    <div className="form-group">
                                        <input type="text" name="name" className={errorMessages.name ? 'form-control is-invalid' : 'form-control'} placeholder="Name" value={loginName} onChange={this.handleChange} required="required"/>
                                        <small className="invalid-feedback">{( errorMessages.name ? errorMessages.name : '' )}</small>
                                    </div>

                                    <div className="form-group">
                                        <input type="email" name="email" className={errorMessages.email ? 'form-control is-invalid' : 'form-control'} placeholder="Email" value={loginEmail} onChange={this.handleChange} required="required"/>
                                        <small className="invalid-feedback">{( errorMessages.email ? errorMessages.email : '' )}</small>
                                    </div>

                                    <div className="form-group ">
                                        <input type="password" name="password" className={errorMessages.password ? 'form-control is-invalid' : 'form-control'} placeholder="Password" onChange={this.handleChange} required="required"/>
                                        <small className="invalid-feedback">{( errorMessages.password ? errorMessages.password : '' )}</small>
                                    </div>

                                    <div className="form-group ">
                                        <input type="password" name="password_confirmation" className={errorMessages.password ? 'form-control is-invalid' : 'form-control'} placeholder="Confirm Password" onChange={this.handleChange} required="required"/>
                                        <small className="invalid-feedback">{( errorMessages.password ? errorMessages.password : '' )}</small>
                                        <small> Already have an account? <Link to="/login" className="main-color">Login</Link></small> 
                                    </div>

                                    <div className="form-group">
                                        <div className="form-check">
                                            <input type="checkbox" name="subscribe" className="form-check-input" onChange={this.handleChange} />
                                            <label className="form-check-label">Subscribe me to newsletter</label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <input type="submit" className="btn" value="Register" />
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

export default withRouter(Register);