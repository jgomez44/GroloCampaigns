import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class CampaignDeleteModal extends React.Component {
  state = {
    modal: false
  };

  confirm = () => {
    this.props.execute();
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}> &nbsp; {this.props.header}</ModalHeader>
          <ModalBody>{this.props.children}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.confirm}>
              Confirm
            </Button>
            <Button color="secondary" onClick={this.props.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CampaignDeleteModal;
