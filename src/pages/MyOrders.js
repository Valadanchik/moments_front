import React, { Component } from 'react';
import axios from 'axios';
import Header from '../templates/Header.js';
import Footer from '../templates/Footer.js';
import Loader from '../blocks/Loader.js';
import { API_BASE_URL } from '../config'
import { Link } from 'react-router-dom';
import { Carousel} from 'react-bootstrap';
import { motion } from "framer-motion";
import Image from '../blocks/Image.js';
import {Pagination} from 'react-laravel-paginex'

class Order extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: false,
            isLoggedIn: false,
            user: {},
            orders: []
        }

        this.getOrders = this.getOrders.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.getData = this.getData.bind(this);

    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user, isLoaded: true});
            this.getOrders();
        }
    }

    async getOrders() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/order/get', { headers: { Authorization: AuthStr } })
        .then(response => {
            this.setState({isLoaded: true, orders:response.data.data});
        })
        .catch(function (error) {
            localStorage["appState"] = '';
            window.location.href = "/";
        });
    }

    async getData(data) {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/order/get?page=' + data.page, { headers: { Authorization: AuthStr } })
        .then(response => {
            this.setState({isLoaded: true, orders:response.data.data});
        })
        .catch(function (error) {
            localStorage["appState"] = '';
            window.location.href = "/";
        });
    }

    handleShow() {
        return false;
    }

    render() {
        
        const { error, isLoaded, orders } = this.state;
        
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div>
                    <Header />
                        
                        <div className="page-wrapper grid">
                            <Loader isLoading={true} />
                        </div>

                    <Footer />
                </div>
            );

        } else if ( orders.total === 0 ) {
            return (
                <div>
                    <Header />
                        <div className="page-wrapper">
                            <div className="container">
                                <Link to="/order"><motion.div
                                        animate={{
                                          scale: [0, 1]
                                        }}
                                        transition={{ duration: 0.2 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="to_order"
                                        
                                    >
                                        <h2 className="main-title"> You haven't placed any order yet. Head over to the orders section to place an order now! </h2>
                                </motion.div></Link>
                            </div>
                        </div>
                    <Footer />
                </div>
            );
        } else {
            return (
                <div>
                    <Header />
                        <div className="page-wrapper">
                            <div className="container">
                                <div className="row">
                                    {orders.total &&
                                        (orders.total > 8 &&
                                            <Pagination changePage={this.getData} data={orders}/>
                                        )
                                    }
                                </div>
                                <div className="row">
                                    { orders.data &&
                                        orders.data.map((item, key) => 
                                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mt-3 mb-3" key={item.order_id}>
                                                <div className="order-item-wrapper">
                                                    <div className="card">
                                                        <div className="order-images">
                                                            <Carousel controls={false}>
                                                                {
                                                                    item.items.map((i, k) => 
                                                                        <Carousel.Item> 
                                                                            <div class="slide-bg" style={{backgroundImage: `url(${i.image.thumb})`}}></div>
                                                                            <Image key={i.id} frame={i.sku} currentItemId={i.image.id} handleShow={this.handleShow} isLoaded={true} item={i.image} classNames={i.sku} />
                                                                        </Carousel.Item>
                                                                    )
                                                                }
                                                            </Carousel>
                                                        </div>

                                                        <div className="card-body">
                                                            <h5 className="card-title mb-3">{ item.first_name } { item.last_name }</h5>
                                                            
                                                            <div className="row">
                                                                <div className="col-12 mb-2">
                                                                    <div  className="order-detail">
                                                                        <div className="order-detail-head">Order Id</div>
                                                                        <div className="order-detail">{item.order_id}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 mb-2">
                                                                    <div  className="order-detail">
                                                                        <div className="order-detail-head">Status</div>
                                                                        <div className="order-detail">{item.status.status}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 mb-2">
                                                                    <div className="order-detail">
                                                                        <div className="order-detail-head">Total Images</div>
                                                                        <div className="order-detail">{item.items.length}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 mb-2">
                                                                    <div className="order-detail-head">Total</div>
                                                                        <div className="order-detail">{item.total.toFixed(2)} <span><small>PKR</small></span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <Link to={'/orders/my/' + item.id} className="btn btn-sm">View details</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    <Footer />
                </div>
            );
        }
    }
}

export default Order; // Don’t forget to use export default!