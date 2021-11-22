import React, { Component } from 'react';
import Loader from '../blocks/Loader.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

class Image extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoading: true,
            src: '',
            item: []
        }

        this.imageLoaded = this.imageLoaded.bind(this);
        
    }

    imageLoaded() {
        this.setState({isLoading: false});
    }

    render() {
        
        const { isLoading } = this.state;
        const { item, handleShow, currentItemId, isLoaded, classNames } = this.props;

        if (isLoading || (currentItemId === item.id && !isLoaded) ) {
            return ( 
                <div key={item.id} className={'loading single-image-item single-image-item-' + item.id} onClick={() => handleShow(item.id, item.large)}>
                    <Loader isLoading={true} />
                    <div className="frame"> </div>
                    <img src={item.small} className='d-none upload-picture' onLoad={this.imageLoaded} alt={item.id} />
                </div>
            );
        } else {
            return (
                <div
                    key={item.id} 
                    className={'single-image-item single-image-item-' + item.id + ' ' + classNames} 
                >
                    <div className="frame"> </div>
                    <img src={item.small} className='upload-picture' onLoad={this.imageLoaded} alt={item.uuid} />
                    <div className="frame-controls" onClick={() => handleShow(item.id, item.large)}><FontAwesomeIcon icon={faEdit} color='#fff' /></div>
                </div>  
            );
        }
    }
}

export default Image; // Don’t forget to use export default!