import React from 'react';
import { Form, Row, Col, Nav, Modal, Spinner } from 'react-bootstrap';
import Context from './Context.js';

import createBody from './creatBody.js';
export default function AddNew() {
  const context = React.useContext(Context);
  let [public_id, setPublicId] = React.useState('');
  let [submit, setSubmit] = React.useState(false);
  let [spinner, setSpinner] = React.useState(false);
  let [data, setData] = React.useState('');
  let [video_url, setVideo] = React.useState('');
  let [thumbnail, setThumbnail] = React.useState('');
  let [uspinner, setUspinner] = React.useState(false);
  let [title, setTitle] = React.useState('');
  let [category, setCategory] = React.useState('');
  let [description, setDescription] = React.useState('');

  let upload = async () => {
    setUspinner(true);
    if (public_id.length) {
      setPublicId('');
      let details = {
        token: public_id
      };
      let Body = JSON.stringify(details);
      const resp = await fetch(
        'https://api.cloudinary.com/v1_1/dohdwfkhg/delete_by_token',
        {
          method: 'POST',
          body: Body,
          mode: 'cors',
          responseType: 'dataType',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(resp);
    }

    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dohdwfkhg',
        uploadPreset: 'wivw5xnu',
        clientAllowedFormats: ['mp4'],
        return_delete_token: true
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          let tmp = result.info.url;
          tmp = tmp.slice(0, -3);
          tmp = tmp + 'jpg';
          console.log(
            'Done! Here is the video info: ',
            result.info.secure_url,
            tmp
          );
          setVideo(result.info.secure_url);
          setThumbnail(tmp);
          setPublicId(result.info.delete_token);
        }
        setUspinner(false);
      }
    );
  };
  let addBlog = async event => {
    event.preventDefault();
    setSubmit(true);
    setSpinner(true);
    let tmp = category.toLowerCase();
    try {
      let date = new Date();
      let details = {
        title,
        category: tmp,
        description,
        video_url,
        thumbnail,
        date
      };
      let Body = createBody(details);
      let resp = await fetch('https://v-tube-backend.herokuapp.com/add/video', {
        method: 'POST',
        body: Body,
        headers: {
          authorization: window.localStorage.access_token,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      });
      if (data.status == 500) {
        context.logout();
      }
      resp = await resp.json();
      setSubmit(true);
      setSpinner(false);
      setData(resp.message);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container-fluid p-0">
      <Row className="justify-content-center p-5 ">
        <Col xs="12" lg="6" className="tube box-shadow-dark">
          <button
            className="buton mt-5 mb-5"
            onClick={() => {
              upload();
            }}
          >
            {uspinner ? (
              <Spinner animation="border" />
            ) : public_id.length ? (
              ' + Change Video'
            ) : (
              ' + Add video'
            )}
          </button>
          <Form onSubmit={addBlog}>
            Add Title for the video
            <input
              type="text"
              onChange={e => {
                setTitle(e.target.value);
              }}
              required={true}
              className="form-control mb-4"
            />
            Add Category or Keywords for the video( seperate different words by
            spaces *Ex:others fun music* )
            <input
              type="text"
              onChange={e => {
                setCategory(e.target.value);
              }}
              required={true}
              className="form-control mb-4"
            />
            Add Description For the video
            <textarea
              rows={5}
              onChange={e => {
                setDescription(e.target.value);
              }}
              required={true}
              className="form-control mb-4"
            />
            <button
              className="buton mb-2"
              hidden={
                title.length &&
                category.length &&
                description.length &&
                public_id.length
                  ? false
                  : true
              }
            >
              Submit
            </button>
          </Form>
        </Col>
      </Row>
      <Modal
        show={submit}
        onHide={() => {
          setSubmit(false);
        }}
        backdrop="static"
        className={spinner ? 'text text-dark' : 'text text-dark bg-done'}
      >
        {spinner ? (
          <Modal.Header>
            Please Wait..
            <Spinner animation="border" />
          </Modal.Header>
        ) : (
          <Modal.Header
            closeButton
            onHide={() => {
              window.location.reload();
            }}
          >
            {data}
          </Modal.Header>
        )}
      </Modal>
    </div>
  );
}
