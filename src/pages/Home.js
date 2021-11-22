import React, { Component } from 'react';
import Header from '../templates/Header.js';
import Footer from '../templates/Footer.js';
import { motion } from "framer-motion"
import Loader from '../blocks/Loader.js';
import { shuffle } from "lodash"
import Slider from "react-slick";
import {Link} from 'react-router-dom';

class Home extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoaded: false,
            isLoggedIn: false,
            user: {},
            activeSlide: 0,
            didScroll: false,
            images: [
                "/img/main-grid/1.jpg", 
                "/img/main-grid/2.jpg",
                "/img/main-grid/3.jpg",
                "/img/main-grid/4.jpg",
                "/img/main-grid/5.jpg",
                "/img/main-grid/6.jpg",
                "/img/main-grid/7.jpg",
                "/img/main-grid/8.jpg",
                "/img/main-grid/9.jpg",
                "/img/main-grid/10.jpg",
                "/img/main-grid/11.jpg",
                "/img/main-grid/12.jpg"
            ]
        }

        this.logOut = this.logOut.bind(this);
        this.shuffuleImages = this.shuffuleImages.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
    }

    componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user, isLoaded: true});
        }

        setInterval(() => {
            this.shuffuleImages();
        }, 10000);

        window.addEventListener('wheel', (e) => {
            this.setState({ didScroll: true })
            this.handleWheel(e);
        })

        this.setState({isLoaded: true});
    }

    handleWheel(e) {
        if ( this.state.didScroll === true ) {
            e.preventDefault();
            e.deltaY > 0 ? this.slider.slickNext() : this.slider.slickPrev();
            this.setState({ didScroll: false })
        }
        
    }

    shuffuleImages() {
        let oldImages = this.state.images;
        let newImages = shuffle(oldImages);
        this.setState({images: newImages});
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
        const { error, isLoaded, images, activeSlide } = this.state;

        const spring = {
            type: "spring",
            damping: 50,
            stiffness: 50,
        };

        const settings = {
            dots: false,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            vertical: true,
            verticalSwiping: true,
            lazyload: true,
            beforeChange: current => this.setState({ activeSlide: current,  didScroll: true }),
            afterChange: current => this.setState({ activeSlide: current, didScroll: false })
        };

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div>
                    <Header />
                        <div className="frames"> 
                            <Loader isLoading={true} />
                        </div>
                    <Footer />
                </div>
            );
        } else {
            return (
                <div className="home">
                    <Header />
                    <Slider {...settings} ref={slider => this.slider = slider}>
                        <div className="hero-section">
                            <div className="container">
                                <div className="section-wrapper">
                                    <div className="left">
                                        { activeSlide === 0 && (
                                            <div>
                                                <div className="content">
                                                    <h1 className="title">Your moments on our canvas</h1>
                                                    <p className="subtitle">Get your memories delivered to you at your doorstep!</p>
                                                    
                                                    <motion.div
                                                        whileHover={{ scaleX: 1, scaleY: 1.1 }}
                                                        whileTap={{ scaleX: 1, scaleY: 1.1 }}
                                                    >
                                                        <Link to='/order' className="btn btn-large">Pick your photos!</Link>
                                                    </motion.div> 
                                                </div>
                                            </div>
                                        )}
                                        
                                    </div>

                                    <div className="right first">
                                        { activeSlide === 0 && (
                                            <ul className="picture-grid">
                                                {images.map(image => (
                                                    <motion.li
                                                        key={image}
                                                        layoutTransition={spring}
                                                    >
                                                        <div className="frame-wrap">
                                                            <img className="pull-right opp" src={image} alt={image} />
                                                        </div>
                                                    </motion.li>

                                                  ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="basic-section one">
                            <div className="container">
                                <div className="section-wrapper">
                                    <div className="left first">
                                        
                                        <motion.div
                                            animate={{
                                                scale: [0, 1]
                                            }}
                                            transition={{
                                                duration: 1,
                                                ease: "easeInOut",
                                                delay: .3
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <div className="frame-wrap">
                                                <div className="frame"></div>
                                                <img className="pull-right" src="/img/moments.jpg" alt="moments" />
                                            </div>
                                        </motion.div>
                                        
                                        
                                    </div>

                                    <div className="right">
                                        { activeSlide === 1 && (
                                            <motion.div
                                                animate={{
                                                    scale: [0, 1]
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    ease: "easeInOut",
                                                    delay: .3
                                                }}
                                            >
                                                <div className="content">
                                                   <h1 className="title">The moments are your treasure.</h1>
                                                    <p className="subtitle">Add your photos, choose a frame and place an order. Leave the rest to us and we'll deliver your memories with care.</p>
                                                    
                                                    <motion.div
                                                        whileHover={{ scaleX: 1, scaleY: 1.1 }}
                                                        whileTap={{ scaleX: 1, scaleY: 1.1 }}
                                                    >

                                                        <Link to='/order' className="btn btn-large">Order Now</Link>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="basic-section two">
                            <div className="container">
                                <div className="section-wrapper">
                                    <div className="left">
                                        { activeSlide === 2 && (
                                            <motion.div
                                                animate={{
                                                    scale: [0, 1]
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    ease: "easeInOut",
                                                    delay: .3
                                                }}
                                            >
                                                <div className="content">
                                                    <h1 className="title">Perfect gift for someone close.</h1>
                                                    <p className="subtitle">Get a coupon code from us by paying in advance and gift someone the experience to relive their memories.</p>
                                                    <motion.div
                                                        whileHover={{ scaleX: 1, scaleY: 1.1 }}
                                                        whileTap={{ scaleX: 1, scaleY: 1.1 }}
                                                    >
                                                        <a href="mailto:info@mymoments.com.pk" target="_blank" rel="noopener noreferrer" className="btn btn-large">Contact Us</a>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )}
                                        
                                    </div>

                                    <div className="right first">
                                        
                                        <motion.div
                                            animate={{
                                                scale: [0, 1]
                                            }}
                                            transition={{
                                                duration: 1,
                                                ease: "easeInOut"
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <img className="pull-right" src="/img/gift.jpg" alt="gift" />
                                        </motion.div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            );
        }
    }
}

export default Home; // Don’t forget to use export default!