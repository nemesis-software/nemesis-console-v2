import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap';

class NotificationModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            errorMsg: null
        };
    }

    render() {
        return (
            <>
                {this.props.notification ?
                    <Modal centered backdrop="static" size="lg" show={this.props.show} onHide={this.props.handleNotificationModalClose} animation={false}>
                      <Modal.Header closeButton>
                        <Modal.Title>Notification Details</Modal.Title>
                      </Modal.Header>

                      <Modal.Body>
                        <p>Status:{this.props.notification.status}</p>
                        <p>Message:{this.props.notification.message}</p>
                        <p>Description:{this.props.notification.description}</p>
                        <p>Details:{this.props.notification.detailedMessage}</p>
                      </Modal.Body>
                    </Modal>
                :null}
            </>
        )
    }
}

export default withRouter(NotificationModal);
