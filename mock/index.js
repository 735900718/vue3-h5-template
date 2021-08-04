import { resultError, resultSuccess } from "./_utils.js";

export default {
  "GET /api/user": function(req, res) {
    return res.json(resultError("login error"));
    return res.json(
      resultSuccess({
        username: "admin",
        sex: 5
      })
    );
  },
  "GET /api/list": function(req, res) {
    let query = req.query || {};
    return res.json(
      resultSuccess({
        limit: query.limit,
        offset: query.offset,
        list: [
          {
            username: "admin1",
            sex: 1
          },
          {
            username: "admin2",
            sex: 0
          }
        ]
      })
    );
  },
  "GET /api/userinfo/:id": (req, res) => {
    return res.json(
      resultSuccess({
        id: req.params.id,
        username: "kenny"
      })
    );
  },
  "POST /api/login/account": (req, res) => {
    const { password, username } = req.body;
    if (password === "888888" && username === "admin") {
      return res.json(
        resultSuccess({
          status: "ok",
          token: "sdfsdfsdfdsf"
        })
      );
    } else {
      return res.json(
        resultError("error", {
          result: "error",
          code: 403
        })
      );
    }
  },
  "DELETE /api/user/:id": (req, res) => {
    // console.log(req.params.id);
    res.send(resultSuccess({ status: "ok", message: "delete success!" }));
  },
  "PUT /api/user/:id": (req, res) => {
    // console.log(req.params.id);
    // console.log(req.body);
    res.send(resultSuccess({ status: "ok", message: "update success！" }));
  }
};
