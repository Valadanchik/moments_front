import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import Header from '../templates/Header.js'
import Footer from '../templates/Footer.js'
import { motion } from "framer-motion";
import Loader from '../blocks/Loader.js';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessages: [],
            responseMessage: '',
            resetSuccess: false,
            invalidToken: false,
            isLoaded: true,
            isLoggedIn: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let state = localStorage["appState"];

        if (state) {
            let AppState = JSON.parse(state);
            this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
            this.validateToken();

        }
    }

    validateToken() {
        const { token } = this.props.match.params;
        this.setState({isLoaded: false});
        axios.get(API_BASE_URL + '/user/resetpassword/' + token)
        .then(res => {
            
            if ( res.data.error === true ) {
                this.setState({ invalidToken: true, isLoaded: true });
            } else {
                this.setState({ invalidToken: false, isLoaded: true });
            }
        })
        .catch(function (error) {
            localStorage["appState"] = '';
            window.location.href = "/";
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ isLoaded: false });

        const { token } = this.props.match.params;

        const data = new FormData(event.target);
        data.append('password', data.get('password'));
        data.append('password_confirmation', data.get('password_confirmation'));
        data.append('reset_token', token);

        axios({
            method: 'post',
            url: API_BASE_URL + '/user/resetpassword',
            data: data,
            headers: {'Content-Type': 'multipart/form-data' }
        })
        .then(res => {  
            console.log(res);
            console.log(res.data.error);

            if (res.data.error === false) {
                this.setState({ resetSuccess: true });
            } else {
                this.setState({ errorMessages: res.data.message, isLoaded: true });
            } 
            
        })
        .catch(function (error) {
            localStorage["appState"] = '';
            window.location.href = "/";
        });
    }

    render() {
        const { error, isLoaded, errorMessages, isLoggedIn, responseMessage, invalidToken, resetSuccess } = this.state;

        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (isLoggedIn) {
            return <Redirect to={{ pathname: "/" }} />
        } else if (resetSuccess) {
            return (
                <div>
                    <Header />
                        <div className="page-wrapper grid">
                            <div className="content-full">
                               <h2 className="main-title mb-3"> Your password has been reset successfully!</h2>

                               <Link to="/login" className="btn btn-sm">Login</Link>
                               
                            </div>
                        </div>
                    <Footer />
                </div>
            );
        } else if (!isLoaded) {
            return (
                <div>
                    <Header />
                        <div className="page-wrapper grid">
                            <div className="register-form-wrapper">
                                <div className="single-upload-item add">
                                    <Loader isLoading={true} />
                                </div>
                            </div>
                        </div>
                    <Footer />
                </div>
            );
        } else if (invalidToken) {
            return (
                <div>
                    <Header />
                        <div className="page-wrapper grid">
                            <div className="register-form-wrapper">
                               <h2 className="main-title"> Something is not right, please contact us if you're having problems signing in! </h2>
                            </div>
                        </div>
                    <Footer />
                </div>
            );
        } else {
            return (
                <div>
                    <Header />
                        <div className="page-wrapper grid">
                            <div className="register-form-wrapper">
                                <motion.div
                                        animate={{
                                          scale: [0, 1]
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                    <h2 className="main-title"> Reset your password </h2>
                                    <br />
                                    <form method="post" className="register-form" onSubmit={this.handleSubmit} autoComplete="off" >
                                        <div className="form-group ">
                                            <input type="password" name="password" className={errorMessages.password ? 'form-control is-invalid' : 'form-control'} placeholder="New Password" required="required"/>
                                            <small className="invalid-feedback">{( errorMessages.password ? errorMessages.password : '' )}</small>
                                        </div>

                                        <div className="form-group ">
                                            <input type="password" name="password_confirmation" className={errorMessages.password ? 'form-control is-invalid' : 'form-control'} placeholder="Confirm Password" required="required"/>
                                            <small className="invalid-feedback">{( errorMessages.password ? errorMessages.password : '' )}</small>
                                            <small className="response">{responseMessage}</small>
                                        </div>

                                        <div className="form-group">
                                            <input type="submit" className="btn btn-sm" value="Confirm" />
                                        </div>
                                        
                                    </form>                            
                                </motion.div>
                            </div>
                        </div>
                    <Footer />
                </div>
            );
        }
    }
}

export default ResetPassword; // Don’t forget to use export default!