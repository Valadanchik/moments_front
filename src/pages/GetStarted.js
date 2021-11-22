import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import BackStrip from '../blocks/BackStrip.js'
import axios from 'axios';
import { API_BASE_URL, GA_ID, PIXEL_ID } from '../config';
import Loader from '../blocks/Loader.js';
import {Redirect} from 'react-router-dom';
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
ReactGA.initialize(GA_ID);

class GetStarted extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoading: true,
            isLoggedIn: false,
            error: '',
            step: 1,
            userData: [],
            authenticatedUser: false
        }

        this.goBack = this.goBack.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.incrementStep = this.incrementStep.bind(this);
        this.validateToken = this.validateToken.bind(this);
        ReactPixel.init(PIXEL_ID, {}, { autoConfig: true, debug: false});
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user, isLoading: false});

            if ( AppState.isLoggedIn ) {
                this.validateToken();
            }
        } else {
            this.setState({isLoading: false});
        }
    }

    validateToken() {
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios({
            method: 'post',
            url: API_BASE_URL + '/user/validate',
            headers: {Authorization: AuthStr }
        })
        .then(res => {
            if ( res.data.error ) {
                this.setState({authenticatedUser: true});
            } 
        });
    }

    goBack(e){
        e.preventDefault();
        var step = this.state.step;
        step = step - 1;
        this.setState({ step: step });
        this.props.history.go(-1);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let user = this.state.userData;
        user[name] = value;

        this.setState({ userData: user });
    }

    createGuest(e) {
        this.setState({ isLoading: true });

        const data = new FormData();
        data.append('name', this.state.userData.name);
        data.append('email', this.state.userData.email);
        data.append('is_guest', '1');

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
            } else {
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

                this.setState({authenticatedUser: true});

                ReactGA.event({
                    category: 'User',
                    action: 'Initiated Session'
                });
                ReactPixel.track('CompleteRegistration');
            } 

            this.setState({ isLoading: false });
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    incrementStep(e) {
        e.preventDefault();
        var step = this.state.step;
        
        if (step === 1) {
            var name = this.state.userData.name;

            if (!name) {
                this.setState({ error: 'You need to give us your name' });
                return false;
            }

            this.props.history.push("/getstarted");
            step = step + 1;
            this.setState({ step: step });

            ReactGA.event({
                category: 'User',
                action: 'Added name'
            });
        }

        if (step === 2) {
            var email = this.state.userData.email;

            if (!email) {
                this.setState({ error: 'You need to give us your email' });
                return false;
            }

            ReactGA.event({
                category: 'User',
                action: 'Added Email'
            });

            this.props.history.push("/getstarted");
            this.createGuest(e);
        }
    }

    render() {
        const {userData, step, error, isLoading, authenticatedUser} = this.state;

        if (authenticatedUser) {
            return <Redirect to="/order" />
        } else if(isLoading) {
            return ( 
                <div>
                    <BackStrip goBack={this.goBack} />
                    <div className="page-wrapper">
                        <div className="get-started-wrapper">
                            <div className="form-inner">
                                <Loader isLoading={true} />
                            </div>
                         </div>
                     </div>
                 </div>
            );
        }  else { 
            return (
                <div>
                    <BackStrip goBack={this.goBack} />
                    <div className="page-wrapper">
                        <div className="get-started-wrapper">
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
                            { step === 1 && 
                                <motion.div
                                    animate={{
                                        x: [-600, 0]
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "backInOut"
                                    }}
                                    className="form-inner"
                                >
                                    <div className="name mb-3">
                                        <p className="step-info">Step {step} of 2</p>
                                        <h2 className="mb-4">Lets get to know you!</h2>
                                        <input type="text" name="name" value={userData.name} placeholder="What's your name!" onChange={this.handleChange} required />
                                        <small>{error}</small>
                                    </div>
                                    <div className="next">
                                        <Link to="/getstarted" className="btn-opp btn-lg w-100 mw-100" onClick={this.incrementStep}>Continue</Link>
                                    </div>
                                </motion.div>
                            }
                            
                            { step === 2 && 
                                <motion.div
                                    animate={{
                                        x: [600, 0]
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "backInOut"
                                    }}
                                    className="form-inner"
                                >
                                    <div className="email mb-3">
                                        <p className="step-info">Step {step} of 2</p>
                                        <h2 className="mb-4"> Hey {userData.name}! <br/> What's your email?</h2>
                                        <input type="email" name="email" value={userData.email} placeholder="Email" onChange={this.handleChange} required />
                                    </div>
                                    <div className="next">
                                        <Link to="/getstarted" className="btn-opp btn-lg w-100 mw-100" onClick={this.incrementStep}>Pick Photos!</Link>
                                    </div>
                                </motion.div>
                            }
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(GetStarted); // Don’t forget to use export default!