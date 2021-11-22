import React, { Component } from 'react';
import Header from '../templates/Header.js';
import Footer from '../templates/Footer.js';
import Frames from '../templates/Frames.js';
import Images from '../templates/Images.js';
import CheckoutForm from '../templates/CheckoutForm.js';
import Loader from '../blocks/Loader.js';
import axios from 'axios';
import { API_BASE_URL, GA_ID } from '../config';
import {Redirect, Link} from 'react-router-dom';
import ReactGA from 'react-ga';
import { Modal , Dropdown  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
ReactGA.initialize(GA_ID);

class Order extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: false,
            isLoggedIn: false,
            user: {},
            images: [],
            unAuthenticatedUser: false,
            frames: [],
            modalShow: false,
            imgId: null,
            selectedFrame: null,
            frameModal: true,
            sizeModal: false,
            size: 8,
            redirect: false,
            totalImages: 0,
            fetchedFrames: false,
            itemsRendered: false,
            coupon: '',
            couponResonseError: false,
            couponResonseMsg: '',
            couponData: null,
            couponApplied: false,
            discount: 0,
            isUploaderLoading: false,
            uploadPercent: 0,
            noticeInit: true,
            total: 0
        }

        this.changeFrame = this.changeFrame.bind(this);
        this.loadFrames = this.loadFrames.bind(this);
        this.loadImages = this.loadImages.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.applyCoupon = this.applyCoupon.bind(this);
        this.removeCoupon = this.removeCoupon.bind(this);
        this.setCoupon = this.setCoupon.bind(this);
        this.updateTotal = this.updateTotal.bind(this);
        this.validateToken = this.validateToken.bind(this);
        this.openFrameModal = this.openFrameModal.bind(this);
        this.openSizeModal = this.openSizeModal.bind(this);
        this.changeFrameSize = this.changeFrameSize.bind(this);
        this.closeSizeModal = this.closeSizeModal.bind(this);
        this.closeFrameModal = this.closeFrameModal.bind(this);
        this.imageUplaoding = this.imageUplaoding.bind(this);
        this.imageUplaoded = this.imageUplaoded.bind(this);
        this.setUploadPercent = this.setUploadPercent.bind(this);
        this.noticeHide = this.noticeHide.bind(this);
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user, address: AppState.address, isLoaded: true});

            if ( AppState.isLoggedIn ) {
                this.validateToken();
            } else {
                this.setState({unAuthenticatedUser: true});
            }
            
        } else {
            this.setState({unAuthenticatedUser: true});
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
                this.setState({unAuthenticatedUser: true});
            } 
        })
        .catch(error => {
            console.log(error);
            this.setState({unAuthenticatedUser: true});
        });
    }

    changeFrame(id) {
        this.setState({selectedFrame: id});

        if (id === 0)
            this.setState({frameModal: true, selectedFrame: null});

        if (id >= 1)
            this.setState({frameModal: false});

        this.renderItems(id);
    }

    loadFrames(frames, selectedFrame = 1) {
        this.setState({frames: frames, fetchedFrames: true, selectedFrame: selectedFrame});
    }

    loadImages(images, totalImages) {
        this.setState({
            images: images,
            totalImages: totalImages,
            fetchedImages: true
        });

        this.renderItems();
    }

    renderItems(id = null) {
        
        let itemsData = [],
            images = this.state.images,
            frame = id ? id : this.state.selectedFrame;

        images.map((item, key) => {
            
            let i = {
                'image_id': item.id,
                'frame_id': frame
            }

            itemsData.push(i);
            return false;
        });

        this.setState({items: itemsData});
        setTimeout(() => {
          this.updateTotal()
        }, 50);
    }

    setCoupon(e) {
        this.setState({coupon: e.target.value});
    }

    applyCoupon(e) {
        e.preventDefault();   
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        const data = new FormData();
        data.append('slug', this.state.coupon);

        axios({
            method: 'post',
            url: API_BASE_URL + '/coupons/validate',
            data: data,
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': AuthStr}
        })
        .then(res => {

            if ( res.data.error ) {
                this.setState({ 
                    couponResonseMsg: res.data.message,
                    couponApplied: false,
                    couponResonseError: res.data.error
                });

                ReactGA.event({
                    category: 'Order',
                    action: 'Invalid coupon used'
                });

            } else {

                var couponData = res.data.data,
                    totalImages = this.state.totalImages;

                if ( couponData.min_items !== null ) {

                    if ( totalImages < couponData.min_items  ) {
                        this.setState({ 
                            couponResonseMsg: 'You donot have enough images added to use this coupon!',
                            couponApplied: false,
                            couponResonseError: true
                        });

                        setTimeout(() => {
                          this.updateTotal()
                        }, 200);

                        return;
                    }

                }

                if ( couponData.max_items !== null ) {

                    if ( totalImages > couponData.max_items  ) {
                        this.setState({ 
                            couponResonseMsg: 'Your images quantity is more than the limit of this coupon!',
                            couponApplied: false,
                            couponResonseError: true
                        });

                        setTimeout(() => {
                          this.updateTotal()
                        }, 200);

                        return;
                    }

                }

                this.setState({ 
                    couponResonseMsg: res.data.message,
                    couponApplied: true,
                    couponData: couponData,
                    couponResonseError: res.data.error
                });

                ReactGA.event({
                    category: 'Order',
                    action: 'Valid coupon used'
                });

                setTimeout(() => {
                  this.updateTotal()
                }, 200);
                
            }
        })
        .catch(function (error) {
            console.log(error);
            alert('Error: Could not apply coupon');
        });     
    }

    removeCoupon() {
        this.setState({
            coupon: '',
            couponApplied: false,
            couponData: null,
            couponResonseMsg: '',
        });

        setTimeout(() => {
          this.updateTotal()
        }, 100);
    }

    updateTotal() {

        var f  = this.state.frames.find((element) => {
                return element.id === this.state.selectedFrame;
            }),
            tl  = this.state.totalImages,
            cd = this.state.couponData,
            d = 0,
            t = 0;
        
        if ( (tl > 0) && (f !== undefined) ) {
            t = (f.price * tl)

            if ( f.sale_price > 0 ) {
                d = ((f.price - f.sale_price) * tl)
            }

            /*if ( tl === 6 || tl === 9 || tl === 12) {

                if (f.sale_price === 0) {
                    d = ((f.price - 900) * tl)
                } else {
                    d = ((f.price - (f.sale_price - 99)) * tl)
                }
            }*/
        }

        if ( this.state.couponApplied) {
            d = 0;

            if ( cd.type === 'fixed' ) {

                if ( cd.amount > t ) {
                    d = t
                } else {
                    d = cd.amount;
                }
            }

            if ( cd.type === 'percent' ) {
                d = t * (cd.amount / 100);
            }
            if ( cd.max_amount )
                d = d >= cd.max_amount ? cd.max_amount : d;
        }

        this.setState({
            total: t ? (t - d) : 0,
            discount: d ? parseInt(d) : 0
        });
    }

    changeFrameSize(size) {
        this.setState({size: size, sizeModal: false, frameModal: true});
        this.renderItems();
        this.updateTotal();
    }

    openFrameModal(e) {
        e.preventDefault();
        this.setState({frameModal: true});
    }

    openSizeModal(e) {
        e.preventDefault();
        this.setState({sizeModal: true});
    }


    closeSizeModal(e) {
        e.preventDefault();
        this.setState({sizeModal: false});
    }

    closeFrameModal(e) {
        e.preventDefault();
        this.setState({frameModal: false});
    }

    imageUplaoding() {
        this.setState({isUploaderLoading: true});
    }

    imageUplaoded() {
        this.setState({isUploaderLoading: false});
    }

    setUploadPercent(number) {
        this.setState({uploadPercent: number});
    }

    noticeHide() {
        this.setState({ noticeInit: false });
    }

    render() {
        
        const { error, isLoaded, totalImages, fetchedFrames, fetchedImages, items, itemsRendered, coupon, couponResonseError,couponResonseMsg, couponData, couponApplied, discount, total, unAuthenticatedUser, frameModal, sizeModal, size, isUploaderLoading, uploadPercent, noticeInit } = this.state;

        if ( fetchedFrames && fetchedImages && !itemsRendered ) {
            this.renderItems();
            this.setState({itemsRendered: true});
            this.updateTotal();
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if(unAuthenticatedUser) {
            return <Redirect to="/getstarted" />
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
                <div className="order">
                    <Header />
                        <div className="page-wrapper">
                            <div className="container">
                                <div className="order-wrapper">
                                    <Frames selectedFrame={this.state.selectedFrame} frames={this.state.frames} frameModal={frameModal} loadImages={this.loadImages} changeFrame={this.changeFrame} loadFrames={this.loadFrames} openFrameModal={this.openFrameModal} changeFrameSize={this.changeFrameSize} sizeModal={sizeModal} openSizeModal={this.openSizeModal} closeSizeModal={this.closeSizeModal} size={size} imageUplaoding={this.imageUplaoding} closeFrameModal={this.closeFrameModal} imageUplaoded={this.imageUplaoded} setUploadPercent={this.setUploadPercent} />
                                    <Images selectedFrame={this.state.selectedFrame} frames={this.state.frames} images={this.state.images} loadImages={this.loadImages} isUploaderLoading={isUploaderLoading} uploadPercent={uploadPercent}  />
                                </div>
                            </div>
                        </div>

                    <div className="checkout"> 
                        <CheckoutForm total={total} totalImages={totalImages} items={items} loadImages={this.loadImages} setCoupon={this.setCoupon} applyCoupon={this.applyCoupon} coupon={coupon} removeCoupon={this.removeCoupon} couponResonseError={couponResonseError} couponResonseMsg={couponResonseMsg} couponData={couponData} couponApplied={couponApplied} discount={discount} selectedFrame={this.state.selectedFrame}/>
                    </div>

                    <Modal className="faq-modal" show={noticeInit} onHide={this.noticeHide}>
                        <Modal.Header> 
                            <h4>Notice</h4>
                            <Link className="btn icon float-right" onClick={this.noticeHide}>
                                <FontAwesomeIcon icon={faTimes} color='#333' />
                            </Link> 
                        </Modal.Header>
                             
                        <Modal.Body className="faq-modal">
                            <h5 className="main-title">Sticking option is only available for 6x6 inch frames.</h5>
                            <p>Due to the conditions and weight of the frames, we do not provide sticking tape option for bigger sized frames (ie 8x8, 10x10 and 12x12). You can hang these frames or request us to add a stand!</p>
                        </Modal.Body>
                    </Modal>
                </div>


            );
        }
    }
}

export default Order; // Don’t forget to use export default!