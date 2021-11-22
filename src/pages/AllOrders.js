import React, { Component } from 'react';
import axios from 'axios';
import Header from '../templates/Header.js';
import Footer from '../templates/Footer.js';
import Loader from '../blocks/Loader.js';
import { API_BASE_URL } from '../config'
import { Link} from 'react-router-dom';
import { Form,InputGroup,Carousel} from 'react-bootstrap';
import Image from '../blocks/Image.js';
import {Pagination} from 'react-laravel-paginex'

class Order extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: false,
            isLoggedIn: false,
            user: {},
            orders: [],
            statuses: [],
            selectedStatus: ''
        }

        this.getOrders = this.getOrders.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.getData = this.getData.bind(this);
        this.getOrderStatuses = this.getOrderStatuses.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user, isLoaded: true});
            this.getOrders();
            this.getOrderStatuses();
        }
    }

    async getOrders() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/orders', { headers: { Authorization: AuthStr }, params: { 'status_id': this.state.selectedStatus } })
        .then(response => {
            this.setState({isLoaded: true, orders:response.data.data});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async getData(data) {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/orders?page=' + data.page, { headers: { Authorization: AuthStr }, params: { 'status_id': this.state.selectedStatus } })
        .then(response => {
            this.setState({isLoaded: true, orders:response.data.data});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async getOrderStatuses() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/statuses', { headers: { Authorization: AuthStr }})
        .then(response => {
            this.setState({isLoaded: true, statuses: response.data.data});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    handleShow() {
        return false;
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({ selectedStatus: value });

        setTimeout(() => {
          this.getOrders()
        }, 50);
    }

    render() {
        
        const { error, isLoaded, orders, selectedStatus, statuses } = this.state;
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

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

        } else {
            return (
                <div>
                    <Header />
                        <div className="page-wrapper">
                            <div className="container">
                                <div className="row">
                                    
                                    <div className="col-6">
                                        <div className="pt-4 pb-4">
                                        <InputGroup>
                                            <Form.Control
                                              type="text"
                                              name="status_id"
                                              value={selectedStatus}
                                              aria-describedby="status"
                                              onChange={this.handleChange} 
                                              as="select"
                                            >   
                                                <option key={-1} value='0'>All</option>
                                                { statuses &&
                                                    statuses.map((i, k) => 
                                                        <option key={i.id} value={i.id}> {i.status}</option>
                                                    )
                                                }
                                            </Form.Control>
                                        </InputGroup>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        {orders.total &&
                                            (orders.total > 8 &&
                                                <Pagination changePage={this.getData} data={orders}/>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    {orders.data &&
                                        orders.data.map((item, key) => 
                                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mt-3 mb-3" key={item.order_id}>
                                                <div className="order-item-wrapper">
                                                    <div className="card">
                                                        <div className="order-images">
                                                            <Carousel controls={false}>
                                                                {
                                                                    item.items.map((i, k) => 
                                                                        <Carousel.Item>
                                                                            <div class="slide-bg" style={{backgroundImage: `url(${i.image.url})`}}></div>
                                                                            <div className={i.sku}>
                                                                                <Image key={i.id} frame={i.sku} currentItemId={i.image.id} handleShow={this.handleShow} isLoaded={true} item={i.image} classNames={i.sku} />
                                                                            </div>
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
                                                                        <div className="order-detail-head">Date</div>
                                                                        <div className="order-detail">{(new Date(item.date)).toLocaleDateString("en-US", options)}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 mb-2">
                                                                    <div  className="order-detail">
                                                                        <div className="order-detail-head">Status</div>
                                                                        <div className="order-detail">{item.status.status}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 mb-2">
                                                                    <div  className="order-detail">
                                                                        <div className="order-detail-head">Status</div>
                                                                        <div className="order-detail">{item.contact_number}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12 mb-2">
                                                                    <div className="order-detail">
                                                                        <div className="order-detail-head">Frame</div>
                                                                        <div className="order-detail">{item.items[0].name}</div>
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

                                                                <div className="col-12 mb-2">
                                                                    <div className="order-detail-head">Payment Method</div>
                                                                    <div className="order-detail">{item.payment_method.name}</div>
                                                                </div>

                                                                <div className="col-12 mb-3">
                                                                    <div className="order-detail-head">Order shipment</div>
                                                                    <div className="order-detail">{item.shipment_tracking_number ? item.shipment_tracking_number : 'In process!'} </div>

                                                                        { !item.shipment_tracking_number &&
                                                                            <small>Waiting for tracking number</small>
                                                                        }

                                                                        { item.shipment_tracking_number &&
                                                                            <small>
                                                                                <a href={'https://callcourier.com.pk/tracking/?tc=' + item.shipment_tracking_number} target="_blank" rel="noopener noreferrer" style={{color: '#CE2E94'}}>Where is this order?</a>
                                                                            </small>
                                                                        }
                                                                </div>
                                                            </div>
                                                            <Link to={'/orders/edit/' + item.id} className="btn btn-sm">Edit</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="row">
                                    {orders.total &&
                                        (orders.total > 8 &&
                                            <Pagination changePage={this.getData} data={orders}/>
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