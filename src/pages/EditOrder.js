import React, { Component } from 'react';
import axios from 'axios';
import Header from '../templates/Header.js';
import Footer from '../templates/Footer.js';
import Loader from '../blocks/Loader.js';
import { API_BASE_URL } from '../config'
import { Carousel} from 'react-bootstrap';
import Image from '../blocks/Image.js';
import { Form, InputGroup  } from 'react-bootstrap';


class MyOrder extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: false,
            isLoggedIn: false,
            user: {},
            order: [],
            statuses: [],
            editData: []
        }

        this.getOrder = this.getOrder.bind(this);
        this.getOrderStatuses = this.getOrderStatuses.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user});
            this.getOrder();
            this.getOrderStatuses();
        }
    }

    async getOrder() {

        const { id } = this.props.match.params;
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/order/get/' + id, { headers: { Authorization: AuthStr } })
        .then(response => {
            console.log(response);
            this.setState({isLoaded: true, order:response.data.data});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async getOrderStatuses() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/statuses', { headers: { Authorization: AuthStr } })
        .then(response => {
            this.setState({isLoaded: true, statuses: response.data.data});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let editData = this.state.editData;
        editData[name] = value;

        this.setState({ editData: editData });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { id } = this.props.match.params;

        this.setState({ isLoaded: false });
        const data = new FormData(event.target);
        data.append('status_id', data.get('status_id'));
        
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios({
            method: 'post',
            url: API_BASE_URL + '/order/update/' + id,
            data: data,
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': AuthStr }
        })
        .then(res => {

            if (res.data.error === true) {
                this.setState({ errorMessages: res.data.message });
            } else if (res.data.error === false) {
                this.setState({isLoaded: true, order: res.data.data});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    handleDownload(e) {
        e.preventDefault();
        const { id } = this.props.match.params;

        this.setState({ isLoaded: false });
        
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios({
            method: 'GET',
            url: API_BASE_URL + '/get_smlimages/' + id,
            responseType: 'blob', // important
            headers: {'Authorization': AuthStr }
        })
        .then(res => {
            this.setState({ isLoaded: true });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.state.order.order_id + '.zip'); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        
        const { error, isLoaded, order, statuses, editData } = this.state;

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
                        <div className="page-wrapper grid">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12 mt-3 mb-3" key={order.id}>
                                        <div className="order-item-wrapper">
                                            <div className="order-card card">
                                                <div className="order-images">
                                                    <Carousel controls={false}>
                                                        { order.items &&
                                                            order.items.map((i, k) => 
                                                                <Carousel.Item key={i.id}>
                                                                    <div class="slide-bg full" style={{backgroundImage: `url(${i.image.small})`}}></div>
                                                                    <div className={i.sku}>
                                                                            <Image key={i.id} frame={i.sku} currentItemId={i.image.id} handleShow={this.handleShow} isLoaded={true} item={i.image} classNames={i.sku} />
                                                                    </div>
                                                                </Carousel.Item>
                                                            )
                                                        }
                                                    </Carousel>
                                                </div>
                                                { order.payment_method &&
                                                    <div className="card-body">
                                                        <h5 className="card-title mb-3">{ order.first_name } { order.last_name }</h5>
                                                        
                                                        <form method="post" onSubmit={this.handleSubmit} autoComplete="off" >
                                                            <div className="row">
                                                                
                                                               <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
                                                                    <div  className="order-detail">
                                                                        <div className="order-detail-head">Status</div>
                                                                        <div className="order-detail">
                                                                            <InputGroup>
                                                                                <Form.Control
                                                                                  type="text"
                                                                                  name="status_id"
                                                                                  value={editData.status_id ? editData.status_id : order.status.id}
                                                                                  aria-describedby="status"
                                                                                  onChange={this.handleChange} 
                                                                                  as="select"
                                                                                >
                                                                                    { statuses &&
                                                                                        statuses.map((i, k) => 
                                                                                            <option key={i.id} value={i.id}> {i.status}</option>
                                                                                        )
                                                                                    }
                                                                                </Form.Control>
                                                                            </InputGroup>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12 col-md-6 col-lg-6 mb-3">
                                                                    <div  className="order-detail">
                                                                        <div className="order-detail-head">Shipment Tracking Number</div>
                                                                        <div className="order-detail">
                                                                            <InputGroup>
                                                                                <Form.Control
                                                                                  type="text"
                                                                                  name="shipment_tracking_number"
                                                                                  value={editData.shipment_tracking_number ? editData.shipment_tracking_number : order.shipment_tracking_number ? order.shipment_tracking_number : ''}
                                                                                  aria-describedby="shipment_tracking_number"
                                                                                  onChange={this.handleChange}
                                                                                />
                                                                            </InputGroup>
                                                                            { order.shipment_tracking_number &&
                                                                                <strong><a href={'https://callcourier.com.pk/tracking/?tc=' + order.shipment_tracking_number} target="_blank" rel="noopener noreferrer" style={{color: '#CE2E94'}}>Where is this order?</a></strong>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12">
                                                                    <input type="submit" className="btn btn-sm float-left mb-2 mr-3" value="Save" />
                                                                    <input type="button" className="btn btn-sm float-left mb-2" onClick={this.handleDownload} value="Download Images" />
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
                                                                            <strong className="main-color">{order.discount ? order.discount.toFixed(2) : 0.00} <span><small>{order.currency}</small></span></strong>
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

                                                                <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                                    <div className="order-detail">
                                                                        <div className="order-detail-head">Coupon</div>
                                                                        <div className="order-detail">
                                                                            <strong className="main-color">{order.coupon ? order.coupon.name : '-'}</strong>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12">
                                                                    <hr/>
                                                                </div>

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

                                                                <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                                    <div className="order-detail-head">Email</div>
                                                                    <div className="order-detail">{order.email}</div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <Footer />
                </div>
            );
        }
    }
}

export default MyOrder; // Don’t forget to use export default!