import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Alert, Button, Modal, Spinner } from "react-bootstrap"
import axios from "axios"

export const LEDPages = () => {
  const [LEDdata, setLEDdata] = useState([])
  const [dataSet, setDataSet] = useState(
    {
      control_name: "",
      control_value: 0,
      control_pin: 0,
    }
  )
  
  const [monitoringData, setMonitoringData] = useState([])

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleClose = (e) => {
    console.log(e)
    setShow(false);
    setDataSet({
      control_name: "",
      control_value: 0,
      control_pin: 0,
    })
  }

  const handleSave = async () => {
    const payload = {
      control_name: dataSet.control_name,
      control_value: dataSet.control_value,
      control_pin: dataSet.control_pin,
    }

    try {
      const { data } = await axios.post(`https://645a4a4595624ceb21fd705c.mockapi.io/api/control`, payload)
      console.log(data)
      setShow(false);
      getLEDData()
    } catch (error) {
      return (
        <Alert variant="danger">
          {error.message}
        </Alert>
      )
    }
  }

  const handleShow = () => setShow(true);

  const getLEDData = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`https://645a4a4595624ceb21fd705c.mockapi.io/api/control`)
      setLEDdata(data)
      setLoading(false)
    } catch (error) {
      
    }
  }

  const getMonitoringData = async () => {
    try {
      const { data } = await axios.get(`https://645a4a4595624ceb21fd705c.mockapi.io/api/monitoring`)
      console.log(data)
      setMonitoringData(data)
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getLEDData()

    setInterval(() => {
      getMonitoringData()
    }, 5000);
  }, [])

  const handleChangeSwitch = async (id,controlVal) => {
    const payload = {
      control_value: controlVal == 0 ? 1 : 0,
    }

    try {
      const { data } = await axios.put(`https://645a4a4595624ceb21fd705c.mockapi.io/api/control/${id}`, payload)
      console.log(data)
    } catch (error) {
      return (
        <Alert variant="danger">
          {error.message}
        </Alert>
      )
    }
 }

  const handleDeleteLED = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`https://645a4a4595624ceb21fd705c.mockapi.io/api/control/${id}`)
      getLEDData()
    } catch (error) {
      return (
        <Alert variant="danger">
          {error.message}
        </Alert>
      )
    }
  }

  const handleEditLED = async () => {
    const payload = {
      control_name: dataSet.control_name,
      control_pin: dataSet.control_pin,
      control_value: dataSet.control_value
    }

    try {
      await axios.put(`https://645a4a4595624ceb21fd705c.mockapi.io/api/control/${dataSet.id}`, payload)
      setShow(false);
      getLEDData()
    } catch (error) {
      return (
        <Alert variant="danger">
          {error.message}
        </Alert>
      )
    }
  }

  if(loading) {
    return (
      <Spinner color="light">
        Loading...
      </Spinner>
    )
  }

  return (
    <Container className="w-50 text-light" >
      <Button 
        className="mt-5"
        variant="primary" 
        onClick={handleShow}
      >
        Add LED
      </Button>
      {LEDdata.map((data) => {
        return (
          <Row className="border my-3" key={data.id}>
            <Col md="3" className="py-3 text-start">{data.control_name}</Col>
            <Col xs lg="3" className="py-3 border-end border-start ">Pin {data.control_pin}</Col>
            <Col className="py-3">
            <Form
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Form.Check
                type="switch"
                id={`custom-switch-${data.id}`}
                defaultChecked={data.control_value == 0 ? false : true}
                onChange={(e) => handleChangeSwitch(data.id,data.control_value)}
              />
              <img 
                width="30" 
                height="30" 
                src="https://img.icons8.com/ios/30/FFFFFF/create-new.png" 
                alt="create-new"
                onClick={() => {
                  setDataSet({
                    control_name: data.control_name,
                    control_pin: data.control_pin,
                    control_value: data.control_value,
                    id: data.id
                  })
                  handleShow();
                }}
              />
              <img 
                width="30" 
                height="30" 
                src="https://img.icons8.com/ios/50/FA5252/waste.png" 
                alt="waste"
                onClick={() => handleDeleteLED(data.id)}
              />
            </Form>
            </Col>
          </Row>
        )
      })}
      
      <br />
      <Row className="my-3 w-100" key={monitoringData[0]?.id}>
        <Col md="5" className="py-3 border text-start">{monitoringData[0]?.monitoring_name}</Col>
        <Col md="5" className="py-3 border ">{monitoringData[0]?.monitoring_value}&deg;C</Col>
      </Row>
      <Row className="my-3 w-100" key={monitoringData[1]?.id}>
        <Col md="5" className="py-3 border text-start">{monitoringData[1]?.monitoring_name}</Col>
        <Col md="5" className="py-3 border ">{monitoringData[1]?.monitoring_value}%</Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Input your name"
                autoFocus
                onChange={(e) => {
                  setDataSet({
                    ...dataSet,
                    control_name: e.target.value
                  })
                }}
                defaultValue={dataSet.control_name}
              />
              <br />

              <Form.Label>Pin</Form.Label>
              <Form.Control
                type="text"
                placeholder="Input your name"
                autoFocus
                onChange={(e) => {
                  setDataSet({
                    ...dataSet,
                    control_pin: e.target.value
                  })
                }}
                defaultValue={dataSet.control_pin}
              />
              <br />

              <Form.Label>Value</Form.Label>
              <Form.Control
                type="text"
                placeholder="Input your name"
                autoFocus
                onChange={(e) => {
                  setDataSet({
                    ...dataSet,
                    control_value: e.target.value
                  })
                }}
                defaultValue={dataSet.control_value}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {dataSet.id ?
            <Button variant="primary" onClick={handleEditLED}>
              Save Changes
            </Button>
            :
            <Button variant="primary" onClick={handleSave}>
              Add Data
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </Container>
  )
}