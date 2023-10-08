import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AlertMsg from "../pages/AlertMsg";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";

export default function UpdateForm() {
  const navigate = useNavigate();
  const formDefaults = {
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    about: "",
    phone: "",
  };
  const [id, setId] = useState(0);
  const [msgFlag, setMsgFlag] = useState(false);
  const [formData, setFormData] = useState(formDefaults);
  const [formError, setFormError] = useState({});
  const loadUser = async (id) => {
    try {
      const res = await UserService.getUser(id);
      if (res.status === 200) {
        console.log("data", { ...formData, ...res.data });

        setFormData({ ...formData, ...res.data });
      }
    } catch (e) {
      console.log("error", e);
    }
  };
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");
    // Not encrypting id because not part of requirement
    if (id) {
      setId(id);
      loadUser(id);
      setSuccessMsg("User updated Successfully!!");
    } else {
      setSuccessMsg("User Added Successfully!!");
    }
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.value !== "") {
      setFormError({ ...formError, [e.target.id]: "" });
    }
  };
  const handleSubmit = async () => {
    let errors = {};
    if (formData.firstName === "") {
      errors["firstName"] = "Please Enter First Name";
    }
    if (formData.lastName === "") {
      errors["lastName"] = "Please Enter Last Name";
    }
    if (formData.email === "") {
      errors["email"] = "Please Enter Email Address";
    } else if (!validateEmail(formData.email)) {
      errors["email"] = "Please Enter valid Email Address";
    }
    setFormError(errors);

    if (Object.keys(errors).length === 0) {
      setFormError({});
      try {
        let res = {};
        if (id === 0) {
          res = await UserService.postData(formData);
        } else {
          res = await UserService.updateData(formData, id);
        }
        setMsgFlag(true);

        if (!res.status === 200) {
          setSuccessMsg("Some thing went wrong");
        } else {
          navigate("/", {
            state: {
              msgFlag: true,
              successMsg: successMsg,
            },
          });
        }
      } catch (e) {
        console.log(e);
        setMsgFlag(true);

        setSuccessMsg("Some thing went wrong");
      }
    }
  };
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const [successMsg, setSuccessMsg] = useState("");
  return (
    <Container className="mt-n1">
      {msgFlag && <AlertMsg msg={successMsg} onClose={setMsgFlag} />}
      <Row className="p-2 ">
        <h1>User Record</h1>
      </Row>
      <Row className="p-2 ">
        <Col lg={3} className="mb-3">
          First Name<span className="text text-danger">*</span>
        </Col>
        <Col lg={8} className="mb-3">
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          {formError?.firstName && (
            <label className="text text-danger mx-2">
              {formError.firstName}
            </label>
          )}
        </Col>
        <Col lg={3} className="mb-3">
          Last Name<span className="text text-danger">*</span>
        </Col>
        <Col lg={8} className="mb-3">
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => {
              handleChange(e);
            }}
          />

          {formError?.lastName && (
            <label className="text text-danger mx-2">
              {formError.lastName}
            </label>
          )}
        </Col>
        <Col lg={3} className="mb-3">
          Email<span className="text text-danger">*</span>
        </Col>
        <Col lg={8} className="mb-3">
          <input
            type="text"
            value={formData.email}
            id="email"
            onChange={(e) => {
              handleChange(e);
            }}
          />

          {formError?.email && (
            <label className="text text-danger mx-2">{formError.email}</label>
          )}
        </Col>
        <Col lg={3} className="mb-3">
          Country
        </Col>
        <Col lg={8} className="mb-3">
          <input
            type="text"
            value={formData.country}
            id="country"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={3} className="mb-3">
          Phone
        </Col>
        <Col lg={8} className="mb-3">
          <input
            type="number"
            value={formData.phone}
            id="phone"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </Col>
        <Col lg={3} className="mb-3">
          About
        </Col>
        <Col lg={8} className="mb-3">
          <textarea
            type="text"
            id="about"
            cols={70}
            rows={4}
            value={formData.about}
            onChange={(e) => {
              handleChange(e);
            }}
          >
            {formData.about}
          </textarea>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          {" "}
          <Button onClick={handleSubmit}>Save </Button>
        </Col>
        <Col xs={3}>
          <Button onClick={() => navigate("/")} className="btn btn-danger">
            Cancel
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
