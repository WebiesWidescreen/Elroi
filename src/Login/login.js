import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { userLoginStart, userLoginReset } from "../redux/login/login.actions";
import { selectUserLoginResp } from "../redux/login/login.selector";
import Logo from "../assets/rentifyLogo.png";
import ElroiLogo from "../assets/Images/ElroiLogo.png";
import "./login.css";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const userLoginResp = useSelector(selectUserLoginResp);
  const navigate = useNavigate();
  const refFirstNameInput = useRef(null);
  const refLastNameInput = useRef(null);
  const refEmailInput = useRef(null);
  const refPhonenumberInput = useRef(null);
  const [isSpinner, setIsSpinner] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [show, setShow] = useState(false);
  const [loginCrenditals, setLoginCrendital] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    errMsg: "",
  });

  const { firstName, lastName, email, phoneNumber, errMsg } = loginCrenditals;

  useEffect(() => {
    if (userLoginResp !== null) {
      if (userLoginResp.statusCode == "01") {
        alert("User Created Successfully!");
        setLoginCrendital({
          ...loginCrenditals,
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          errMsg: "",
        });
        navigate("/dashboard");
      } else if (userLoginResp.statusCode == "02") {
        alert("User Alredy Exist!");
        setLoginCrendital({
          ...loginCrenditals,
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          errMsg: "",
        });
        navigate("/dashboard");
      }
      //   dispatch(userLoginReset());
      setIsSpinner(false);
    }
  }, [userLoginResp]);

  const handleClose = () => setAlertShow(false);

  const onLogin = () => {
    if (firstName == "") {
      setAlertShow(true);
      setLoginCrendital({
        ...loginCrenditals,
        errMsg: "Please fill the firstName!",
      });
      refFirstNameInput?.current?.focus();
    } else if (lastName == "") {
      setAlertShow(true);
      setLoginCrendital({
        ...loginCrenditals,
        errMsg: "Please fill the lastName!",
      });
      refFirstNameInput?.current?.focus();
      refLastNameInput?.current?.focus();
    } else if (email == "") {
      setAlertShow(true);
      setLoginCrendital({
        ...loginCrenditals,
        errMsg: "Please fill the email!",
      });
      refEmailInput?.current?.focus();
    } else if (!email.includes("@")) {
      setAlertShow(true);
      setLoginCrendital({
        ...loginCrenditals,
        errMsg: "Please enter a valid @email!",
      });
      refEmailInput?.current?.focus();
    } else if (phoneNumber == "") {
      setAlertShow(true);
      setLoginCrendital({
        ...loginCrenditals,
        errMsg: "Please fill the phoneNumber!",
      });
      refPhonenumberInput?.current?.focus();
    } else if (phoneNumber.length < 10 || phoneNumber.length > 10) {
      setAlertShow(true);
      setLoginCrendital({
        ...loginCrenditals,
        errMsg: "Please enter a valid mobile number!",
      });
      refPhonenumberInput?.current?.focus();
    } else {
      dispatch(userLoginStart(loginCrenditals));
      setIsSpinner(true);
    }
  };

  const convertToPdf = async () => {
    const element = document.getElementById("orderForm");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    // Increase scale for better resolution
    const scale = 2;
    let canvas = await html2canvas(element, { scale: scale });
    let imgData = canvas.toDataURL("image/png");
    let imgWidth = contentWidth;
    let imgHeight = (canvas.height * imgWidth) / (canvas.width / scale);
    let heightLeft = imgHeight;

    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight / scale);
    heightLeft -= contentHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin + position,
        imgWidth,
        imgHeight / scale
      );
      heightLeft -= contentHeight;
    }

    pdf.deletePage(3);

    pdf.save("download.pdf");
  };

  return (
    <div>
      <div className="container3">
        <Card className="text-center cardSha">
          <Card.Header>
            <img src={Logo} height="50" className="rounded" alt="logo" />
          </Card.Header>
          <Card.Body>
            <FloatingLabel
              controlId="floatingInput"
              label="First Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                ref={refFirstNameInput}
                placeholder="name@example.com"
                onChange={(e) =>
                  setLoginCrendital({
                    ...loginCrenditals,
                    firstName: e.target.value,
                  })
                }
                value={firstName}
              />
            </FloatingLabel>
            <br />
            <FloatingLabel
              controlId="floatingInput"
              label="Last Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                ref={refLastNameInput}
                placeholder="name@example.com"
                onChange={(e) =>
                  setLoginCrendital({
                    ...loginCrenditals,
                    lastName: e.target.value,
                  })
                }
                value={lastName}
              />
            </FloatingLabel>
            <br />
            <FloatingLabel
              controlId="floatingInput"
              label="Email"
              className="mb-3"
            >
              <Form.Control
                type="text"
                ref={refEmailInput}
                placeholder="name@example.com"
                onChange={(e) =>
                  setLoginCrendital({
                    ...loginCrenditals,
                    email: e.target.value,
                  })
                }
                value={email}
              />
            </FloatingLabel>
            <br />
            <FloatingLabel
              controlId="floatingInput"
              label="Phone number"
              className="mb-3"
            >
              <Form.Control
                type="tel"
                ref={refPhonenumberInput}
                maxLength="10"
                placeholder="name@example.com"
                onChange={(e) =>
                  setLoginCrendital({
                    ...loginCrenditals,
                    phoneNumber: e.target.value.replace(/\D/g, ""),
                  })
                }
                value={phoneNumber}
              />
            </FloatingLabel>
            <br />
            {isSpinner ? (
              <Button variant="danger" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </Button>
            ) : (
              <Button variant="danger" onClick={() => onLogin()}>
                Login
              </Button>
            )}
          </Card.Body>
        </Card>
      </div>
      <h1>Convert HTML to PDF</h1>
      <div id="orderForm">
        <table>
          <tbody>
            <tr>
              <td>
                <img src={ElroiLogo} height={150} />
              </td>
              <td>
                <p style={{ color: "#fff" }}>.........</p>
              </td>
              <td>
                <h1 className="logoSty">
                  <b>ELROI WEDDING CARDS</b>
                </h1>
              </td>
            </tr>
            <tr>
              <td />
              <td />
              <td>
                <h5 className="logoHeadTxt">
                  <b>ORDER FORM</b>
                </h5>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        {/* Main Content */}
        <div>
          <table>
            <tbody style={{ fontSize: "13px" }}>
              <tr>
                <td>
                  Order No. : <b>EWC- </b>
                  <span
                    style={{
                      borderBottom: "2px solid #000",
                      borderBottomStyle: "dotted",
                      whiteSpace: "pre",
                    }}
                  >
                    <b>{"                                                 "}</b>
                  </span>
                </td>
                <td>
                  <b>SL. No.:</b>
                </td>
              </tr>
              <br />
              <tr>
                <td>
                  <p>
                    Customer Name :{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #000",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>
                        {
                          "                                                                                                                   "
                        }
                      </b>
                    </span>
                    <span style={{ color: "#fff" }}>......</span>
                  </p>
                </td>
                <td>
                  <p>
                    Date :{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #000",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>{"                                              "}</b>
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Contact Details :{"  "}
                    <span
                      style={{
                        borderBottom: "2px solid #000",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>
                        {
                          "                                                                                                                     "
                        }
                      </b>
                    </span>
                    <span style={{ color: "#fff" }}>......</span>
                  </p>
                </td>
                <td>
                  <p>
                    Card Code :{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #000",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>{"                                    "}</b>
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Couple Names :{"  "}
                    <span
                      style={{
                        borderBottom: "2px solid #000",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>
                        {
                          "                                                                                                                      "
                        }
                      </b>
                    </span>
                    <span style={{ color: "#fff" }}>......</span>
                  </p>
                </td>
                <td>
                  <p>
                    Qty<b>.</b> :{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #000",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>{"                                               "}</b>
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Card Price :{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #000",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>
                        {"                                                "}
                      </b>
                    </span>
                    <span style={{ color: "#fff" }}>.....</span>
                    Total Amount :{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #000",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>
                        {"                                                "}
                      </b>
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Payment Mode : <span style={{ color: "#fff" }}>..</span>
                    <span>
                      {" "}
                      <span style={{ fontSize: "19px" }}>☐</span> Cash{" "}
                      <span style={{ color: "#fff" }}>.....</span>
                      <span style={{ fontSize: "19px" }}>☐</span> Card{" "}
                      <span style={{ color: "#fff" }}>.....</span>
                      <span style={{ fontSize: "19px" }}>☐</span> UPI{" "}
                      <span style={{ color: "#fff" }}>.....</span>
                      <span style={{ fontSize: "19px" }}>☐</span> Account
                      Transfer
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: "13px" }}>
            Advance:{" "}
            <span
              style={{
                borderBottom: "2px solid #000",
                borderBottomStyle: "dotted",
                whiteSpace: "pre",
              }}
            >
              <b>{"                                                  "}</b>
            </span>{" "}
            Balance:{" "}
            <span
              style={{
                borderBottom: "2px solid #000",
                borderBottomStyle: "dotted",
                whiteSpace: "pre",
              }}
            >
              <b>{"                                                    "}</b>
            </span>{" "}
            Delivery Date:{" "}
            <span
              style={{
                borderBottom: "2px solid #000",
                borderBottomStyle: "dotted",
                whiteSpace: "pre",
              }}
            >
              <b>{"                                                "}</b>
            </span>
          </p>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              border: "1px solid #000",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", padding: "25px" }}>
                  <div className="tblHeadSty">Card</div>
                </th>
                <th style={{ border: "1px solid #000" }}>
                  <div className="tblHead2Sty">TOTAL</div>
                </th>
              </tr>
              <tr>
                <th style={{ border: "1px solid #000", padding: "25px" }}>
                  <div className="tblHeadSty">Printing</div>
                </th>
                <th style={{ border: "1px solid #000" }}>
                  <div className="tblHead2Sty">TOTAL</div>
                </th>
              </tr>
              <tr>
                <th style={{ border: "1px solid #000", padding: "25px" }}>
                  <div className="tblHeadSty">Discount</div>
                </th>
                <th style={{ border: "1px solid #000" }}>
                  <div className="tblHead2Sty">TOTAL</div>
                </th>
              </tr>
            </thead>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            <p>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                      "}</b>
              </span>
              <br />
              <br />
              Customer Sign.
            </p>
            <p>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                      "}</b>
              </span>
              <br />
              <br />
              Salesman Sign.
            </p>
          </div>
        </div>
        {/* Main Content */}

        {/* PRINTING Content */}
        <div>
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            <span style={{ borderBottom: "2px solid #000" }}>
              <b>PRINTING DETAILS</b>
            </span>
          </p>

          <div style={{ fontSize: "13px" }}>
            <p>
              Card <span style={{ color: "#fff" }}>..................</span>
              <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
              <span style={{ color: "#fff" }}>.....</span>
              <span style={{ fontSize: "20px" }}>☐</span> No
              <span style={{ color: "#fff" }}>.....</span>
              Printing Colours{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                        "}
                </b>
              </span>{" "}
              Others{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                                     "}</b>
              </span>
            </p>
            <p>
              Insert 1 <span style={{ color: "#fff" }}>.............</span>{" "}
              <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
              <span style={{ color: "#fff" }}>.....</span>
              <span style={{ fontSize: "20px" }}>☐</span> No
              <span style={{ color: "#fff" }}>.....</span>
              Printing Colours{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                        "}
                </b>
              </span>
              Others{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                      "}
                </b>
              </span>
            </p>
            <p>
              Insert 2 <span style={{ color: "#fff" }}>.............</span>{" "}
              <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
              <span style={{ color: "#fff" }}>.....</span>
              <span style={{ fontSize: "20px" }}>☐</span> No
              <span style={{ color: "#fff" }}>.....</span>
              Printing Colours{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                        "}
                </b>
              </span>
              Others{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                      "}
                </b>
              </span>
            </p>
            <p>
              Insert 3 <span style={{ color: "#fff" }}>.............</span>{" "}
              <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
              <span style={{ color: "#fff" }}>.....</span>
              <span style={{ fontSize: "20px" }}>☐</span> No
              <span style={{ color: "#fff" }}>.....</span>
              Printing Colours{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                        "}
                </b>
              </span>
              Others{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                      "}
                </b>
              </span>
            </p>
            <p>
              Insert Material Colour 1.{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                                  "}</b>
              </span>{" "}
              2.{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                                    "}</b>
              </span>{" "}
              3.{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                         "}
                </b>
              </span>
            </p>
            <p>
              Insert Sheet <span style={{ color: "#fff" }}>.....</span>{" "}
              <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
              <span style={{ color: "#fff" }}>.....</span>
              <span style={{ fontSize: "20px" }}>☐</span> No
              <span style={{ color: "#fff" }}>.....</span>
              Printing Colours{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                       "}
                </b>
              </span>
              Others{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                       "}
                </b>
              </span>
            </p>
            <p>
              Envelope <span style={{ color: "#fff" }}>.........</span>{" "}
              <span style={{ fontSize: "20px" }}>☐</span> Box{" "}
              <span style={{ color: "#fff" }}>.....</span>
              <span style={{ fontSize: "20px" }}>☐</span> Plain
              <span style={{ color: "#fff" }}>..</span>
              Printing Colours{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                       "}
                </b>
              </span>
              Others{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                       "}
                </b>
              </span>
            </p>
            <p>
              Extra Works <span style={{ color: "#fff" }}>.....</span>{" "}
              <span style={{ fontSize: "20px" }}>☐</span> Name Plate{" "}
              <span style={{ color: "#fff" }}>.....................</span>
              <span style={{ fontSize: "20px" }}>☐</span> Ribbon
              <span style={{ color: "#fff" }}>.....................</span>
              <span style={{ fontSize: "20px" }}>☐</span> E.P.
              <span style={{ color: "#fff" }}>..................</span>
              Others{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                       "}
                </b>
              </span>
            </p>
            <p>
              Important Note :{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                                                                                                                                     "
                  }
                </b>
              </span>
            </p>
            <p>
              Print Ink <span style={{ color: "#fff" }}>............</span>
              <span style={{ fontSize: "20px" }}>☐</span> PVC{" "}
              <span style={{ color: "#fff" }}>.....................</span>
              <span style={{ fontSize: "20px" }}>☐</span> PVC Glossy
              <span style={{ color: "#fff" }}>.....................</span>
              <span style={{ fontSize: "20px" }}>☐</span> Glossy
              <span style={{ color: "#fff" }}>..................</span>
              Others{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                       "}
                </b>
              </span>
            </p>
          </div>
        </div>
        {/* PRINTING Content */}

        {/* CONTENT Details */}
        <div style={{ marginTop: "12%" }}>
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            <span style={{ borderBottom: "2px solid #000" }}>
              <b>CONTENT DETAILS</b>
            </span>
          </p>

          <div style={{ fontSize: "13px" }}>
            <p>
              Fonts :{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                                                                                  "
                  }
                </b>
              </span>
              Others :{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                                    "}</b>
              </span>
            </p>
            <p>
              Card Logo <span style={{ color: "#fff" }}>............</span>
              <span style={{ fontSize: "20px" }}>☐</span>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                 "
                  }
                </b>
              </span>
              <span style={{ color: "#fff" }}>.......</span>
              Cover Logo <span style={{ color: "#fff" }}>............</span>
              <span style={{ fontSize: "20px" }}>☐</span>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                "
                  }
                </b>
              </span>
            </p>
            <p>
              Insert (1) Logo <span style={{ fontSize: "20px" }}>☐</span>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                         "}</b>
              </span>
              {"  "}
              Insert (2) Logo <span style={{ fontSize: "20px" }}>☐</span>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                      "}</b>
              </span>
              {"  "}
              Insert (3) Logo <span style={{ fontSize: "20px" }}>☐</span>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>{"                                      "}</b>
              </span>
            </p>
            <p>
              Insert Sheet Logo <span style={{ color: "#fff" }}>....</span>
              <span style={{ fontSize: "20px" }}>☐</span>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                                                   "
                  }
                </b>
              </span>
              {"  "}
              Others :{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {"                                                        "}
                </b>
              </span>
            </p>
            <p>
              1st Page Logo <span style={{ fontSize: "20px" }}>☐</span>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                       "
                  }
                </b>
              </span>
              <span style={{ color: "#fff" }}>........</span>
              2nd Page Logo :{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                        "
                  }
                </b>
              </span>
            </p>
            <p>
              3rd Page Logo <span style={{ fontSize: "20px" }}>☐</span>
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                       "
                  }
                </b>
              </span>
              <span style={{ color: "#fff" }}>........</span>
              4th Page Logo :{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                        "
                  }
                </b>
              </span>
            </p>
            <p>
              Important Notes :{" "}
              <span
                style={{
                  borderBottom: "2px solid #000",
                  borderBottomStyle: "dotted",
                  whiteSpace: "pre",
                }}
              >
                <b>
                  {
                    "                                                                                                                                                                                    "
                  }
                </b>
              </span>
            </p>
          </div>
        </div>
        {/* CONTENT Details */}

        {/* Terms Details */}
        <div>
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            <b>TERMS & CONDITIONS</b>
          </p>

          <table>
            <tbody style={{ fontSize: "14px", lineHeight: "1.5" }}>
              <tr>
                <td>
                  <p>1.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Order Booking Once Ordered, No Cancellation No Exchange (As
                  soon as order is booked the production process will start
                  immediately). Elroi Wedding Cards will not refund any amount
                  on cancellation of orders in such cases.
                </td>
              </tr>
              <tr>
                <td>
                  <p>2.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Proof Reading Customers are requested to check the proof
                  thoroughly and approve it at the specified time. If not, the
                  delivery date will be postponed.
                </td>
              </tr>
              <tr>
                <td>
                  <p>3.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Delivery Schedule Our aim is to deliver the goods on time.
                  Sometime it may also change due to disturbances of nature.
                </td>
              </tr>
              <tr>
                <td>4.</td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Printing Matters Please give us correct and complete matter at
                  the first instance.
                </td>
              </tr>
              <tr>
                <td>
                  <p>5.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Materials Though we try to achieve perfect color match to the
                  sample, there will be unavoidable variation in shades
                  (especially Ivory, Gold, Silver & Red) & weight of the
                  Paper/Board from the Mill Handmade unit.
                </td>
              </tr>
              <tr>
                <td>
                  <p>6.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Printing Colours We take utmost care in executing your valued
                  orders. There will be slight variation in printing colours
                  which is due to various raw material inputs.
                </td>
              </tr>
              <tr>
                <td>
                  <p>7.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Material Wastage In the process of printing there is likely a
                  wastage of 2% to 3% will occur which cannot be avoided. It is
                  globally accepted.
                </td>
              </tr>
              <tr>
                <td>8.</td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Complaints Please inform us if any complaint within 24 hours
                  of your delivery.
                </td>
              </tr>
              <tr>
                <td>
                  <p>9.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Kind Attention Al boards (Metallic, Handmade, Imported Boards
                  & Papers) will tend to unavoidable variations such avicolors,
                  shades, thickness, stiffness and bulkness due to various raw
                  material input while manufacturing, So, Kindly bear with us
                  for the inconvenience.
                </td>
              </tr>
              <tr>
                <td>10.</td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>Rates of the wedding cards mentioned are per piece.</td>
              </tr>
              <tr>
                <td>
                  <p>11.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  All wedding card rates include 1 wedding card and 2 inserts &
                  1 Envelope. Any extra insert will have to be bought at any
                  additional cost. If there are more inserts shown in the
                  photograph, it is for the colour options from which a customer
                  can choose any 2 or 3 colours according to their Functions.
                </td>
              </tr>
              <tr>
                <td>
                  <p>12.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  Minimum order quantity of any wedding card design is 100
                  pieces, Further, quantities should be in multiple of 50, So,
                  you can order 100, 150, 200, 250 and so on Printing costs are
                  extra as applicable.
                </td>
              </tr>
              <tr>
                <td>
                  <p>13.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  For making a customized card, minimum quantity should be 50
                  pieces. Quotation for the same will be provided via email
                  based on your requirements.
                </td>
              </tr>
              <tr>
                <td>
                  <p>14.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  As to maintain originality, there will be pressline of ELROI
                  WEDDING CARDS or our logo at the back of Envelope or cards's
                  holder.
                </td>
              </tr>
              <tr>
                <td>
                  <p>15.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  For completing order, 10 to 15 business days time is required
                  (In cases of specially designed cards as per your requirement,
                  it may require 10 to 15 days).
                </td>
              </tr>
              <tr>
                <td>16.</td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>Shipping Charges will be extra,</td>
              </tr>
              <tr>
                <td>
                  <p>17.</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  <p>{"    "}</p>
                </td>
                <td>
                  ELROI will not be liable for any damages occurring during the
                  transit though we will take utmost care while packing the
                  goods for dispatch
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ marginTop: "5%", fontSize: "14px" }}>
            <tbody>
              <tr>
                <td>
                  <p>Date:</p>
                </td>
                <td>
                  <p style={{ color: "#fff" }}>
                    ................................................................................................................................................
                  </p>
                </td>
                <td>
                  <p>Customer's Signature</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Terms Details */}
      </div>
      <button onClick={convertToPdf}>Convert to PDF</button>
      <Modal show={alertShow} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Body>{errMsg}</Modal.Body>
        </Modal.Header>
      </Modal>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast
          bg={"Danger".toLowerCase()}
          onClose={() => setShow(false)}
          show={show}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Alert</strong>
            <small className="text-muted">just now</small>
          </Toast.Header>
          <Toast.Body style={{ color: "white" }}>{errMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default LoginScreen;
