import React, { Component } from 'react';
import axios from 'axios';
import Loader from '../blocks/Loader.js';
import { API_BASE_URL, GA_ID } from '../config'
import { Carousel} from 'react-bootstrap';
import { motion } from "framer-motion";
import Image from '../blocks/Image.js';
import BackStrip from '../blocks/BackStrip.js';
import ReactGA from 'react-ga';
ReactGA.initialize(GA_ID);


class Checkout extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: false,
            isLoggedIn: false,
            bucket: {},
            user: {},
            order: []
        }

        this.getOrder = this.getOrder.bind(this);
        this.goBack = this.goBack.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user});
            this.getOrder();
        }
    }

    async getOrder() {
        const { id } = this.props.match.params;
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/order/get/' + id, { headers: { Authorization: AuthStr } })
        .then(response => {
            this.setState({isLoaded: true, order:response.data.data});
        })
        .catch(function (error) {
            console.log(error);
            alert('Error: Could not get order details.');
        });
    }

    goBack(e){
        e.preventDefault();
        this.props.history.go(-1);
        return false;
    }

    handleShow() {
        return false;
    }

    render() {
        const { isLoaded, order, error, bucket } = this.state;

        
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
             return (
                <div>
                    <BackStrip goBack={this.goBack} />     
                    <div className="page-wrapper grid">
                        <Loader isLoading={true} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="checkout-success">
                    <BackStrip goBack={this.goBack} />
                    <div className="page-wrapper grid">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 mt-3 mb-3" key={order.id}>
                                    <div className="order-item-wrapper">
                                        <h2 className="text-center text-white mb-5 checkout-success-tg"> Thankyou {bucket.name}! Your order {order.order_id} has been placed successfully. <br/> We will contact you shortly for your order confirmation! </h2>
                                        <motion.div
                                            animate={{
                                              scale: [0, 1]
                                            }}
                                            transition={{ duration: 0.1 }}
                                            className="order-card card" 
                                        >
                                            <div className="order-images">
                                                <Carousel controls={false}>
                                                    {
                                                        order.items.map((i, k) => 
                                                            <Carousel.Item key={i.id}>
                                                                <div class="slide-bg full" style={{backgroundImage: `url(${i.image.small})`}}></div>
                                                                <Image key={i.id} frame={i.sku} currentItemId={i.image.id} handleShow={this.handleShow} isLoaded={true} item={i.image} classNames={i.sku} />
                                                            </Carousel.Item>
                                                        )
                                                    }
                                                </Carousel>
                                            </div>

                                            <div className="card-body">
                                                <h5 className="card-title mb-3">{ order.first_name } { order.last_name }</h5>
                                                
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div  className="order-detail">
                                                            <div className="order-detail-head">Order Id</div>
                                                            <div className="order-detail">{order.order_id}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Payment Method</div>
                                                        <div className="order-detail">{order.payment_method.name}</div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div  className="order-detail">
                                                            <div className="order-detail-head">Status</div>
                                                            <div className="order-detail">{order.status.status}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail">
                                                            <div className="order-detail-head">Total Images</div>
                                                            <div className="order-detail">{order.items.length}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Frame</div>
                                                        <div className="order-detail">{order.items[0].name}</div>
                                                    </div>

                                                    <div className="col-12 mb-2">
                                                        <hr/>
                                                        <h6> Address </h6>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Frame</div>
                                                        <div className="order-detail">{order.items[0].name}</div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Street Address</div>
                                                        <div className="order-detail">{order.street_address}</div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Street Address 2</div>
                                                        <div className="order-detail">{order.street_address_2}</div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">City</div>
                                                        <div className="order-detail">{order.city}</div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">State</div>
                                                        <div className="order-detail">{order.state}</div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Country</div>
                                                        <div className="order-detail">{order.country}</div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Postal code</div>
                                                        <div className="order-detail">{order.postal_code}</div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Contact</div>
                                                        <div className="order-detail">{order.contact_number}</div>
                                                    </div>

                                                    <div className="col-12 mb-2">
                                                        <hr/>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail">
                                                            <div className="order-detail-head">Subtotal</div>
                                                            <div className="order-detail">
                                                                <strong className="main-color">{order.subtotal.toFixed(2)} <span><small>{order.currency}</small></span></strong>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail">
                                                            <div className="order-detail-head">Discount</div>
                                                            <div className="order-detail">
                                                                <strong className="main-color">{order.discount ? order.discount.toFixed(2) : 0} <span><small>{order.currency}</small></span></strong>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail">
                                                            <div className="order-detail-head">Order Total</div>
                                                            <div className="order-detail">
                                                                <strong className="main-color">{order.total.toFixed(2)} <span><small>{order.currency}</small></span></strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Checkout; // Don’t forget to use export default!