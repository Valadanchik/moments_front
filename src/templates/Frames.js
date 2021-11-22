import React, { Component } from 'react';
import axios from 'axios';
import Loader from '../blocks/Loader.js';
import { API_BASE_URL } from '../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal  } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-161629941-2');

class Frames extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: true,
            isLoggedIn: false,
            user: {},
            bucket: {},
            frames: [],
            mostselling: {}
        }

        this.handleUpload = this.handleUpload.bind(this);
        this.changeFrameSize = this.changeFrameSize.bind(this);   
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user});
            this.getFrames(8);
        }
    }

    async getFrames(size) {
        this.setState({isLoaded: false});
        console.log(size);
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/frames/get?size=' + size, { headers: { Authorization: AuthStr } })
        .then(response => {
            console.log(response);
            console.log(response.data.data[0].id);
            this.props.loadFrames(response.data.data, response.data.data[0].id);
            this.props.changeFrame(response.data.data[0].id);
            this.setState({isLoaded: true});
            this.getMostSelling();
        })
        .catch(function (error) {
        });
    }

    async getMostSelling() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/reports/mostselling', { headers: { Authorization: AuthStr } })
        .then(response => {
            this.setState({isLoaded: true, mostselling: response.data.data[0] });
        })
        .catch(function (error) {
        });
    }

    async getImages() {
        const AuthStr = 'Bearer '.concat(this.state.user.access_token);
        axios.get(API_BASE_URL + '/image/get', {headers: {Authorization: AuthStr}})
        .then(response => {
            console.log(response.data.data);
            this.props.loadImages(response.data.data, response.data.data.length);
            this.setState({isLoaded: true});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    handleUpload(event) {

        this.props.imageUplaoding();

        const data = new FormData();
        const AuthStr = 'Bearer '.concat(this.state.user.access_token);

        for (const file of event.target.files) {
            data.append('full_image[]', file, file.name);
        }

        axios({
            method: 'post',
            url: API_BASE_URL + '/image/upload',
            data: data,
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': AuthStr},
            onUploadProgress: (progressEvent) => {
                let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                this.props.setUploadPercent(progress);
            }
        })
            .then(res => {
                this.getImages();
                this.setState({ uploadPercent: 0});
                this.props.imageUplaoded();
                ReactGA.event({
                    category: 'Image',
                    action: 'Uploaded Image',
                    label: res.data.data.id
                });
            })
            .catch(function (error) {
                console.log(error);
                ReactGA.event({
                    category: 'Image',
                    action: 'Image Upload Failed'
                });
                alert('Error: Could not upload image.')
            });
        ;
    }

    changeFrameSize(size) {
        this.getFrames(size);
        this.props.changeFrameSize(size);
    }

    handleClick = (e) => {
        this.inputElement.click();
    }

    render() {
        
        const { error, isLoaded, mostselling } = this.state;
        const { frames, selectedFrame, frameModal, openFrameModal, openSizeModal, sizeModal } = this.props;
        console.log(frames);
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div className="row">
                    <div className="col-12">
                        <Loader isLoading={true} />
                    </div>
                </div>
            );
        } else {
            return (
                <>
                <div className="row">
                    <div className="frame-btn col-7">
                        <Link to='' className="btn-opp btn-lg d-inline mr-2" onClick={openSizeModal}>
                            Size
                        </Link>

                        <Link to='' className="btn-opp btn-lg d-inline mr-2" onClick={openFrameModal}>
                            Frame
                        </Link>
                    </div>
                    <div className="add-image-btn-wrap col-5">
                        <div className="btn btn-lg position-relative d-inline">
                            Add Picture
                            <input ref={input => this.inputElement = input} type='file' accept="image/png, image/jpeg" name="image[]"
                                   className="img-upload-input" onChange={this.handleUpload} multiple/>
                        </div>
                    </div>
                </div>

                <div className="clearfix"> </div>

                <Modal className="frame-select-modal" show={sizeModal}>
                    <Modal.Header> 
                        <h4>Select Frame Size</h4>
                        <FontAwesomeIcon icon={faTimes} size="2" color='#CE2E94' className="close-btn mr-2" onClick={(e) => this.props.closeSizeModal(e)} />
                    </Modal.Header>
                         
                    <Modal.Body className="frame-modal">
                        <div className="frames-sizes"> 
                            <div className="frames-size size-12" onClick={() => this.changeFrameSize(12)}> 12x12 </div>
                            <div className="frames-size size-10" onClick={() => this.changeFrameSize(10)}> 10x10 </div>
                            <div className="frames-size size-8" onClick={() => this.changeFrameSize(8)}> 8x8 </div>
                            <div className="frames-size size-6" onClick={() => this.changeFrameSize(6)}> 6x6 </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal className="frame-select-modal" show={frameModal}>
                    <Modal.Header> 
                        <h4>Select Frame</h4>
                        <FontAwesomeIcon icon={faTimes} size="2" color='#CE2E94' className="close-btn mr-2" onClick={(e) => this.props.closeFrameModal(e)} />
                    </Modal.Header>
                         
                    <Modal.Body className="frame-modal">
                        <div className="order-wrapper">
                            <div className="frames"> 
                                {(
                                    frames.map((item, key) =>
                                        <div key={item.id} 
                                            className= { 
                                                'single-frame ' + item.sku +
                                                (mostselling ? mostselling.name === item.name ? ' best-selling' : '' : '') +
                                                (selectedFrame === item.id ? ' active' : '')
                                            } 
                                            onClick={() => this.props.changeFrame(item.id)}
                                        >
                                            <img src={'/img/frames/' + item.sku + '.png'} alt={item.sku} />
                                            <p>{item.name}</p>
                                            { mostselling &&
                                                mostselling.name === item.name &&
                                                <span className="best-selling-label"> BEST SELLING </span>

                                            }
                                            <span className="frame-price">PKR {item.sale_price > 0 ? item.sale_price.toFixed(2) : item.price.toFixed(2)}</span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                </>
            );
        }
    }
}

export default Frames; // Don’t forget to use export default!