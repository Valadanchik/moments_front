import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { Navbar} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal , Dropdown  } from 'react-bootstrap';

class Header extends Component {

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

    logOut(e) {
        e.preventDefault();
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

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <header> 
                    <Navbar expand="lg">
                        <div className="container">
                            <Link to='/'>
                                <Navbar.Brand className="logo"><img className="main-logo" src="/img/moments-logo-website.png" alt="Logo" />
                                </Navbar.Brand>
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
                                                <FontAwesomeIcon icon={faBars} color='#495057' size='2x' />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="dorpdown-menu">
                                                <Link to='/order' className="btn btn-sm btn-nobg text-left">Pick your photos</Link>
                                                <Link className="btn btn-sm btn-nobg text-left" onClick={this.faqShow}>FAQ</Link>

                                                {this.state.user.role === 'manager' &&
                                                    <Link to='/orders/all' className="btn btn-sm btn-nobg text-left">All Orders</Link>
                                                }
                                                {this.state.user.role === 'manager' &&
                                                    <Link to='/reports' className="btn btn-sm btn-nobg text-left">Reports</Link>
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
                                    <p>We have 4 sizes available by which are 6x6, 8x8, 10x10 and 12x12 inches. We also accept custom sized orders.</p>

                                    <h5 className="main-title">Can I send a custom sized order?</h5>
                                    <p>Yes, we do accept custom sized orders. Please contact us to get more details.</p>

                                    <h5 className="main-title">When will I get my order?</h5>
                                    <p>It usually takes about a week to ship the product.</p>

                                    <h5 className="main-title">What are the sticking options?</h5>
                                    <p>As of now, the sticking option is only available for 6x6 inch frames. Rest of the frames have hooks available for hanging.</p>

                                    <h5 className="main-title">Can I place the photo on a table with stand?</h5>
                                    <p>Yes, we do offer stand for frames, please mention this to us after placing your order.</p>

                                    <h5 className="main-title">Is there a minimum photo resolution I should use?</h5>
                                    <p>The pictures you select should be at least 800 x 800 pixels to make a clear print. The website will warn you if your pictures are of smaller resolution.</p>

                                    <h5 className="main-title">How can I contact you?</h5>
                                    <p> You can contact us on +92-311 1778020 or email us at info@mymoments.com.pk</p>

                                </Modal.Body>
                            </Modal>
                        </div>
                    </Navbar> 
                </header> 
            )
        }
    }
}

export default Header; // Don’t forget to use export default!