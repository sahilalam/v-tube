import React from 'react';
import Context from './Context.js';
import { Row, Col, Spinner, Modal, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
export default function MyVideos() {
  const context = React.useContext(Context);
  let [data, setData] = React.useState([]);
  let [next, setNext] = React.useState(false);
  let [prev, setPrev] = React.useState(false);
  let [offset, setOffset] = React.useState(0);
  let [loading, setLoading] = React.useState(true);
  let [loadingB, setLoadingB] = React.useState(false);
  let [filters, setFilters] = React.useState(false);
  let [from, setFrom] = React.useState('');
  let [to, setTo] = React.useState('');
  let [category, setCategory] = React.useState('');
  let getData = async offset => {
    let d = await fetch(
      `https://v-tube-backend.herokuapp.com/get/videos/${offset}/${
        category.length ? category : 0
      }/${from.length ? new Date(from) : 0}/${to.length ? new Date(to) : 0}/1`,
      {
        method: 'GET',
        headers: {
          authorization: window.localStorage.access_token
        }
      }
    );
    if (d.status == 500) {
      context.logout();
    }
    d = await d.json();

    return d;
  };
  React.useEffect(async () => {
    setLoading(true);
    let data = await getData(0);
    setData(data.data);
    setPrev(data.prev);
    setNext(data.next);
    setLoading(false);
  }, []);
  let filter = async () => {
    setLoading(true);
    setFilters(false);
    let data = await getData(0);
    setData(data.data);
    setPrev(data.prev);
    setNext(data.next);
    setLoading(false);
  };
  let NEXT = async () => {
    setLoadingB(true);
    let data = await getData(offset + 20);
    setData(data.data);
    setPrev(data.prev);
    setNext(data.next);
    setOffset(offset + 20);
    setLoadingB(false);
  };
  let PREV = async () => {
    setLoadingB(true);
    let data = await getData(offset - 20);
    setData(data.data);
    setPrev(data.prev);
    setNext(data.next);
    setOffset(offset - 20);
    setLoadingB(false);
  };

  return (
    <div className="container-fluid">
      <h3 className="heading text-center mb-5">My Videos</h3>
      <Row className="justify-content-center heading">
        {loading ? (
          <Col xs="12" className="text-center">
            <Spinner animation="border" />
          </Col>
        ) : (
          <Col xs="12" md="7">
            <button
              className="buton"
              onClick={() => {
                setFilters(true);
              }}
            >
              Filters
            </button>
          </Col>
        )}
      </Row>
      <Row className="justify-content-center">
        {data && data.length ? (
          data.map(d => {
            let date = new Date(d.date);
            return (
              <Col
                xs="12"
                md="3"
                key={d._id}
                className="box box-shadow-dark m-3 p-2"
              >
                <NavLink
                  to={`/blogs/single/${d._id}`}
                  className="nav-link text-light width-fit p-0"
                >
                  <Col xs="12" className="mb-2 p-0">
                    <img src={d.thumbnail} className="trending-image p-0" />
                  </Col>
                  <Col xs="12" key={d._id} className="tube">
                    <Col xs="12" className="p-0 mb-2">
                      <h4 className="blog-title">{d.title}</h4>
                    </Col>
                    <Col xs="12" className="p-0 pt-2 m-0">
                      By : {d.name}
                    </Col>
                    <Col xs="12" className=" p-0 ">
                      <Row className="justify-content-center p-0 m-0 mb-2">
                        <Col xs="6">{d.views + ' views'}</Col>
                        <Col xs="6" className="text-align-right">
                          {date.toLocaleDateString()}
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                </NavLink>
              </Col>
            );
          })
        ) : loading ? (
          <></>
        ) : (
          <Col xs="12" className="text-center box box-shadow-dark bg-stars m-4">
            No Videos Found
          </Col>
        )}
        <Col xs="7" className="m-4">
          <Row>
            <Col xs="6">
              <button className="buton" hidden={!prev} onClick={PREV}>
                {loadingB ? <Spinner animation="border" /> : 'Prev'}
              </button>
            </Col>
            <Col xs="6">
              <button className="buton" hidden={!next} onClick={NEXT}>
                {loadingB ? <Spinner animation="border" /> : 'Next'}
              </button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        show={filters}
        onHide={() => {
          setFilters(false);
        }}
        backdrop="static"
        className="text text-dark"
      >
        <Modal.Header closeButton className="">
          Filter
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={event => {
              event.preventDefault();
              filter();
            }}
          >
            From
            <input
              type="datetime-local"
              className="form-control mb-2"
              required={true}
              onChange={e => {
                setFrom(e.target.value);
              }}
            />
            To
            <input
              type="datetime-local"
              className="form-control mb-2"
              required={true}
              onChange={e => {
                setTo(e.target.value);
              }}
            />
            Category or KeyWords (Seperate different keywords by spaces)
            <input
              className="form-control mb-5"
              onChange={e => {
                setCategory(e.target.value);
              }}
            />
            <button type="submit" className="tube buton mb-2">
              Submit
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
