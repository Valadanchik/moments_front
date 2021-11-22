import React, { Component } from 'react';
import Header from '../templates/Header.js';
import Footer from '../templates/Footer.js';
import { motion } from "framer-motion";
import Loader from '../blocks/Loader.js';
import {withRouter} from 'react-router-dom';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessages: [],
            isLoaded: true,
            isLoggedIn: false
        };
    }

    componentDidMount() {
    }

    render() {
        const { error, isLoaded } = this.state;

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
                            <div className="content-full">
                                <motion.div
                                        animate={{
                                          scale: [0, 1]
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >

                                    <h2 className="main-title"> Oops! we couldn't find what you're looking for.</h2>
                                    
                                </motion.div>
                            </div>
                        </div>
                    <Footer />
                </div>
            );
        }
    }
}

export default withRouter(Login); // Don’t forget to use export default!