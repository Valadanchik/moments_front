import React, { Component } from 'react';
import { Navbar} from 'react-bootstrap';
import { Modal , Dropdown  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

class BackStrip extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoaded: true,
            isLoggedIn: false,
            faqInit: false,
            user: {}
        }

        this.logOut = this.logOut.bind(this);
        this.faqShow = this.faqShow.bind(this);
        this.faqHide = this.faqHide.bind(this);
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
        window.location = "/";
    }

    faqShow() {
        this.setState({ faqInit: true});
    }

    faqHide() {
        this.setState({ faqInit: false });
    }

    render() {
        const { error, isLoaded, faqInit } = this.state;
        const { goBack, transparent } = this.props;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className={transparent ? 'back-strip transparent' : 'back-strip'}>
                    <Navbar expand="lg">
                        <div className="container">
                            <Link onClick={(e) => goBack(e)} className="back-btn">
                                <FontAwesomeIcon icon={faAngleLeft} color='#fff' size='3x' />
                            </Link>
                            
                            <div className="menu">
                                {!this.state.isLoggedIn &&
                                    <div>
                                        <Dropdown alignRight size="lg">
                                            <Dropdown.Toggle as="div" className="btn btn-sm btn-nobg pull-right" id="dropdown-basic">
                                                <FontAwesomeIcon icon={faBars} color='#CE2E94' size='2x' />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="dorpdown-menu">
                                                <Link to='/order' className="btn btn-sm btn-nobg text-left">Pick your photos</Link>
                                                <Link to='/register' className="btn btn-sm btn-nobg text-left">Create an account</Link>
                                                <Link className="btn btn-sm btn-nobg text-left" onClick={this.faqShow}>FAQ</Link>
                                                <a href="mailto:info@mymoments.com.pk" rel="noopener noreferrer" target="_blank" className="btn btn-sm btn-nobg text-left">Contact Us</a>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    
                                }

                                {this.state.isLoggedIn &&
                                    <div>
                                        <Dropdown alignRight size="lg">
                                            <Dropdown.Toggle as="div" className="btn btn-sm btn-nobg pull-right" id="dropdown-basic">
                                                <FontAwesomeIcon icon={faBars} color='#CE2E94' size='2x' />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="dorpdown-menu">
                                                <Link to='/order' className="btn btn-sm btn-nobg text-left">Order</Link>
                                                <Link className="btn btn-sm btn-nobg text-left" onClick={this.faqShow}>FAQ</Link>

                                                {this.state.user.role === 'manager' &&
                                                    <Link to='/orders/all' className="btn btn-sm btn-nobg text-left">All Orders</Link>
                                                }
                                                
                                                <Link to='/orders/my' className="btn btn-sm btn-nobg text-left">Your Orders</Link>
                                                <a href="mailto:info@mymoments.com.pk" rel="noopener noreferrer" target="_blank" className="btn btn-sm btn-nobg text-left">Contact Us</a>
                                                
                                                {this.state.user.role === 'manager' &&
                                                    <Link to='' className="btn btn-sm btn-nobg text-left" onClick={this.logOut}>Logout</Link>
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                }
                            </div>

                            <Modal className="faq-modal" show={faqInit} onHide={this.faqHide}>
                                <Modal.Header> 
                                    <h4>Frequently Asked Questions </h4>
                                    <Link className="btn icon float-right" onClick={this.faqHide}>
                                        <FontAwesomeIcon icon={faTimes} color='#333' />
                                    </Link> 
                                </Modal.Header>
                                     
                                <Modal.Body className="faq-modal">
                                    
                                    <h5 className="main-title">What is the size of a frame?</h5>
                                    <p>They’re about 20 by 20 cm (8 by 8 inches and just under an inch thick).</p>

                                    <h5 className="main-title">Are there any other sizes available?</h5>
                                    <p>We donot have any more sizes available right now. Hopefully, we will add soon!</p>

                                    <h5 className="main-title">When will I get my order?</h5>
                                    <p>It usually takes about a week to ship the product.</p>

                                    <h5 className="main-title">How do I stick on wall?</h5>
                                    <p>There are a few sticky strip at the back of the frame. Just peel off the protective paper and stick them on the wall.</p>

                                    <h5 className="main-title">Is there a minimum photo resolution I should use?</h5>
                                    <p>The pictures you select should be at least 800 x 800 pixels to make a clear print. The website will warn you if your pictures are of smaller resolution.</p>

                                </Modal.Body>
                            </Modal>
                        </div>
                    </Navbar> 
                </div>
            )
        }
    }
}

export default BackStrip; // Don’t forget to use export default!