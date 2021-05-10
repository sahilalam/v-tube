import React from 'react';
import { Row, Col, Spinner, Form } from 'react-bootstrap';
import Context from './Context.js';
import createBody from './creatBody.js';

export default function SingleBlog(props) {
  const context = React.useContext(Context);
  let [d, setData] = React.useState('');
  let [loading, setLoading] = React.useState(true);
  let [cl, setCl] = React.useState(true);
  let [comments, setComments] = React.useState(null);
  let [cswitch, setCswitch] = React.useState(false);
  let [cloading, setCloading] = React.useState(true);
  let [newcomment, setNewcomment] = React.useState('');

  let [liked, setLiked] = React.useState(false);
  React.useEffect(async () => {
    setCl(true);
    setLoading(true);
    let data = await fetch(
      `https://v-tube-backend.herokuapp.com/get/fullvideo/${
        props.match.params.id
      }`,
      {
        method: 'GET',
        headers: {
          authorization: window.localStorage.access_token
        }
      }
    );
    if (data.status == 500) {
      context.logout();
    }
    data = await data.json();

    setData(data);
    setLoading(false);
    data = await fetch(
      `https://v-tube-backend.herokuapp.com/checklike/${props.match.params.id}`,
      {
        method: 'GET',
        headers: {
          authorization: window.localStorage.access_token
        }
      }
    );
    if (data.status == 500) {
      context.logout();
    }
    data = await data.json();
    console.log(data);

    setLiked(data);
    setCl(false);
  }, []);
  let like = async () => {
    let tmp = { ...d };
    if (liked) {
      tmp.likes -= 1;
    } else {
      tmp.likes += 1;
    }
    setData(tmp);
    setLiked(!liked);

    let url = `https://v-tube-backend.herokuapp.com/like/${
      props.match.params.id
    }`;
    if (liked) {
      url = `https://v-tube-backend.herokuapp.com/dislike/${
        props.match.params.id
      }`;
    }
    let data = await fetch(url, {
      method: 'PUT',
      headers: {
        authorization: window.localStorage.access_token
      }
    });
    if (data.status == 500) {
      context.logout();
    }
  };
  let loadComments = async () => {
    setCloading(true);
    let data = await fetch(
      `https://v-tube-backend.herokuapp.com/comment/${props.match.params.id}`,
      {
        method: 'GET',

        headers: {
          authorization: window.localStorage.access_token
        }
      }
    );
    if (data.status == 500) {
      context.logout();
    }
    data = await data.json();
    setComments(data);
    setCloading(false);
  };
  let addComment = async () => {
    setCloading(true);
    let details = {
      comment: newcomment
    };
    let body = createBody(details);
    let resp = await fetch(
      `https://v-tube-backend.herokuapp.com/comment/${props.match.params.id}`,
      {
        method: 'POST',
        body,
        headers: {
          authorization: window.localStorage.access_token,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }
    );
    if (resp.status == 500) {
      context.logout();
    }

    loadComments();
  };

  return (
    <div className="container-fluid p-lg-5">
      <Row className="justify-content-center box box-shadow-dark">
        {!loading ? (
          <>
            <Col xs="12" className="mb-2 p-3">
              <video className="blog-image" autoplay controls>
                <source src={d.video_url} type="video/mp4" />
              </video>
            </Col>

            <Col xs="12" className="mb-4">
              <Row className="justify-content-center mb-2">
                <Col xs="12" className="pt-2 mb-2">
                  By : {d.name}
                </Col>
                <Col
                  xs="12"
                  className="tube heading box-shadow-dark bg-dark text-center p-2 mb-2"
                >
                  <Row className="p-0 m-0 text-align-left">
                    <Col xs="6">
                      <img
                        src="https://raw.githubusercontent.com/sahilalam/SocialMediaProjectNodejs/master/src/public/Components/ICONS/likes.png"
                        className="image-sm"
                      />{' '}
                      {d.likes}
                    </Col>
                    <Col xs="6" className="text-align-right">
                      {new Date(d.date).toLocaleString()}
                    </Col>
                  </Row>
                  <h4 className="blog-title">{d.title}</h4>
                </Col>
              </Row>
              Description:
              <Col xs="12" className="tube p-3  text-light">
                {d.description}
              </Col>
            </Col>
            <Col xs="12">
              <Col xs="12" md="6">
                <Row>
                  <Col xs="6">
                    <button
                      className="buton bg-dark box-shadow-dark p-2"
                      onClick={like}
                      disabled={cl}
                    >
                      {!liked ? 'Like' : 'Liked'}
                    </button>
                  </Col>
                  <Col xs="6">
                    <button
                      className="buton bg-dark box-shadow-dark p-2"
                      onClick={() => {
                        if (!cswitch) {
                          loadComments();
                        }
                        setCswitch(!cswitch);
                      }}
                    >
                      Comment
                    </button>
                  </Col>
                </Row>
              </Col>
            </Col>
          </>
        ) : (
          <Col xs="12" className="text-center">
            <Spinner animation="border" />
          </Col>
        )}
      </Row>
      <Row className="justify-content-center mt-3 mb-3">
        {cswitch ? (
          cloading ? (
            <Spinner animation="border" />
          ) : (
            comments && (
              <Col xs="12" md="6" className="mt-3 mb-3">
                <Col xs="12">
                  <Form
                    onSubmit={event => {
                      event.preventDefault();
                      addComment();
                    }}
                  >
                    <Row className="justify-content-start">
                      <Col xs="6" md="9">
                        <input
                          type="text"
                          required={true}
                          className="form-control-sm width-100"
                          onChange={e => {
                            setNewcomment(e.target.value);
                          }}
                        />
                      </Col>
                      <Col xs="6" md="3">
                        <button type="submit" className="buton">
                          Add Comment
                        </button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Row className="justify-content-center tube box-shadow-dark m-3 p-3">
                  {comments.length ? (
                    comments.map(c => {
                      return (
                        <Col xs="12">
                          <b>{c.username}</b> : {c.comment}
                        </Col>
                      );
                    })
                  ) : (
                    <>No Comments Yet</>
                  )}
                </Row>
              </Col>
            )
          )
        ) : (
          <></>
        )}
      </Row>
    </div>
  );
}
