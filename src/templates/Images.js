import React, {Component} from 'react';
import axios from 'axios';
import Image from '../blocks/Image.js';
import {API_BASE_URL} from '../config'
import {Modal, Button} from 'react-bootstrap';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Loader from "../blocks/Loader";
import ReactGA from 'react-ga';
import { MuuriComponent } from "muuri-react";

ReactGA.initialize('UA-161629941-2');

class Images extends Component {

    constructor(props) {
        super();

        this.state = {
            isLoaded: true,
            isLoggedIn: false,
            isUploaderLoading: false,
            user: {},
            images: [],
            frames: [],
            uploadError: false,
            errors: [],
            modalShow: false,
            imgId: false,
            adjustModalShow: false,
            imageUrl: null,
            croppedImageUri: null,
            errorModalShow: false,
            uploadPercent: 0,
            isCropperReady: false
        }

        this.handleDelete = this.handleDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.openAdjustModal = this.openAdjustModal.bind(this);
        this.closeAdjustModal = this.closeAdjustModal.bind(this);
        this.saveCroppedImage = this.saveCroppedImage.bind(this);
        this.errorModalClose = this.errorModalClose.bind(this);
        this.setCropperReadyState = this.setCropperReadyState.bind(this);
        this.imageElement = React.createRef();
    }

    async componentDidMount() {
        let state = localStorage["appState"];

        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user});

            if (AppState.isLoggedIn) {
                this.getImages();
            }
        }
    }

    async getImages() {
        const AuthStr = 'Bearer '.concat(this.state.user.access_token);
        axios.get(API_BASE_URL + '/image/get', {headers: {Authorization: AuthStr}})
            .then(response => {
                this.props.loadImages(response.data.data, response.data.data.length);
                this.setState({isLoaded: true, isUploaderLoading: false});
            })
            .catch(function (error) {
                console.log(error);
            });
        ;
    }

    setCropperReadyState(e) {
        
        e.path[1].classList.add('cropper-view-box-scale')
        const el = e.path[1].querySelector('.cropper-view-box')
        const img = e.path[1].querySelector('.cropper-view-box img')
        const box = document.querySelector('.cropper-crop-box')
        let w = el.clientWidth
        const boxWidth = parseInt(getComputedStyle(box, ':after').width)


        if (img.height > img.width ) {
            let scaleRatio = (boxWidth - 50) / w;
            if (img.height / img.width > 1.5) {
                scaleRatio = scaleRatio - .1
            }
            if (this.props.selectedFrame%2 !== 0){
                el.style.transform = `scale(${scaleRatio})`
            }

        }
        if (img.height < img.width ) {
            let scaleRatio = (boxWidth - 50) / w;

            if (this.props.selectedFrame%2 !== 0) {
                el.style.transform = `scale(${scaleRatio})`
            }
        }

        this.setState({isCropperReady: true})
    }

    handleClose() {
        this.setState({modalShow: false, 'imgId': null, 'imageUrl': null});
    }

    errorModalClose() {
        this.setState({uploadError: false});
    }

    handleShow(id, url) {
        this.setState({modalShow: true, 'imgId': id, 'imageUrl': url});
    }

    handleDelete() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token);
        axios.delete(API_BASE_URL + '/image/delete/' + this.state.imgId, {headers: {Authorization: AuthStr}})
            .then(response => {
                this.setState({modalShow: false});
                this.setState({isLoaded: true});
                this.getImages();
                ReactGA.event({
                    category: 'Image',
                    action: 'Deleted Image',
                    label: this.state.imgId
                });
            })
            .catch(function (error) {
                console.log(error);
                alert('Error: Could not delete image.')
            });
        ;
    }

    openAdjustModal() {
        this.setState({adjustModalShow: true, modalShow: false});
        ReactGA.event({
            category: 'Image',
            action: 'Adjust popup opened',
            label: this.state.imgId
        });
    }


    closeAdjustModal() {
        this.setState({adjustModalShow: false, modalShow: false,isCropperReady: false});
    }

    saveCroppedImage() {

        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token);
        const data = new FormData();
        data.append('image', this.imageElement.current.getCroppedCanvas().toDataURL());
        data.append('id', this.state.imgId);
        axios({
            method: 'post',
            url: API_BASE_URL + '/image/update',
            data: data,
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': AuthStr}
        })
            .then(res => {
                this.getImages();
                this.setState({adjustModalShow: false});
                setTimeout(() => {
                    this.setState({isLoaded: true});
                }, 400);

                ReactGA.event({
                    category: 'Image',
                    action: 'Adjusted Image',
                    label: this.state.imgId
                });

            })
            .catch(function (error) {
                localStorage["appState"] = '';
                window.location.href = "/";
            });
        ;
    }

    _crop() {

    }

    _zoom(e) {
        if (e.detail.ratio > 1) {
            e.preventDefault();
        }
    }

    render() {

        const {error, isLoaded, modalShow, imgId, adjustModalShow, imageUrl, uploadError, errors, isCropperReady} = this.state;
        const {frames, selectedFrame, images} = this.props;

        let frame =  frames.find((element) => {
            return element.id === selectedFrame;
        })        

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (this.props.isUploaderLoading) {
            return (
                <div className={selectedFrame ? frame.sku + ' uploads' : 'uploads'}>
                    <div className="uploading">
                        {this.props.uploadPercent < 99 &&
                        <p>{this.props.uploadPercent}% uploaded</p>
                        }

                        {this.props.uploadPercent === 100 &&
                        <p>Processing ... </p>
                        }
                    </div>
                    <MuuriComponent dragEnabled
                          dragFixed
                          dragSortPredicate={{
                            action: "swap"
                          }}
                          dragSortHeuristics={{
                            sortInterval: 5
                          }}>{(
                            images.map((item, key) =>
                                <Image key={item.id} currentItemId={imgId} isLoaded={isLoaded} item={item}
                                       handleShow={this.handleShow}/>
                            )
                        )}
                    </MuuriComponent>
                </div>
            );
        } else if (!isLoaded) {
            return (
                <div className={selectedFrame ? frame.sku + ' uploads' : 'uploads'}>
                    <MuuriComponent dragEnabled
                          dragFixed
                          dragSortPredicate={{
                            action: "swap"
                          }}
                          dragSortHeuristics={{
                            sortInterval: 5
                          }}>{(
                            images.map((item, key) =>
                                <Image key={item.id} currentItemId={imgId} isLoaded={isLoaded} item={item}
                                       handleShow={this.handleShow}/>
                            )
                        )}
                    </MuuriComponent>
                </div>
            );
        } else {
            return (

                <div className={selectedFrame ? frame.sku + ' uploads' : 'uploads'}>
                    
                    <MuuriComponent dragEnabled
                          dragFixed
                          dragSortPredicate={{
                            action: "swap"
                          }}
                          dragSortHeuristics={{
                            sortInterval: 5
                          }}>{(
                            images.map((item, key) =>
                                <Image key={item.id} currentItemId={imgId} isLoaded={isLoaded} item={item}
                                       handleShow={this.handleShow}/>
                            )
                        )}
                    </MuuriComponent>

                    <Modal show={uploadError} onHide={this.errorModalClose} size="lg" className="error-modal">
                        <Modal.Header>
                            <h3 className="text-center w-100"> Low Image Quality </h3>
                        </Modal.Header>
                        <Modal.Body>
                            {uploadError &&
                            errors.large &&
                            errors.large.map((item, key) =>
                                <div className="error-message text-center w-100"><p> {item} </p></div>
                            )
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="modal-actions">
                                <Button variant="secondary" onClick={this.errorModalClose}> Okay </Button>
                            </div>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={modalShow} onHide={this.handleClose} size="sm" className="img-controls">
                        <Modal.Body>
                            <div className="modal-actions">
                                <Button variant="secondary" onClick={this.openAdjustModal}> Adjust </Button>
                                <Button variant="danger" onClick={this.handleDelete}> Delete </Button>
                                <Button variant="light" onClick={this.handleClose}> Dismiss </Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={adjustModalShow} onHide={this.closeAdjustModal} size="lg" className={selectedFrame ? frame.sku + ' cropper-modal-wrap' : 'cropper-modal-wrap'}>
                        <Modal.Body>

                                <Cropper
                                    ref={this.imageElement}
                                    src={imageUrl}
                                    aspectRatio={1 / 1}
                                    cropBoxMovable={false}
                                    guides={false}
                                    background={false}
                                    scale={0}
                                    scalable={false}
                                    cropBoxResizable={false}
                                    checkCrossOrigin={true}
                                    responsive={true}
                                    viewMode={1}
                                    dragMode='move'
                                    checkOrientation={true}
                                    center={false}
                                    minCropBoxWidth={280}
                                    minCropBoxHeight={280}
                                    rotatable={true}
                                    crop={this._crop.bind(this)}
                                    zoom={this._zoom.bind(this)}
                                    autoCropArea={true}
                                    className="custom-cropper"
                                    ready={this.setCropperReadyState}
                                />
                            {!isCropperReady ?
                                <div className='cropper-loader'>
                                <Loader isLoading={!isCropperReady}/>
                                </div>
                                :
                                ''
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="text-center mb-3 btn-opp w-auto"
                                    onClick={this.saveCroppedImage}> Save </Button>
                            <Button className="text-center mb-3 btn-opp w-auto"
                                    onClick={this.closeAdjustModal}> Cancel </Button>
                        </Modal.Footer>
                    </Modal>

                </div>
            );
        }
    }
}

export default Images;