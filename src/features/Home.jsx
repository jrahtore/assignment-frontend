import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import UserService from "../services/UserService";
import { useLocation, useNavigate } from "react-router-dom";
import AlertMsg from "../pages/AlertMsg";

export default function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [msgFlag, setMsgFlag] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadUsers = async () => {
    try {
      const res = await UserService.getUsers();
      if (res.status === 200) {
        console.log("data", res.data);

        setUsers(res.data);
      }
    } catch (e) {
      console.log("error", e);
    }
  };
  const deleteUser = async (id) => {
    try {
      await UserService.deleteUser(id);

      setMsgFlag(true);
      setSuccessMsg("User Deleted Successfully!!");
      loadUsers();
    } catch (e) {}
  };
  useEffect(() => {
    const st = location.state;
    if (st?.msgFlag) {
      setMsgFlag(true);
      setSuccessMsg(st.successMsg);
      navigate("/", { state: {} });
      loadUsers();
    }
    console.log("state", st);
    loadUsers();
  }, []);
  return (
    <Container className="mt-n1">
      {msgFlag && <AlertMsg msg={successMsg} onClose={setMsgFlag} />}

      <Row className="p-2 ">
        <Col>
          {" "}
          <h1>Listing</h1>
        </Col>
        <Col>
          <button
            className="float-end btn btn-primary"
            onClick={() => navigate("/add")}
          >
            Add New
          </button>
        </Col>
      </Row>

      <Row>
        {users.map((res, key) => {
          return (
            <>
              <div className="card m-2" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">
                    {res.firstName} {res.lastName}
                  </h5>
                  <p className="card-text">{res.about}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Email: {res.email}</li>
                  <li className="list-group-item">Phone: {res.phone}</li>
                  <li className="list-group-item">Country: {res.country}</li>
                </ul>
                <div className="card-body">
                  <Button
                    onClick={() => navigate("/edit?id=" + res._id)}
                    className="card-link"
                  >
                    Edit
                  </Button>

                  <Button
                    className="btn btn-danger card-link"
                    onClick={() => deleteUser(res._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>
          );
        })}
      </Row>
    </Container>
  );
}
