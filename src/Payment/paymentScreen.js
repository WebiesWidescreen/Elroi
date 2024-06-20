import React, { useState, useRef } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import InputMask from "react-input-mask";
import CurrencyInput from "react-currency-input-field";
// import { MongoClient } from "mongodb";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import { toWords } from "number-to-words";
import { saveAs } from "file-saver";
import "./paymentStyles.css";
import ElroiLogo from "../assets/Images/ElroiLogo.png";

const PaymentScreen = () => {
  const refNameInput = useRef(null);
  const refPhoneInput = useRef(null);
  const refEmailInput = useRef(null);
  const refCardCodeInput = useRef(null);
  const refQtyInput = useRef(null);
  const refTotalInput = useRef(null);
  const refSignInput = useRef(null);
  const [localState, setLocalState] = useState({
    name: "",
    phone: "",
    email: "",
    cardCode: "",
    quantity: "",
    totalAmount: 0,
    advAmount: 0,
    balAmount: 0,
    signImg: "",
    date: moment(new Date()).format("DD-MM-YYYY"),
    amtWords: "",
    spinner: false,
    pdfModal: false,
    contentPdf: false,
    pdfLink: "",
  });

  const handleClose = () =>
    setLocalState((ls) => ({
      ...ls,
      pdfModal: false,
      pdfLink: "",
    }));

  const balAmountCal = (type, val) => {
    const editedVal =
      val.replace(/[₹,]/g, "") > 0 ? val.replace(/[₹,]/g, "") : 0;
    let totalVal =
      typeof localState.totalAmount === "string"
        ? localState.totalAmount.replace(/[₹,]/g, "")
        : 0;
    let advVal =
      typeof localState.advAmount === "string"
        ? localState.advAmount.replace(/[₹,]/g, "")
        : 0;
    if (type === "TOTAL") {
      totalVal = editedVal;
    } else {
      advVal = editedVal;
    }
    const tempVal = parseFloat(totalVal) - parseFloat(advVal);
    setLocalState((ls) => ({
      ...ls,
      totalAmount: totalVal,
      advAmount: advVal,
      amtWords: toWords(advVal),
      balAmount: tempVal,
    }));
  };

  const onSignUpload = (event) => {
    const { files } = event.target;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = (e) => {
      setLocalState((ls) => ({
        ...ls,
        signImg: e.target.result,
      }));
    };
  };

  const onViewAdvBill = () => {
    if (localState.name == "") {
      alert("Please enter the name");
      refNameInput?.current?.focus();
    } else if (localState.phone == "") {
      alert("Please enter the phone number");
      refPhoneInput?.current?.focus();
    } else if (localState.phone.length < 10) {
      alert("Please enter the valid phone number");
      refPhoneInput?.current?.focus();
    } else if (localState.email == "") {
      alert("Please enter the mail id");
      refEmailInput?.current?.focus();
    } else if (!localState.email.includes("@")) {
      alert("Please enter the valid @gmail id");
      refEmailInput?.current?.focus();
    } else if (localState.cardCode == "") {
      alert("Please enter the card code");
      refCardCodeInput?.current?.focus();
    } else if (localState.quantity == "") {
      alert("Please enter the qty");
      refQtyInput?.current?.focus();
    } else if (localState.totalAmount == 0) {
      alert("Please enter the total amount");
      refTotalInput?.current?.focus();
    } else if (localState.signImg == "") {
      alert("Please upload signImg");
      refSignInput?.current?.focus();
    } else {
      setLocalState((ls) => ({
        ...ls,
        pdfModal: true,
        contentPdf: true,
      }));
    }
  };

  const onViewOrderBill = () => {
    if (localState.name == "") {
      alert("Please enter the name");
      refNameInput?.current?.focus();
    } else if (localState.phone == "") {
      alert("Please enter the phone number");
      refPhoneInput?.current?.focus();
    } else if (localState.phone.length < 10) {
      alert("Please enter the valid phone number");
      refPhoneInput?.current?.focus();
    } else if (localState.email == "") {
      alert("Please enter the mail id");
      refEmailInput?.current?.focus();
    } else if (!localState.email.includes("@")) {
      alert("Please enter the valid @gmail id");
      refEmailInput?.current?.focus();
    } else if (localState.cardCode == "") {
      alert("Please enter the card code");
      refCardCodeInput?.current?.focus();
    } else if (localState.quantity == "") {
      alert("Please enter the qty");
      refQtyInput?.current?.focus();
    } else if (localState.totalAmount == 0) {
      alert("Please enter the total amount");
      refTotalInput?.current?.focus();
    } else if (localState.signImg == "") {
      alert("Please upload signImg");
      refSignInput?.current?.focus();
    } else {
      setLocalState((ls) => ({
        ...ls,
        pdfModal: true,
        contentPdf: false,
      }));
    }
  };

  const convertToPdf = async () => {
    try {
      const element = document.getElementById("contentPdf");
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

      pdf.addImage(
        imgData,
        "PNG",
        margin,
        position,
        imgWidth,
        imgHeight / scale
      );
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

      // pdf.save("advanceBill.pdf");
      // Generate a Blob from the PDF
      const pdfBlob = pdf.output("blob");
      // Create a URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setLocalState((ls) => ({
        ...ls,
        pdfLink: pdfUrl,
      }));
      // Set the URL in the state
      const url = `https://wa.me/${localState.phone}?text=${encodeURIComponent(
        pdfUrl
      )}`;
      window.open(url, "_blank");

      // console.log("hell");
      // const mongoClient = new MongoClient(
      //   "mongodb+srv://webieswidescreen:jce4mAvtpW5h48V5@elroipay.xc5xyqj.mongodb.net/"
      // );
      // const data = await mongoClient.db().collection("Test").find({}).toArray();
      // console.log("data", data);
      // var url = 'mongodb+srv://webieswidescreen:jce4mAvtpW5h48V5@elroipay.xc5xyqj.mongodb.net/';
      // MongoClient.connect(url, function (err, db) {
      //     console.log('connected');
      //     db.close();
      // });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <header>
        <div className="container mt-4">
          <h1 className="text-center text-md-left">
            <img src={ElroiLogo} height={150} /> Elroi Advance Payment
          </h1>
        </div>
      </header>
      <body>
        <div className="container">
          <Card>
            <Card.Header>
              <Card.Title>Customer Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="container col-md-9">
                  <Form>
                    <Form.Group controlId="name">
                      <div className="row align-items-center  m-3">
                        <div className="col-md-12">
                          <Form.Control
                            type="text"
                            placeholder="Customer Name"
                            value={localState.name}
                            ref={refNameInput}
                            onChange={(e) =>
                              setLocalState((ls) => ({
                                ...ls,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group controlId="phone">
                      <div className="row align-items-center  m-3">
                        <div className="col-md-12">
                          <InputMask
                            mask="9999999999"
                            maskChar={null}
                            value={localState.phone}
                            onChange={(e) =>
                              setLocalState((ls) => ({
                                ...ls,
                                phone: e.target.value,
                              }))
                            }
                          >
                            {(inputProps) => (
                              <Form.Control
                                {...inputProps}
                                placeholder="Enter number"
                                ref={refPhoneInput}
                              />
                            )}
                          </InputMask>
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group controlId="email">
                      <div className="row align-items-center  m-3">
                        <div className="col-md-12">
                          <Form.Control
                            type="mail"
                            placeholder="Customer mail"
                            value={localState.email}
                            ref={refEmailInput}
                            onChange={(e) =>
                              setLocalState((ls) => ({
                                ...ls,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group controlId="cardCode">
                      <div className="row align-items-center  m-3">
                        <div className="col-md-12">
                          <Form.Control
                            type="text"
                            placeholder="Card Code"
                            ref={refCardCodeInput}
                            value={localState.cardCode}
                            onChange={(e) =>
                              setLocalState((ls) => ({
                                ...ls,
                                cardCode: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group controlId="quantity">
                      <div className="row align-items-center  m-3">
                        <div className="col-md-12">
                          <InputMask
                            mask="9999999999"
                            maskChar={null}
                            value={localState.quantity}
                            onChange={(e) =>
                              setLocalState((ls) => ({
                                ...ls,
                                quantity: e.target.value,
                              }))
                            }
                          >
                            {(inputProps) => (
                              <Form.Control
                                {...inputProps}
                                placeholder="Enter qty"
                                ref={refQtyInput}
                              />
                            )}
                          </InputMask>
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group controlId="amount">
                      <div className="row align-items-center  m-3">
                        <div className="col-md-4">
                          <Form.Label>Total Payable Amount</Form.Label>
                          <CurrencyInput
                            prefix="₹"
                            decimalSeparator="."
                            thousandSeparator=","
                            allowNegativeValue={false}
                            decimalsLimit={2}
                            className="form-control"
                            placeholder="Total Payable amount"
                            value={localState.totalAmount}
                            ref={refTotalInput}
                            onChange={(e) =>
                              balAmountCal("TOTAL", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <Form.Label>Advance Amount</Form.Label>
                          <CurrencyInput
                            prefix="₹"
                            decimalSeparator="."
                            thousandSeparator=","
                            allowNegativeValue={false}
                            decimalsLimit={2}
                            className="form-control"
                            placeholder="Advance amount"
                            value={localState.advAmount}
                            onChange={(e) =>
                              balAmountCal("ADV", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <Form.Label>Balance Amount</Form.Label>
                          <CurrencyInput
                            prefix="₹"
                            disabled
                            decimalSeparator="."
                            thousandSeparator=","
                            allowNegativeValue={false}
                            decimalsLimit={2}
                            className="form-control"
                            placeholder="Balance amount"
                            value={localState.balAmount}
                          />
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group controlId="signImg">
                      <div className="row align-items-center  m-3">
                        <div className="col-md-12">
                          <Form.Control
                            ref={refSignInput}
                            type="file"
                            onChange={onSignUpload}
                          />
                        </div>
                      </div>
                    </Form.Group>

                    <div className="row align-items-center  m-3">
                      <div className="col-md-3" />
                      <div className="col-md-3">
                        <Button
                          variant="danger"
                          disabled={localState.spinner}
                          onClick={onViewAdvBill}
                        >
                          {localState.spinner && (
                            <Spinner
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                          View Advance Bill
                        </Button>
                      </div>
                      <div className="col-md-6">
                        <Button variant="danger" onClick={onViewOrderBill}>
                          View Order Bill
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
                <div className="container col-md-3 border border-primary rounded bg-light text-dark align-content-center">
                  <Card.Text>Name: {localState.name}</Card.Text>
                  <Card.Text>Phone: +91 {localState.phone}</Card.Text>
                  <Card.Text>Email: {localState.email}</Card.Text>
                  <Card.Text>Card Code: {localState.cardCode}</Card.Text>
                  <Card.Text>Quantity: {localState.quantity}</Card.Text>
                  <Card.Text>
                    Total Amount: ₹ {localState.totalAmount}
                  </Card.Text>
                  <Card.Text>
                    Advance Amount: ₹ {localState.advAmount}
                  </Card.Text>
                  <Card.Text>
                    Balance Amount: ₹ {localState.balAmount}
                  </Card.Text>
                  <Card.Text>
                    Signature:{" "}
                    {localState.signImg ? (
                      <img src={localState.signImg} height={100} width={100} />
                    ) : null}
                  </Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <Modal size="lg" show={localState.pdfModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Generate Bill Successfully</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {localState.contentPdf ? (
              <div id="contentPdf" className="advBill">
                <div className="row">
                  <div className="col-3" />
                  <div className="col-5">
                    <h4 className="logoHeadTxt">
                      <b>ADVANCE PAYMENT SLIP</b>
                    </h4>
                  </div>
                  <div className="col-4">
                    Mob:90944 33337
                    <p>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;90944
                      33336
                    </p>
                  </div>
                </div>
                <h1 className="logoSty">
                  <img src={ElroiLogo} height={100} />{" "}
                  <b>ELROI WEDDING CARDS</b>
                </h1>
                <p style={{ textAlign: "center", lineHeight: "1.2" }}>
                  <b>
                    No. 33/Shop-3, Thirunavaleeswarar Temple Complex, <br />
                    OMR, Navalur, Chennai - 600130
                  </b>
                  <br />
                  GSTIN: 33BWTPS5466E1ZZ
                </p>
                <br />
                <div>
                  <p>
                    <b>M/s .</b>{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #fff",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      {localState.name ? (
                        <b>
                          {localState.name}
                          {"                                                  "}
                        </b>
                      ) : (
                        <b>
                          {
                            "                                                                                                                                   "
                          }
                        </b>
                      )}
                    </span>
                  </p>
                  <p>
                    Contact{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #fff",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      {localState.phone ? (
                        <b>
                          {localState.phone}
                          {"                                  "}
                        </b>
                      ) : (
                        <b>
                          {
                            "                                                                                                                               "
                          }
                        </b>
                      )}
                    </span>
                  </p>
                  <p>
                    Order No : <b>EWC</b>{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #fff",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      <b>
                        {"                                                 "}
                      </b>
                    </span>
                    Date :{" "}
                    <span
                      style={{
                        borderBottom: "2px solid #fff",
                        borderBottomStyle: "dotted",
                        whiteSpace: "pre",
                      }}
                    >
                      {localState.date ? (
                        <b>
                          {localState.date}
                          {"                                   "}
                        </b>
                      ) : (
                        <b>
                          {
                            "                                                     "
                          }
                        </b>
                      )}
                    </span>
                  </p>
                  <div className="row">
                    <div className="col-6">
                      <p>SL.No.</p>
                    </div>
                    <div className="col-6">
                      <p>
                        Code :{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.cardCode ? (
                            <b>
                              {localState.cardCode}
                              {"               "}
                            </b>
                          ) : (
                            <b>
                              {
                                "                                                     "
                              }
                            </b>
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <table
                  style={{
                    textAlign: "center",
                    width: "100%",
                    border: "1px solid #fff",
                    margin: "5px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #fff" }}>No.</th>
                      <th style={{ border: "1px solid #fff", padding: "10px" }}>
                        PARTICULARS
                      </th>
                      <th style={{ border: "1px solid #fff" }}>QTY</th>
                      <th style={{ border: "1px solid #fff" }}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #fff",
                          height: "250px",
                          borderBottom: "none",
                        }}
                      />
                      <td
                        style={{
                          border: "1px solid #fff",
                          height: "250px",
                          borderBottom: "none",
                        }}
                      />
                      <td
                        style={{ border: "1px solid #fff", height: "250px" }}
                      />
                      <td
                        style={{ border: "1px solid #fff", height: "250px" }}
                      />
                    </tr>
                    <tr>
                      <td style={{ borderRight: "1px solid #fff" }} />
                      <td>
                        <div className="row">
                          <div className="col-6" style={{ textAlign: "start" }}>
                            E.& O.E
                          </div>
                          <div className="col-6" style={{ textAlign: "end" }}>
                            <b>TOTAL</b>
                          </div>
                        </div>
                      </td>
                      <td style={{ border: "1px solid #fff" }}>
                        {localState.quantity}
                      </td>
                      <td style={{ border: "1px solid #fff" }}>
                        {localState.advAmount != 0
                          ? localState.advAmount
                          : null}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  style={{
                    width: "100%",
                    border: "1px solid #fff",
                    borderTop: "none",
                    position: "relative",
                    bottom: "5px",
                    margin: "5px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "7px" }}>
                        <b>Rs .</b> (in words) : {localState.amtWords}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="row">
                  <div className="col-8" />
                  <div className="col-4" style={{ fontSize: "14px" }}>
                    For ELROI WEDDING CARDS
                  </div>
                </div>
                <br />
                <br />
                <br />
                <div className="row">
                  <div className="col-10" />
                  <div className="col-2">
                    {localState.signImg ? (
                      <>
                        <img
                          src={localState.signImg}
                          height={100}
                          width={100}
                        />
                        <br />
                        <br />
                        Signature
                      </>
                    ) : (
                      "Signature"
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div id="contentPdf" className="orderForm">
                <h1 className="logoSty">
                  <img src={ElroiLogo} height={100} />{" "}
                  <b>ELROI WEDDING CARDS</b>
                </h1>
                <h5 className="logoHeadTxtOrder">
                  <b>ORDER FORM</b>
                </h5>
                <br />
                {/* Main Content */}
                <div>
                  <div className="row" style={{ fontSize: "13px" }}>
                    <div className="col-8">
                      <p>
                        Order No. : <b>EWC- </b>
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          <b>{"                                     "}</b>
                        </span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p>
                        <b>SL. No.:</b>
                      </p>
                    </div>
                    <div className="col-8">
                      <p>
                        Customer Name :{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.name ? (
                            <b>
                              {localState.name}
                              {
                                "                                                  "
                              }
                            </b>
                          ) : (
                            <b>
                              {
                                "                                                                                 "
                              }
                            </b>
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p>
                        Date :{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.date ? (
                            <b>
                              {localState.date}
                              {"                  "}
                            </b>
                          ) : (
                            <b>
                              {"                                          "}
                            </b>
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="col-8">
                      <p>
                        Contact Details :{"  "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.phone ? (
                            <b>
                              {localState.phone}
                              {"                            "}
                            </b>
                          ) : (
                            <b>
                              {
                                "                                                                                     "
                              }
                            </b>
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p>
                        Card Code :{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.cardCode ? (
                            <b>
                              {localState.cardCode}
                              {"                 "}
                            </b>
                          ) : (
                            <b>{"                                "}</b>
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="col-8">
                      <p>
                        Couple Names :{"  "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          <b>
                            {
                              "                                                                                      "
                            }
                          </b>
                        </span>
                      </p>
                    </div>
                    <div className="col-4">
                      <p>
                        Qty<b>.</b> :{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.quantity ? (
                            <b>
                              {localState.quantity}
                              {"                       "}
                            </b>
                          ) : (
                            <b>
                              {"                                           "}
                            </b>
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="col-5">
                      <p>
                        Card Price :{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          <b>
                            {"                                                "}
                          </b>
                        </span>
                      </p>
                    </div>
                    <div className="col-7">
                      <p>
                        Total Amount :{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.totalAmount ? (
                            <b>
                              ₹ {localState.totalAmount}
                              {"                       "}
                            </b>
                          ) : (
                            <b>
                              {
                                "                                                "
                              }
                            </b>
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="col-12">
                      <p>
                        Payment Mode : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontSize: "19px" }}>☐</span> Cash
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontSize: "19px" }}>☐</span> Card
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontSize: "19px" }}>☐</span> UPI
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontSize: "19px" }}>☐</span> Account
                        Transfer
                      </p>
                    </div>
                    <div className="col-12">
                      <p>
                        Advance:{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.advAmount ? (
                            <b>
                              ₹ {localState.advAmount}
                              {"                       "}
                            </b>
                          ) : (
                            <b>{"                                     "}</b>
                          )}
                        </span>{" "}
                        Balance:{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          {localState.balAmount ? (
                            <b>
                              ₹ {localState.balAmount}
                              {"                       "}
                            </b>
                          ) : (
                            <b>{"                                      "}</b>
                          )}
                        </span>{" "}
                        Delivery Date:{" "}
                        <span
                          style={{
                            borderBottom: "2px solid #fff",
                            borderBottomStyle: "dotted",
                            whiteSpace: "pre",
                          }}
                        >
                          <b>{"                                       "}</b>
                        </span>
                      </p>
                    </div>
                  </div>

                  <table
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      border: "1px solid #fff",
                      fontSize: "13px",
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{ border: "1px solid #fff", padding: "25px" }}
                        >
                          <div className="tblHeadSty">Card</div>
                        </th>
                        <th style={{ border: "1px solid #fff" }}>
                          <div className="tblHead2Sty">TOTAL</div>
                        </th>
                      </tr>
                      <tr>
                        <th
                          style={{ border: "1px solid #fff", padding: "25px" }}
                        >
                          <div className="tblHeadSty">Printing</div>
                        </th>
                        <th style={{ border: "1px solid #fff" }}>
                          <div className="tblHead2Sty">TOTAL</div>
                        </th>
                      </tr>
                      <tr>
                        <th
                          style={{ border: "1px solid #fff", padding: "25px" }}
                        >
                          <div className="tblHeadSty">Discount</div>
                        </th>
                        <th style={{ border: "1px solid #fff" }}>
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
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        {/* {localState.signImg ? (
                          <img
                            src={localState.signImg}
                            height={50}
                            width={50}
                          />
                        ) : ( */}
                        <b>{"                                      "}</b>
                        {/* )} */}
                      </span>
                      <br />
                      <br />
                      Customer Sign.
                    </p>
                    <p>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
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
                    <span style={{ borderBottom: "2px solid #fff" }}>
                      <b>PRINTING DETAILS</b>
                    </span>
                  </p>

                  <div style={{ fontSize: "13px" }}>
                    <p>
                      Card
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> No
                      &nbsp;&nbsp;&nbsp;&nbsp; Printing Colours{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                           "}</b>
                      </span>{" "}
                      Others{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>
                    </p>
                    <p>
                      Insert 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> No
                      &nbsp;&nbsp;&nbsp;&nbsp; Printing Colours{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                           "}</b>
                      </span>
                      Others{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>
                    </p>
                    <p>
                      Insert 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> No
                      &nbsp;&nbsp;&nbsp;&nbsp; Printing Colours{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                           "}</b>
                      </span>
                      Others{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>
                    </p>
                    <p>
                      Insert 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> No
                      &nbsp;&nbsp;&nbsp;&nbsp; Printing Colours{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                           "}</b>
                      </span>
                      Others{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>
                    </p>
                    <p>
                      Insert Material Colour 1.{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                        "}</b>
                      </span>{" "}
                      2.{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>{" "}
                      3.{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                           "}</b>
                      </span>
                    </p>
                    <p>
                      Insert Sheet &nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Yes{" "}
                      &nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> No
                      &nbsp;&nbsp; Printing Colours{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                           "}</b>
                      </span>
                      Others{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>
                    </p>
                    <p>
                      Envelope &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Box{" "}
                      &nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Plain Printing
                      Colours{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                           "}</b>
                      </span>
                      Others{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>
                    </p>
                    <p>
                      Extra Works &nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Name Plate{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Ribbon
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> E.P.
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Others{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>
                    </p>
                    <p>
                      Important Note :{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                                                                                                                   "
                          }
                        </b>
                      </span>
                    </p>
                    <p>
                      Print Ink &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> PVC{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> PVC Glossy
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span> Glossy
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Others{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                         "}</b>
                      </span>
                    </p>
                  </div>
                </div>
                {/* PRINTING Content */}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                {/* CONTENT Details */}
                <div>
                  <p style={{ textAlign: "center", fontSize: "18px" }}>
                    <span style={{ borderBottom: "2px solid #fff" }}>
                      <b>CONTENT DETAILS</b>
                    </span>
                  </p>

                  <div style={{ fontSize: "13px" }}>
                    <p>
                      Fonts :{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                                                              "
                          }
                        </b>
                      </span>
                      Others :{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                      "
                          }
                        </b>
                      </span>
                    </p>
                    <p>
                      Card Logo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                     "
                          }
                        </b>
                      </span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cover Logo
                      &nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                            "
                          }
                        </b>
                      </span>
                    </p>
                    <p>
                      Insert (1) Logo{" "}
                      <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                            "}</b>
                      </span>
                      {"  "}
                      Insert (2) Logo{" "}
                      <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                            "}</b>
                      </span>
                      {"  "}
                      Insert (3) Logo{" "}
                      <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                            "}</b>
                      </span>
                    </p>
                    <p>
                      Insert Sheet Logo &nbsp;&nbsp;&nbsp;
                      <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                                              "
                          }
                        </b>
                      </span>
                      {"  "}
                      Others :{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>{"                                           "}</b>
                      </span>
                    </p>
                    <p>
                      1st Page Logo <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                        "
                          }
                        </b>
                      </span>
                      &nbsp;&nbsp;&nbsp;&nbsp; 2nd Page Logo{" "}
                      <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                     "
                          }
                        </b>
                      </span>
                    </p>
                    <p>
                      3rd Page Logo <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                        "
                          }
                        </b>
                      </span>
                      &nbsp;&nbsp;&nbsp;&nbsp; 4th Page Logo{" "}
                      <span style={{ fontSize: "20px" }}>☐</span>
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                     "
                          }
                        </b>
                      </span>
                    </p>
                    <p>
                      Important Notes :{" "}
                      <span
                        style={{
                          borderBottom: "2px solid #fff",
                          borderBottomStyle: "dotted",
                          whiteSpace: "pre",
                        }}
                      >
                        <b>
                          {
                            "                                                                                                                                                "
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
                    <tbody style={{ fontSize: "12px", lineHeight: "1.4" }}>
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
                          Order Booking Once Ordered, No Cancellation No
                          Exchange (As soon as order is booked the production
                          process will start immediately). Elroi Wedding Cards
                          will not refund any amount on cancellation of orders
                          in such cases.
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
                          Proof Reading Customers are requested to check the
                          proof thoroughly and approve it at the specified time.
                          If not, the delivery date will be postponed.
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
                          Delivery Schedule Our aim is to deliver the goods on
                          time. Sometime it may also change due to disturbances
                          of nature.
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
                          Printing Matters Please give us correct and complete
                          matter at the first instance.
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
                          Materials Though we try to achieve perfect color match
                          to the sample, there will be unavoidable variation in
                          shades (especially Ivory, Gold, Silver & Red) & weight
                          of the Paper/Board from the Mill Handmade unit.
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
                          Printing Colours We take utmost care in executing your
                          valued orders. There will be slight variation in
                          printing colours which is due to various raw material
                          inputs.
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
                          Material Wastage In the process of printing there is
                          likely a wastage of 2% to 3% will occur which cannot
                          be avoided. It is globally accepted.
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
                          Complaints Please inform us if any complaint within 24
                          hours of your delivery.
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
                          Kind Attention Al boards (Metallic, Handmade, Imported
                          Boards & Papers) will tend to unavoidable variations
                          such avicolors, shades, thickness, stiffness and
                          bulkness due to various raw material input while
                          manufacturing, So, Kindly bear with us for the
                          inconvenience.
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
                        <td>
                          Rates of the wedding cards mentioned are per piece.
                        </td>
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
                          All wedding card rates include 1 wedding card and 2
                          inserts & 1 Envelope. Any extra insert will have to be
                          bought at any additional cost. If there are more
                          inserts shown in the photograph, it is for the colour
                          options from which a customer can choose any 2 or 3
                          colours according to their Functions.
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
                          Minimum order quantity of any wedding card design is
                          100 pieces, Further, quantities should be in multiple
                          of 50, So, you can order 100, 150, 200, 250 and so on
                          Printing costs are extra as applicable.
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
                          For making a customized card, minimum quantity should
                          be 50 pieces. Quotation for the same will be provided
                          via email based on your requirements.
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
                          As to maintain originality, there will be pressline of
                          ELROI WEDDING CARDS or our logo at the back of
                          Envelope or cards's holder.
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
                          For completing order, 10 to 15 business days time is
                          required (In cases of specially designed cards as per
                          your requirement, it may require 10 to 15 days).
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
                          ELROI will not be liable for any damages occurring
                          during the transit though we will take utmost care
                          while packing the goods for dispatch
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                      textAlign: "center",
                      fontSize: "13px",
                    }}
                  >
                    <p>Date: {localState.date ? localState.date : ""}</p>
                    <p>
                      {/* {localState.signImg ? (
                        <>
                          <span>
                            <img
                              src={localState.signImg}
                              height={50}
                              width={50}
                            />
                          </span>
                          <br />
                        </>
                      ) : (
                        ""
                      )} */}
                      Customer's Signature
                    </p>
                  </div>
                </div>
                {/* Terms Details */}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button variant="success" onClick={convertToPdf}>
              Generate & Share
            </Button>
            {localState.pdfLink && (
              <iframe
                src={localState.pdfLink}
                width="100%"
                height="600px"
                title="pdf-viewer"
              ></iframe>
            )}
          </Modal.Footer>
        </Modal>
      </body>
    </div>
  );
};
export default PaymentScreen;
