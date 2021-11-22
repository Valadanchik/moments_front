import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import BackStrip from '../blocks/BackStrip.js'
import SwiperCore, { Navigation } from 'swiper'
import { shuffle } from "lodash"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'

// install Swiper components
SwiperCore.use([Navigation]);

class Home extends Component {

    constructor(props) {
        super();
        this.state = {
            isLoaded: false,
            isLoggedIn: false,
            user: {},
            images: [
                "/landing/1.jpg",
                "/landing/2.jpg",
                "/landing/3.jpg",
                "/landing/4.jpg",
                "/landing/5.jpg",
                "/landing/6.jpg",
                "/landing/7.jpg",
                "/landing/8.jpg",
                "/landing/9.jpg",
                "/landing/10.jpg"
            ]
        }
        this.goBack = this.goBack.bind(this);
        this.shuffuleImages = this.shuffuleImages.bind(this);
    }

    componentDidMount() {
        this.setState({isLoaded: true});
    }

    goBack(e){
        e.preventDefault();
        window.location.href = "/";
    }

    shuffuleImages() {
        let oldImages = this.state.images;
        let newImages = shuffle(oldImages);
        this.setState({images: newImages});
    }

    render() {
        const { images } = this.state;

        return (
                <div className="landing">
                    <BackStrip transparent={true} goBack={this.goBack} />
                    <div className="container landing-logo">moments</div>
                    <div className="container">
                        <Swiper
                            effect="fade"
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation
                            autoplay={true}
                            EffectFlip
                            onSlideChange={() => console.log('slide change')}
                            className="landing-slider"
                        >   
                            {images.map(image => (
                                <SwiperSlide>
                                    <img src={image} className="slider-image" alt="landing 1" />
                                </SwiperSlide>
                            ))}                  
                        </Swiper>
                    </div>
                    <div className="container landing-tagline mb-3">
                        <hr/>
                        <h5> Cherish your memories with us! </h5>
                        <small> Upto <span className="highlight">30% off </span> on single frames and <span className="highlight">35% off </span> on bundle purchases of 6, 9 or 12 frames with <span className="highlight">Free Delivery!</span>  </small>
                    </div>
                    <div className="landing-action">
                        <Link to='/order' className="btn op pbtn-large mt-4 text-center">Pick your photos!</Link>
                    </div>
                </div>
        );
    }
}

export default Home; // Don’t forget to use export default!