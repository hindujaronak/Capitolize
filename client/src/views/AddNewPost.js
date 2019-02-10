import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";

const AddNewPost = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Add an Idea for a Fundraiser" subtitle="Start your fundraising journey" className="text-sm-left" />
    </Row>

    <Row>
      {/* Editor */}
      <Col lg="6" md="12">
        <Editor />
      </Col>

      {/* Sidebar Widgets */}
      <Col lg="6" md="12">
        <SidebarCategories />
      </Col>
    </Row>
  </Container>
);

export default AddNewPost;
