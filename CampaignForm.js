import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withRouter } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label, FormText, Card, FormFeedback } from "reactstrap";
import {
  getByCampaignId,
  campaignPost,
  campaignUpdate,
  campaignDelete
} from "../../services/campaign.service.js";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import CampaignDeleteModal from "./CampaignDeleteModal.js";
import LoggedIn from "../Redux/LoggedIn";
import { connect } from "react-redux";

class CampaignForm extends React.Component {
  state = {
    success: false,
    error: false,
    businesses: [],

    businessId: null,
    campaignName: "",
    startDate: null,
    endDate: null,
    description: "",
    campaignId: undefined,

    readOnly: false,

    campaignNameInvalid: false,
    startDateInvalid: false,
    endDateInvalid: false,
    descriptionInvalid: false,

    invalidInput: {
      campaignName: "",
      startDate: null,
      endDate: null,
      description: ""
    },

    modal: false,

    loading: false,
    intervalId: 0,

    switchedBusiness: undefined
  };

  componentDidMount = () => {
    const { campaignId } = this.props.match.params;

    const { businessId } = this.props.match.params;
    this.setState({ businessId });

    if (campaignId) {
      this.setState({ loading: true });
      getByCampaignId(campaignId)
        .then(response => {
          let { id, name, businessId, startDate, endDate, description } = response.data.item;
          startDate = startDate ? moment(startDate) : null;
          endDate = endDate ? moment(endDate) : null;
          this.setState({
            campaignId: id,
            campaignName: name,
            businessId,
            startDate,
            endDate,
            description,
            readOnly: true,
            loading: false
          });
        })
        .catch(error => {
          this.setState({ error: true, success: false });
        });
    }
  };

  componentDidUpdate = prevProps => {
    if (prevProps.currentBusiness !== this.props.currentBusiness) {
      for (let i = 0; i < this.props.userBusinesses.length; i++) {
        if (Number(this.props.userBusinesses[i].id) === Number(this.props.currentBusiness)) {
          this.setState({ switchedBusiness: this.props.userBusinesses[i].name });
        }
      }
      this.setState({
        businessId: this.props.currentBusiness
      });
    }
  };

  scrollStep = () => {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - 50);
  };

  scrollToTop = () => {
    let intervalId = setInterval(this.scrollStep.bind(this), 16.66);
    this.setState({ intervalId: intervalId });
  };

  handleSwitchToEdit = () => {
    this.setState({ readOnly: false });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  handleSwitchToReadOnly = () => {
    this.setState({ readOnly: true });
  };

  onChangeStartDate = startDate => {
    this.setState({ startDate });
    if (!startDate) {
      this.setState({ startDateInvalid: true });
    } else {
      this.setState({ startDateInvalid: false });
    }
  };

  onChangeEndDate = endDate => {
    this.setState({ endDate });
    if (!endDate) {
      this.setState({ endDateInvalid: true });
    } else {
      this.setState({ endDateInvalid: false });
    }
  };

  onChange = e => {
    const { name, value } = e.target;
    let invalidInput = { ...this.state.invalidInput };
    this.setState({ invalidInput, [name]: value });

    switch (name) {
      case "campaignName":
        invalidInput.campaignName =
          value.length > 1 && value.length < 1001
            ? this.setState({ campaignNameInvalid: false })
            : this.setState({ campaignNameInvalid: true });
        break;
      case "description":
        invalidInput.description =
          value.length > 1 && value.length < 4001
            ? this.setState({ descriptionInvalid: false })
            : this.setState({ descriptionInvalid: true });
        break;
      default:
        break;
    }
  };

  handleUpdate = () => {
    let startDate = moment(this.state.startDate);
    let endDate = moment(this.state.endDate);
    campaignUpdate({
      businessName: this.state.businessName,
      businessId: this.state.businessId,
      startDate,
      endDate,
      name: this.state.campaignName,
      id: this.state.campaignId,
      description: this.state.description
    })
      .then(response => {
        this.scrollToTop();
        this.setState({ error: false, success: true, readOnly: true });
        NotificationManager.success("You have updated your campaign", "Success!");
      })
      .catch(response => {
        this.scrollToTop();
        this.setState({ error: true, success: false });
        NotificationManager.error(
          "There was an error updating your campaign. Please try again.",
          "Error!"
        );
      });
  };

  onDelete = () => {
    campaignDelete(this.state.campaignId)
      .then(response => {
        this.handleCampaignsList();
      })
      .catch(error => {
        this.setState({ success: false, error: true });
      });
  };

  handleCreate = () => {
    const { businessId, campaignName, description, startDate, endDate } = this.state;

    const campaignInfo = {
      businessId,
      name: campaignName,
      description,
      startDate,
      endDate
    };

    campaignPost(campaignInfo)
      .then(response => {
        this.setState({ error: false, success: true });
        this.scrollToTop();
        this.handleCampaignsList();
        NotificationManager.success("You have successfully created your campaign.", "Success!");
      })
      .catch(response => {
        this.scrollToTop();
        NotificationManager.error(
          "There was an error creating your campaign. Please try again.",
          "Error!"
        );

        if (this.state.campaignName === "") {
          this.setState({ campaignNameInvalid: true });
        }
        if (!this.state.startDate) {
          this.setState({ startDateInvalid: true });
        }
        if (!this.state.endDate) {
          this.setState({ endDateInvalid: true });
        }
        if (this.state.description === "") {
          this.setState({ descriptionInvalid: true });
        }
        this.setState({ success: false, error: true });
      });
  };

  handleCampaignsList = () => {
    this.props.history.push("/admin/campaigns");
  };

  onChangeRaw = e => {
    e.preventDefault();
  };

  chooseButton = () => {
    if (this.state.campaignId) {
      if (this.state.readOnly) {
        return (
          <div>
            <a onClick={this.handleSwitchToEdit}>
              <i className="fa fa-pencil-square-o warning fa-2x" aria-hidden="true" />
            </a>
          </div>
        );
      } else {
        return (
          <div className="row " style={{ display: "flex", alignContent: "stretch" }}>
            <div style={{ flexGrow: "1" }}>
              <Button className="btn btn-danger" onClick={this.toggle} type="button">
                <i className="fa fa-trash" aria-hidden="true" /> &nbsp; Delete
              </Button>
            </div>
            <div style={{ flexGrow: "1", display: "flex", justifyContent: "flex-end" }}>
              <Button type="button" className="btn btn-success mr-2" onClick={this.handleUpdate}>
                <i className="fa fa-thumbs-o-up" aria-hidden="true" /> &nbsp; Submit
              </Button>
              <Button
                type="button"
                className="btn btn-primary mr-1"
                onClick={this.handleSwitchToReadOnly}
                disabled={
                  this.state.campaignNameInvalid ||
                  this.state.startDateInvalid ||
                  this.state.endDateInvalid ||
                  this.state.descriptionInvalid
                    ? true
                    : false
                }
              >
                <i className="fa fa-times-circle" aria-hidden="true" /> &nbsp; Cancel
              </Button>
            </div>
            <CampaignDeleteModal
              modal={this.state.modal}
              toggle={this.toggle}
              header="Are you sure you want to delete this campaign?"
              execute={this.onDelete}
            >
              Deleting your "{this.state.campaignName}" campaigns will inactivate any scheduled
              posts associated with it. These posts can still be accessed from the post page.
            </CampaignDeleteModal>
          </div>
        );
      }
    } else {
      return (
        <div>
          <Button
            type="button"
            className="btn btn-success submitMoreInfo"
            onClick={this.handleCreate}
          >
            <i className="fa fa-thumbs-o-up" aria-hidden="true" /> &nbsp; Create
          </Button>
          <Button type="button" className="btn cancelMoreInfo" onClick={this.handleCampaignsList}>
            <i className="fa fa-times-circle" aria-hidden="true" /> &nbsp; Cancel
          </Button>
          <br />
          <br />
        </div>
      );
    }
  };

  render() {
    const { campaignName, description, startDate, endDate } = this.state;

    let ButtonScreen = this.chooseButton();

    const { campaignId } = this.props.match.params;

    return (
      <LoggedIn>
        <Card>
          <br />
          {campaignId ? (
            <div style={{ display: "flex" }}>
              <button
                type="button"
                className="btn btn-primary campaignsListBtn"
                onClick={this.handleCampaignsList}
              >
                Campaigns List
              </button>
            </div>
          ) : null}
          <br />
          <br />
          {this.state.switchedBusiness && !this.state.campaignId ? (
            <p style={{ color: "red" }} className="text-center">
              You have switched businesses. The campaign you create will now be a part of{" "}
              {this.state.switchedBusiness}.
            </p>
          ) : this.state.switchedBusiness ? (
            <p style={{ color: "red" }} className="text-center">
              You have switched businesses. If you update this campaign, it will be a part of{" "}
              {this.state.switchedBusiness}.
            </p>
          ) : null}
          {campaignId ? (
            <h2 className="text-center content-header ">{campaignName}</h2>
          ) : (
            <h2 className="text-center content-header ">Create New Campaign</h2>
          )}
          {this.state.loading ? (
            <div className="_miSpinnerS" />
          ) : (
            <Form className="containerPadding">
              <div className="content-body">
                <FormGroup>
                  <Label htmlFor="name">Campaign Name:</Label>
                  <Input
                    maxLength="1000"
                    minLength="1"
                    type="text"
                    name="campaignName"
                    value={campaignName}
                    onChange={this.onChange}
                    required
                    readOnly={this.state.readOnly}
                    className="form-control is-valid"
                    invalid={this.state.campaignNameInvalid}
                  />
                  <FormFeedback>
                    Campaign Name is required and must be under 1000 characters
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="startDate">Start Date:</Label>
                  <DatePicker
                    onChangeRaw={this.onChangeRaw}
                    minDate={moment()}
                    name="startDate"
                    readOnly={this.state.readOnly}
                    selected={startDate}
                    onChange={this.onChangeStartDate}
                    required
                    className={
                      this.state.startDateInvalid
                        ? "form-control is-invalid campaignFormDatePicker"
                        : "form-control is-valid campaignFormDatePicker"
                    }
                  />
                  {this.state.startDateInvalid ? (
                    <FormText className="red">Start Date is required</FormText>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label>End Date:</Label>
                  <DatePicker
                    minDate={moment()}
                    onChangeRaw={this.onChangeRaw}
                    name="endDate"
                    readOnly={this.state.readOnly}
                    selected={endDate}
                    onChange={this.onChangeEndDate}
                    required
                    className={
                      this.state.endDateInvalid
                        ? "form-control is-invalid"
                        : "form-control is-valid"
                    }
                  />
                  {this.state.endDateInvalid ? (
                    <FormText className="red">End Date is required</FormText>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label>Description:</Label>
                  <Input
                    type="textarea"
                    readOnly={this.state.readOnly}
                    name="description"
                    value={description}
                    onChange={this.onChange}
                    className="form-control is-valid"
                    minLength="1"
                    maxLength="4000"
                    invalid={this.state.descriptionInvalid}
                  />
                  <FormFeedback>
                    Description is required and must be less than 4000 characters
                  </FormFeedback>
                </FormGroup>
                {ButtonScreen}
                <br />
                {this.props.children}
              </div>
            </Form>
          )}
        </Card>
      </LoggedIn>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentBusiness: state.currentBusiness,
    currentBusinessName: state.user.customerBusinessName,
    userBusinesses: state.user.businesses
  };
}

export default withRouter(connect(mapStateToProps)(CampaignForm));
