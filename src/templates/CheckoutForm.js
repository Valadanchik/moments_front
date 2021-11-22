import React, { Component } from 'react';
import axios from 'axios';
import { API_BASE_URL, GA_ID, PIXEL_ID } from '../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSpinner, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import {Redirect} from 'react-router-dom';
import { Modal  } from 'react-bootstrap';
import Loader from '../blocks/Loader.js';
import Address from '../blocks/Address.js';
import { Link} from 'react-router-dom';
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
ReactGA.initialize(GA_ID);

class CheckoutForm extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: true,
            isLoggedIn: false,
            user: {},
            paymentMethods: [],
            userAddresses: [],
            errorMessages: [],
            addressData: {},
            checkoutInit: false,
            newAddressShow: false,
            addressId: null,
            paymentMethodId: null,
            orderReply: null,
            orderReqProcessed: false,
            addressAdded: false
        }

        this.state.countries = [
          { code: 'PK', name: 'Pakistan', phone: '+92' },
        ]

        this.state.states = [
            { code: 'PK-SD', name: 'Sindh' },
            { code: 'PK-PB', name: 'Punjab' }
        ]

        this.checkoutActivate = this.checkoutActivate.bind(this);
        this.checkoutDeactivate = this.checkoutDeactivate.bind(this);
        this.checkoutHide = this.checkoutHide.bind(this);   
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.newAddressActivate = this.newAddressActivate.bind(this);
        this.newAddressDectivate = this.newAddressDectivate.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
        this.orderAddress = this.orderAddress.bind(this);
        this.orderPaymentMethod = this.orderPaymentMethod.bind(this);
        this.pushToGa = this.pushToGa.bind(this);

        ReactPixel.init(PIXEL_ID, {}, { autoConfig: true, debug: false});
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user});

            if (AppState.address) {
                let address = this.state.userAddresses;
                address.push(AppState.address);
                this.setState({userAddresses: address, addressData: AppState.address, addressId: AppState.address.id});
            }

            if ( this.state.isLoggedIn ) {
                this.getPaymentMethods();
                this.getUserAddresses();
            }
        } 
    }

    async getPaymentMethods() {
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/payment_methods/get', { headers: { Authorization: AuthStr } })
        .then(response => {
            console.log(response);
            this.setState({paymentMethods: response.data.data});
        })
        .catch(function (error) {
            console.log(error);
            alert('Error: Could not get payment methods.');
        });;
    }

    async getUserAddresses() {
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/user/address/get', { headers: { Authorization: AuthStr } })
        .then(res => {
            if ( res.data.data.length > 0 ) {
                let address = [];
                address.push(res.data.data);
                this.setState({userAddresses: address, addressData: res.data.data, addressId: res.data.data.id});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    handleChange(event) {

        if ( typeof event === 'string') {

            let address = this.state.addressData;
            address['contact_number'] = event;

            this.setState({ addressData: address });

        } else {
            const target = event.target;
            const value = target.value;
            const name = target.name;

            let address = this.state.addressData;
            address[name] = value;

            this.setState({ addressData: address });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ isLoaded: false });
        const data = new FormData(event.target);

        if (data.get('id'))
            data.append('id', data.get('id')); 

        data.append('contact_number', data.get('contact_number')); 
        data.append('country_code', data.get('country_code')); 
        data.append('email', data.get('email')); 
        data.append('first_name', data.get('first_name')); 
        data.append('last_name', data.get('last_name')); 
        data.append('street_address', data.get('street_address'));
        data.append('street_address_2', data.get('street_address_2'));
        data.append('city', data.get('city'));
        data.append('postal_code', data.get('postal_code'));
        data.append('state', data.get('state')); 

        if ( data.get('contact_number') === '+92' ) {
            this.setState({ errorMessages: { contact_number: true }, isLoaded: true });
            return;
        } else {
            this.setState({ errorMessages: { contact_number: false } });
        }

        let AuthStr = ''
        
        if (this.state.user)
            AuthStr = 'Bearer '.concat(this.state.user.access_token);

        axios({
            method: 'post',
            url: API_BASE_URL + '/user/address/new',
            data: data,
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': AuthStr}
        })
        .then(res => {
            
            if (res.data.error === true) {
                this.setState({ errorMessages: res.data.message });
            } else if (res.data.error === false) {
                
                let addressData = {
                    id: res.data.data.id,
                    contact_number: res.data.data.contact_number,
                    country_code: res.data.data.country_code,
                    email: res.data.data.email,
                    first_name: res.data.data.first_name,
                    last_name: res.data.data.last_name,
                    street_address: res.data.data.street_address,
                    street_address_2: res.data.data.street_address_2,
                    city: res.data.data.city,
                    postal_code: res.data.data.postal_code,
                    state: res.data.data.state
                };
                
                let appState = {
                    isLoggedIn: this.state.isLoggedIn,
                    user: this.state.user,
                    address: addressData
                };

                localStorage["appState"] = JSON.stringify(appState);

                let address = this.state.userAddresses;
                address = [];
                address.push(res.data.data);
                this.setState({ userAddresses: address, newAddressShow: false, addressData: addressData, addressId: res.data.data.id, addressAdded: true, orderReply: null });
                
                ReactGA.event({
                    category: 'Order',
                    action: 'Saved address'
                });
                ReactPixel.track('AddPaymentInfo');
            }

            this.setState({ isLoaded: true });
        })
        .catch(function (error) {
            alert('Error: Could not add user address.');
        });
    }

    checkoutActivate(e) {
        e.preventDefault();
        
        ReactGA.event({
            category: 'Order',
            action: 'Opened checkout popup'
        });
        ReactPixel.track('InitiateCheckout');

        this.setState({checkoutInit: true});
    }

    checkoutDeactivate(e) {
        e.preventDefault();

        ReactGA.event({
            category: 'Order',
            action: 'Closed checkout popup'
        });

        this.setState({checkoutInit: false});
    }

    checkoutHide() {
        this.setState({checkoutInit: false});
    }

    newAddressActivate(e) {
        e.preventDefault();
        this.setState({newAddressShow: true});

        ReactGA.event({
            category: 'Order',
            action: 'Opened address popup'
        });
    }

    newAddressDectivate(e) {
        e.preventDefault();
        this.setState({newAddressShow: false});

        ReactGA.event({
            category: 'Order',
            action: 'Closed address popup'
        });
    }

    orderAddress(e) {
        this.setState({addressId: e.currentTarget.value});
    }

    orderPaymentMethod(e) {
        this.setState({paymentMethodId: e.currentTarget.value});
    }

    placeOrder(e) {
        e.preventDefault();
        
        this.setState({ isLoaded: false });
        this.setState({ orderReply: []});

        if ( this.state.paymentMethodId == null ) {

            var v2 = {
                error: true,
                message: 'Please select a payment method.'
            }
            this.setState({ orderReply: v2});
            this.setState({ isLoaded: true });

            return;
        }

        if ( this.state.addressId == null ) {

            var v3 = {
                error: true,
                message: 'Please add a address. Add you\'re address if you haven\'t added already!'
            }
            this.setState({ orderReply: v3 });
            this.setState({ isLoaded: true });

            return
        }

        if ( this.props.totalImages < 1 ) {
            var v4 = {
                error: true,
                message: 'You need to upload atleast one image to place an order!'
            }

            this.setState({ orderReply: v4 });
            this.setState({ isLoaded: true });

            return
        }

        const data = new FormData();
        data.append('payment_method_id', this.state.paymentMethodId); 
        data.append('address_id', this.state.addressId); 
        data.append('status_id', 1);
        data.append('frame_id', this.props.selectedFrame);

        if ( this.props.discount > 0 ) {

            if ( this.props.couponApplied )
                data.append('coupon_id', this.props.couponData.id); 

            data.append('discount', this.props.discount); 
        }

        let AuthStr = ''
        
        if (this.state.user)
            AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        
        axios({
            method: 'post',
            url: API_BASE_URL + '/order/new',
            data: data,
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': AuthStr}
        })
        .then(res => {
            if ( !res.data.error ) {
                this.props.loadImages([], 0);
                this.props.removeCoupon();
                this.pushToGa(res.data.data)
                this.setState({ orderReply: res.data});
                this.setState({ orderReqProcessed: true});
            }

            this.setState({ isLoaded: true });
        })
        .catch(function (error) {
            console.log(error);
            alert('Error: Could not place order.');
        });;
    }

    pushToGa( orderData ) {

        ReactGA.event({
            category: 'Order',
            action: 'Placed an order'
        });

        ReactGA.plugin.require('ecommerce');

        let items = [];
        orderData.items.map((i, k) => {

            let item = {
                id: orderData.order_id,
                name: i.name,
                sku: i.sku, 
                price: orderData.total / orderData.items.length,
                quantity: 1,
            };
            ReactGA.plugin.execute(
              'ecommerce',
              'addItem',
              item
            );

            items.push(item);

            return null;
        })
            
        ReactGA.plugin.execute(
          'ecommerce',
          'addTransaction',
          {
            id: orderData.order_id, // the same as for addItem to connect them
            revenue: orderData.total, // obviously it's price * quantity
          }
        );

        ReactGA.plugin.execute('ecommerce', 'send');
        ReactGA.plugin.execute('ecommerce', 'clear');

        ReactPixel.track('Purchase', {
            value: orderData.total, 
            currency: 'PKR'
        });

        
    }

    render() {
        
        const { error, isLoaded, userAddresses, errorMessages, addressData, newAddressShow, orderReply, orderReqProcessed, addressAdded, checkoutInit} = this.state;
        const { setCoupon, applyCoupon, removeCoupon, total, coupon, couponResonseError, couponData, couponResonseMsg, couponApplied, discount } = this.props;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (orderReqProcessed) {
            return <Redirect to={{ pathname: "/checkout/success/" + orderReply.data.id}} />
        } else {
            return (
                <div>
                    <div className={checkoutInit ? 'page-action checkoutInit' : 'page-action'} > 
                        <div className="container page-action-wrapper mt-4 mb-4">
                            <div className="total">
                                Your total: 
                                
                                { discount > 0 &&
                                    <div className="discount-wrapper">
                                        <span className="price"> {total.toFixed(2)} <small> <span className="total"> {(total + discount).toFixed(2)}</span> PKR</small></span>
                                    </div>
                                }

                                { discount === 0 &&
                                    <div>
                                        <span className="price"> {total.toFixed(2)} <small>PKR</small></span>
                                    </div>
                                }
                                
                            </div>
                            <div className="checkout-btn">
                                <Link to='' className="btn btn-lg float-right" onClick={this.checkoutActivate}>Checkout</Link>
                            </div>
                        </div>
                    </div>

                    <Modal className="checkout-modal-wrap right" show={checkoutInit} onHide={this.checkoutHide}>
                        <Modal.Body className="checkout-modal">
                            { !isLoaded &&
                                <div className='checkout-wrapper checkoutInit loading'>
                                    <Loader isLoading={true} />
                                </div>
                            }

                            { isLoaded &&
                                <div className='checkout-wrapper checkoutInit'>
                                    <div className="checkout-inner container">
                                        <form onSubmit={this.placeOrder}>
                                            <Link to='' className="btn icon float-right" onClick={this.checkoutDeactivate}>
                                                <FontAwesomeIcon icon={faTimes} color='#495057' size='1x' />
                                            </Link>
                                        
                                            <div className="checkout-forms">
                                                <h2 className="text-left mb-5"> CHECKOUT </h2>
                                            </div>

                                            { orderReply &&
                                                <div className={orderReply.error ? 'alert alert-danger' : 'alert alert-success'}> 
                                                    <p> {orderReply.message} </p>
                                                </div>
                                            }

                                            { addressAdded &&
                                                <div className='alert alert-success'> 
                                                    <p> Your address has been saved. </p>
                                                </div>
                                            }

                                            <div className="checkout-forms">
                                                <div className="address-form">
                                                    <h5>Shipping Address </h5>
                                                    <div className="old-address"> 
                                                        <div className="address">
                                                            { userAddresses.length > 0 &&
                                                                userAddresses.map((item, key) =>
                                                                    <div className="user-address" onClick={this.newAddressActivate} key={item.id}>
                                                                        <div className="row">
                                                                            <div className="col-10">
                                                                                <p>{item.street_address}, {item.city}</p>
                                                                                <p>{item.email} </p>
                                                                            </div>
                                                                            <div className="col-2">
                                                                                <FontAwesomeIcon className="float-right" icon={faPencilAlt} color='#CE2E94' size='1x' />
                                                                            </div> 
                                                                            
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        
                                                        { userAddresses.length === 0 &&
                                                            <div className="new-address-btn">
                                                                <Link to='' className="btn-opp btn-sm" onClick={this.newAddressActivate}>
                                                                    Add new address
                                                                </Link>
                                                            </div>
                                                        }
                                                        
                                                    </div>
                                                </div>

                                                <div className="coupon">
                                                    <h5 className="mb-4">Coupon</h5> 
                                                    <div className="coupon-box">
                                                        <div className="row">
                                                            <div className="col-8">
                                                                <input className={couponResonseError ? 'form-control is-invalid mb-2 h-100' : couponResonseMsg.length > 0 ? 'form-control mb-2 h-100': 'form-control mb-2 h-100'} type="text" name="coupon" placeholder="Add a coupon" id="coupon" onChange={(e) => setCoupon(e)} value={coupon} />
                                                            </div>

                                                            <div className="col-4">
                                                                <Link to='' className="btn-opp btn-sm" onClick={applyCoupon}>Apply</Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    { couponApplied &&
                                                        <div className="applied-coupon">
                                                            {couponData.name}
                                                            <span className="coupon-clear" onClick={removeCoupon}><FontAwesomeIcon icon={faTimes} color='red' size='1x' /></span>
                                                        </div>
                                                    }

                                                    <small className={couponResonseError ? 'invalid-feedback mt-2 d-block' : couponResonseMsg.length > 0 ? 'valid-feedback mt-2 d-block': ''}>{couponResonseMsg}</small>
                                                        
                                                </div>

                                                <div className="checkout-totals">
                                                    <h5>Payment</h5> 
                                                    <div className="payment-methods">
                                                        {(
                                                            this.state.paymentMethods.map((item, key) =>
                                                                <div key={item.id} className="form-check form-check-inline">
                                                                    <div className="chmrk-container">
                                                                        <input className="form-check-input" type="radio" name="payment_method" id="payment_method" value={item.id} onClick={this.orderPaymentMethod} required />
                                                                        <span className="checkmark"></span>
                                                                    </div>
                                                                    <label className="form-check-label" htmlFor="payment_method">
                                                                        {item.name}
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>

                                                    <div className="info-lines">
                                                        <table width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td>Frames</td>
                                                                    <td align="right">{this.props.totalImages}</td>
                                                                </tr>

                                                                { discount > 0 &&
                                                                    <tr>
                                                                        <td>Subtotal</td>
                                                                        <td align="right">{(total + discount).toFixed(2)} <small>PKR</small></td>
                                                                    </tr>
                                                                }

                                                                { discount > 0 &&
                                                                    <tr>
                                                                        <td>Discount</td>
                                                                        <td align="right">{discount.toFixed(2)} <small>PKR</small></td>
                                                                    </tr>
                                                                }
                                                                
                                                                <tr>
                                                                    <td>Shipping</td>
                                                                    <td align="right">Free</td>
                                                                </tr>

                                                                <tr>
                                                                    <td><strong>Total</strong></td>
                                                                    <td align="right"><strong>{total.toFixed(2)} <small>PKR</small></strong></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="place-order">
                                                <input type="submit" className="btn btn-lg" value="Place Order" />
                                                {
                                                  !isLoaded &&
                                                  <FontAwesomeIcon icon={faSpinner} color='#495057' size='1x' spin />
                                                } 
                                            </div> 
                                        </form>
                                    </div>
                                </div>
                            }
                        </Modal.Body>
                    </Modal>

                    <Modal show={newAddressShow} onHide={this.handleClose} className="right">
                        <Modal.Body className="new-address-modal">
                            { !isLoaded &&
                                <div className='checkout-wrapper checkoutInit loading'>
                                    <Loader isLoading={true} />
                                </div>
                            }

                            { isLoaded &&
                                <Address addressData={addressData} newAddressShow={newAddressShow} handleSubmit={this.handleSubmit} newAddressDectivate={this.newAddressDectivate} errorMessages={errorMessages} handleChange={this.handleChange} />
                            }
                        </Modal.Body>
                    </Modal>       
                </div>
            );
        }
    }
}

export default CheckoutForm; // Don’t forget to use export default!