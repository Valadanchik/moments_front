import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../blocks/Loader.js';
import { API_BASE_URL } from '../config'
import { motion } from "framer-motion";
import BackStrip from '../blocks/BackStrip.js'


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
        this.getOrder();
    }

    async getOrder() {
        const { id } = this.props.match.params;
        this.setState({isLoaded: false});
        axios.get(API_BASE_URL + '/order/track/' + id)
        .then(response => {
            this.setState({isLoaded: true, order:response.data.data});
        })
        .catch(function (error) {
            console.log(error);
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
        const { isLoaded, order, error } = this.state;

        
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
                        <div className="container">

                            <div className="row">
                                <div className="col-12 mt-3 mb-3" key={order.id}>
                                    <div className="order-item-wrapper">
                                        <motion.div
                                            animate={{
                                              scale: [0, 1]
                                            }}
                                            transition={{ duration: 0.1 }}
                                            className="card" 
                                        >
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
                                                        <div className="order-detail-head">Track my order shipment</div>
                                                        <div className="order-detail">{order.shipment_tracking_number ? order.shipment_tracking_number : 'In process!'} </div>
                                                        { order.shipment_tracking_number &&
                                                            <small><a href={'https://callcourier.com.pk/tracking/?tc=' + order.shipment_tracking_number} target="_blank" rel="noopener noreferrer" style={{color: '#CE2E94'}}>Where is this order?</a></small>
                                                        }
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div  className="order-detail">
                                                            <div className="order-detail-head">Status</div>
                                                            <div className="order-detail">{order.status.status}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div className="order-detail-head">Payment Method</div>
                                                        <div className="order-detail">{order.payment_method.name}</div>
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