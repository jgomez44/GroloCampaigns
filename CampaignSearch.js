import React from "react";
import { Button, Input, Label } from "reactstrap";
import PropTypes from "prop-types";

import CampaignList from "./CampaignList";
import Paginator from "../../shared/Paginator";

import { withRouter } from "react-router-dom";

import "./Campaign.scss";

function CampaignSearch(props) {
  return (
    <React.Fragment>
      <section id="CampaignAdmin">
        {props.businessId && (
          <div>
            {!props.campaign && (
              <div className="row">
                <div className="col-md-12">
                  <div style={{ border: "1px solid lightgray", borderRadius: "0.25em" }}>
                    <div className="px-3 py-3">
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <Input
                            value={props.search}
                            onChange={e => props.onSearchChange(e)}
                            placeholder="Search"
                          />
                        </div>

                        <div
                          style={{ flexGrow: "1", display: "flex", justifyContent: "flex-end" }}
                          className="ml-3 mr-3"
                        >
                          <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={e => props.handleRedirect()}
                          >
                            Add Campaign
                          </Button>
                        </div>
                      </div>
                      {props.loading ? (
                        <div className="_miSpinnerS" />
                      ) : (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                          className="mt-2 mb-2"
                        >
                          <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <Paginator
                              currentPage={props.pageIndex}
                              totalPages={props.totalPages}
                              goTo={props.goToPage}
                              style={{ marginTop: "16px" }}
                              className="m-2"
                            />
                          </div>
                          <div className="resultCardContainer">
                            {props.campaigns && (
                              <CampaignList
                                campaigns={props.campaigns}
                                handleCampaignInfo={props.handleCampaignInfo}
                              />
                            )}
                          </div>
                          {!!props.totalCount && (
                            <div
                              style={{ display: "flex", justifyContent: "space-between" }}
                              className="mt-2 mb-2"
                            >
                              <Paginator
                                currentPage={props.pageIndex}
                                totalPages={props.totalPages}
                                goTo={props.goToPage}
                              />
                              <div>
                                <Label>Items per page:&nbsp;</Label>
                                <select
                                  value={props.pageSize}
                                  onChange={props.onChangePageSize}
                                  name="pageSize"
                                  style={{ margin: "0" }}
                                >
                                  <option value="6">6</option>
                                  <option value="12">12</option>
                                  <option value="18">18</option>
                                  <option value="24">24</option>
                                  <option value="36">36</option>
                                  <option value="48">48</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </React.Fragment>
  );
}

CampaignSearch.propTypes = {
  campaigns: PropTypes.array,
  search: PropTypes.string,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  totalPages: PropTypes.number,
  onhandleRedirect: PropTypes.func,
  onChangePageSize: PropTypes.func,
  onSearchChange: PropTypes.func,
  businessCampaigns: PropTypes.func
};

export default withRouter(CampaignSearch);
