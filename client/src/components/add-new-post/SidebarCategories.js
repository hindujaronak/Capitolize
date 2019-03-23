import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Button,
  InputGroup,
  InputGroupAddon,
  label,
  FormInput,
  FormCheckbox
  
} from "shards-react";


const SidebarCategories = ({ title }) => (
  <Card small className="mb-3">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>
    <CardBody className="p-0">


      <ListGroup flush>
        <ListGroupItem className="px-3 pb-2">
          <FormCheckbox className="mb-1" value="Automobile" >
            Automobile
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Aviation" >
            Aviation
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Biotechnology" >
            Biotechnology
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Chemicals" >
            Chemicals
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Construction" >
            Construction
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Defence">
            Defence
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Electronic Systems">
            Electronic Systems
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="books">
            Food Processing
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Information Technology" >
            Information Technology
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Media and Entertainment" >
            Media and Entertainment
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Oil and Gas" >
            Oil and Gas
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Pharmaceuticals" >
            Pharmaceuticals
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Ports and Shipping" >
            Ports and Shipping
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Railways" >
            Railways
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Rennewable Energy" defaultChecked>
            Rennewable Energy
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Roads and Highways" >
            Roads and Highways
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Space" >
            Space
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Textile and Garments" >
            Textile and Garments
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Tourism" >
            Tourism
          </FormCheckbox>
          <FormCheckbox className="mb-1" value="Other sectors" >
            Other sectors
          </FormCheckbox>
        </ListGroupItem>

        <ListGroupItem className="d-flex px-3">
          <InputGroup className="ml-auto">
            <FormInput placeholder="New category" />
            <InputGroupAddon type="append">
              <Button theme="white" className="px-2">
                <i className="material-icons">add</i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </ListGroupItem>
      </ListGroup>
    </CardBody>
  </Card>
);

SidebarCategories.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

SidebarCategories.defaultProps = {
  title: "Sector"
};

export default SidebarCategories;
