import { React, useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import Login from "./Login";

const UserScreen = () => {
  const [data, setData] = useState([]);
  const [playOnce, setPlayOnce] = useState(true);
  const [id, setId] = useState(2);

  const history = useHistory();
  const jwt = history.location.state;
  //const id = history.location.state.id;

  useEffect(() => {
    if (playOnce && jwt) {
      axios({
        url: "https://cms.trial-task.k8s.ext.fcse.io/graphql",
        method: "post",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          query: `query{
              user(id:${id}){
                id,firstName,lastName,email
              }
             }`,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (!res) {
            history.push("/");
          }
          setData(res.data.data.user);
          setPlayOnce(false);
        })
        .catch((err) => {
          console.log(err.message);
          throw err;
        });
    }
  }, [playOnce]);

  const OnLogout = () => {
    history.push("/");
  };

  return (
    <div className="screen">
      {jwt && (
        <>
          <h1> Welcome to your First GraphQl App </h1>

          <form>
            <input
              className="firstName"
              type="text"
              value={data.firstName}
              disabled
            />
            <input
              className="lastName"
              type="text"
              value={data.lastName}
              disabled
            />
            <input
              type="submit"
              value="Logout"
              onClick={() => {
                OnLogout();
              }}
            />
          </form>
        </>
      )}
     { !jwt && <>
      <h1> Ooops, sorry ! you don't have access to this page, please login first </h1>
      </>}
    </div>
  );
};

export default UserScreen;
