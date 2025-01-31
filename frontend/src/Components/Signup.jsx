import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  Alert
} from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../env_setup";

function Signup(props) {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    // storing city_id in city
    city: null,
    email: "",
    password: "",
    rePassword: "",
    cityList: [],
    errors: {},
    showAlert: false
  })

  const navigate = useNavigate()

  useEffect(() => {
    let fetchData = async () => {
      let city_response = await axios.get(BASE_URL + "cities")
      setState({ ...state, cityList: city_response.data })
    }
    fetchData();
  }, [])

  let onChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  };

  let isValid = () => {
    let errors = {}
    const email_pattern = /\S+@\S+/
    if (!state.firstName) errors['firstName'] = 'Required'
    if (!state.lastName) errors['lastName'] = 'Required'
    if (!state.phone) errors['phone'] = 'Required'
    if (!state.city) errors['city'] = 'Required'
    if (!state.email) {
      errors['email'] = 'Required'
    }
    else if (!email_pattern.test(String(state.email).toLowerCase())) {
      errors['email'] = 'Provide a valid email address'
    }
    if (!state.password) {
      errors['password'] = 'Required'
    }
    else if (state.password.length < 8) {
      errors['password'] = 'Atleast 8 characters'
    }
    if (!state.rePassword) {
      errors['rePassword'] = 'Required'
    }
    else if (state.password !== state.rePassword) {
      errors['rePassword'] = 'Must match the above password'
    }
    setState({ ...state, errors })
    if (Object.keys(errors).length === 0) return true;
    else return false;
  }

  let redirect = status => {
    setTimeout(() => {
      if (status == 200)
        navigate('/login')
      else
        // navigate('/signup')
        setState({ ...state, showAlert: 0 })
    }, 3000);
  }

  let onSignupClick = async () => {
    if (!isValid()) return
    const userData = {
      first_name: state.firstName,
      last_name: state.lastName,
      phone: state.phone,
      city_id: parseInt(state.city),
      email: state.email,
      password: state.password
    };
    let data, status;
    try {
      let res = await axios.post(BASE_URL + "customerSignUp", userData)
      data = res.data
      status = res.status
    } catch (error) {
      data = error.response.data
      status = error.response.status
    }
    // console.log(data, status)
    redirect(status)
    let showAlert = (status == 200) ? 1 : 2
    setState({ ...state, showAlert })
  };

  return (
    <Container className="center">

      {(state.showAlert > 0) && <Alert variant={(state.showAlert == 1) ? "success" : "danger"}>
        <Alert.Heading>{(state.showAlert == 1) ? "Successful" : "Error"}</Alert.Heading>
        <p>
          {(state.showAlert == 1) ?
            "You have successfully signed up for Handyconnect. You are being redirected to Login Page" :
            "Email or Phone number already used to signup for Handy Connect"
          }
        </p>
      </Alert>}

      <Row className="">
        <Col md="4" className="mx-auto ">
          <h1 className="login-signup-heading">Sign up</h1>
          <Form noValidate >
            <FormGroup controlId="firstNameId" className="mb-2">
              <FormControl
                className="mb-2"
                type="text"
                name="firstName"
                placeholder="Enter First Name"
                value={state.firstName}
                onChange={onChange}
                isInvalid={state.errors.firstName}
              />
              <FormControl.Feedback type="invalid">
                {state.errors.firstName}
              </FormControl.Feedback>
            </FormGroup>

            <FormGroup controlId="lastNameId" className="mb-2">
              <FormControl
                className="mb-2"
                type="text"
                name="lastName"
                placeholder="Enter Last Name"
                value={state.lastName}
                onChange={onChange}
                isInvalid={state.errors.lastName}
              />
              <FormControl.Feedback type="invalid">
                {state.errors.lastName}
              </FormControl.Feedback>
            </FormGroup>

            <FormGroup controlId="phoneId" className="mb-2">
              <FormControl
                className="mb-2"
                type="text"
                name="phone"
                placeholder="Enter Phone Number"
                value={state.phone}
                onChange={onChange}
                isInvalid={state.errors.phone}
              />
              <FormControl.Feedback type="invalid">
                {state.errors.phone}
              </FormControl.Feedback>
            </FormGroup>

            <FormGroup controlId="cityId">
              <Form.Select className="mb-2"
                onChange={(e) => {
                  setState({ ...state, city: e.target.value })
                }}
                isInvalid={state.errors.city}
              >
                <option value={null}>Select homecity</option>
                {state.cityList.map(city => (
                  <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                )
                )}
              </Form.Select>
              <FormControl.Feedback type="invalid">
                {state.errors.city}
              </FormControl.Feedback>
            </FormGroup>

            <FormGroup controlId="emailId" className="mb-2">
              <FormControl
                className="mb-2"
                type="text"
                name="email"
                placeholder="Enter email address"
                value={state.email}
                onChange={onChange}
                isInvalid={state.errors.email}
              />
              <FormControl.Feedback type="invalid">
                {state.errors.email}
              </FormControl.Feedback>
            </FormGroup>

            <FormGroup controlId="passwordId" className="mb-2">
              <FormControl
                className="mb-2"
                type="password"
                name="password"
                placeholder="Enter password"
                value={state.password}
                onChange={onChange}
                isInvalid={state.errors.password}
              />

              <FormControl.Feedback type="invalid">
                {state.errors.password}
              </FormControl.Feedback>
            </FormGroup>

            <FormGroup controlId="rePasswordId" className="mb-2">
              <FormControl
                className="mb-2"
                type="password"
                name="rePassword"
                placeholder="Re-enter password"
                value={state.rePassword}
                onChange={onChange}
                isInvalid={state.errors.rePassword}
              />
              <FormControl.Feedback type="invalid">
                {state.errors.rePassword}
              </FormControl.Feedback>
            </FormGroup>

          </Form>
          <Button
            id="signup-button"
            className="mt-3 w-100 btn btn-lg btn" variant="outline-primary"
            color="primary"
            onClick={onSignupClick}
          >Sign up</Button>
          <p className="mt-2">
            Already have account? <Link to="/login">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;