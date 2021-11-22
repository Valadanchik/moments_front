import React, { Component } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import Header from '../templates/Header.js'
import Footer from '../templates/Footer.js'
import { motion } from "framer-motion";
import Loader from '../blocks/Loader.js';

class ResetPasswordReq extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorMessage: '',
            responseMessage: '',
            isLoaded: true,
            isLoggedIn: false,
            email: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let state = localStorage["appState"];

        if (state) {
            let AppState = JSON.parse(state);
            this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
        }
    }

    handleChange(event) {

        if ( event.target.name === 'email' ) {
            this.setState({ email: event.target.value });
        }

    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ isLoaded: false });

        const data = new FormData(event.target);
        data.append('email', data.get('email'));
        this.setState({ email: data.get('email')});

        axios({
            method: 'post',
            url: API_BASE_URL + '/user/forgetpassword',
            data: data,
            headers: {'Content-Type': 'multipart/form-data' }
        })
        .then(res => {

            if (res.data.error === false) {
                this.setState({ responseMessage: res.data.message, errorMessage: '', isLoaded: true });
            } else {
                console.log(res);
                this.setState({ errorMessage: res.data.message, responseMessage: '', isLoaded: true });
            } 
            
        })
        .catch(function (error) {
            localStorage["appState"] = '';
            window.location.href = "/";
        });;
    }

    render() {
        const { error, isLoaded, errorMessage, email, responseMessage } = this.state;

        if (error) {
          return <div>Error: {error.message}</div>;
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
                                        <div className="form-group">
                                            <input type="email" name="email" className={errorMessage.length > 0 ? 'form-control is-invalid' : 'form-control'} placeholder="Email" value={email} onChange={this.handleChange} required="required"/>
                                            <small className="invalid-feedback">{( errorMessage.length > 0 ? errorMessage : '' )}</small>
                                            <small className="response">{responseMessage}</small>
                                        </div>

                                        <div className="form-group">
                                            <input type="submit" className="btn btn-sm" value="Reset my password" />
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

export default ResetPasswordReq; // Don’t forget to use export default!