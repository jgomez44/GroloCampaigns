import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class AddPostModal extends React.Component {
  state = {
    modal: false
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };
  submit = () => {
    this.props.execute();
    this.toggle();
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{this.props.header}</ModalHeader>
          <ModalBody>{this.props.children}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.submit}>
              Submit
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default AddPostModal;
