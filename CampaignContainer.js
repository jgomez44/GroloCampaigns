import React from "react";
import { searchCampaigns } from "../../services/campaign.service.js";
import CampaignSearch from "./CampaignSearch.js";
import "../../shared/Spinner.css";
import LoggedIn from "../Redux/LoggedIn";
import { connect } from "react-redux";

class CampaignContainer extends React.Component {
  state = {
    success: false,
    error: false,

    campaigns: [],

    search: "",

    businesses: [],

    campaignId: null,

    pageIndex: 0,
    pageSize: 6,
    totalCount: 0,
    totalPages: 0,

    alwaysFalse: false,

    loading: false
  };

  componentDidMount = () => {
    this.executeQuery();
  };

  componentDidUpdate = prevProps => {
    if (prevProps.currentBusiness !== this.props.currentBusiness) {
      this.executeQuery();
      this.setState({ businessId: this.props.currentBusiness });
    }
  };

  handleRedirect = () => {
    this.props.history.push("/admin/campaigns/create/" + this.props.currentBusiness);
  };

  handleGoTo = pageIndex => {
    this.setState(
      prev => ({ pageIndex }),
      () => {
        this.executeQuery(this.state.pageIndex);
      }
    );
  };

  handleCampaignInfo = campaignId => {
    const prefix = this.props.match.path;
    this.props.history.push(prefix + "/" + campaignId);
  };

  latestCallCount = 0;

  executeQuery = (delay = 500) => {
    this.setState({ loading: true });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      const promise = searchCampaigns(
        this.state.search,
        this.state.pageIndex,
        this.state.pageSize,
        this.props.currentBusiness
      );

      const currentCallCount = ++this.latestCallCount;

      promise.then(response => {
        if (currentCallCount === this.latestCallCount) {
          const result = response.data;
          this.setState(prevState => ({
            campaigns: result.pagedItems,
            campaign: null,
            totalCount: result.totalCount,
            totalPages: Math.ceil(result.totalCount / prevState.pageSize),
            loading: false
          }));
        }
      });
      this.timeout = null;
    }, delay);
  };

  onSearchChange = e => {
    this.setState({ loading: true, search: e.target.value, pageIndex: 0 }, () => {
      this.executeQuery();
    });
  };

  goToPage = pageIndex => {
    this.setState(
      prev => ({ pageIndex }),
      () => {
        this.executeQuery(0);
      }
    );
  };

  onChangePageSize = e => {
    const value = e.target.value;
    this.setState({ [e.target.name]: parseInt(value) }, () => this.executeQuery(0));
  };

  render() {
    const { campaigns, search, pageIndex, pageSize, totalCount, totalPages } = this.state;
    return (
      <React.Fragment>
        <LoggedIn>
          <div className="row">
            <div className="col-sm-12">
              <h2 className="content-header">Campaigns</h2>
            </div>
          </div>
          <br />
          <section id="CampaignSearch">
            {!this.state.campaignId && (
              <CampaignSearch
                campaigns={campaigns}
                search={search}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={totalCount}
                totalPages={totalPages}
                onSearchChange={this.onSearchChange}
                onChangePageSize={this.onChangePageSize}
                goToPage={this.goToPage}
                handleRedirect={this.handleRedirect}
                businessId={this.props.currentBusiness}
                businessCampaigns={this.businessCampaigns}
                handleCampaignInfo={this.handleCampaignInfo}
                loading={this.state.loading}
              />
            )}
          </section>
        </LoggedIn>
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return { currentBusiness: state.currentBusiness };
}

export default connect(mapStateToProps)(CampaignContainer);
