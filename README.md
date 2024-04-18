Insuredmine Project

API LIST
* CSV Upload: <br />
  API: http://localhost:8080/api/upload <br />
  TYPE: multipart/form-data <br />
  METHOD: POST <br />
  BODY: { file: "file selector" } <br />

* Policy info with username: <br />
  API: http://localhost:8080/api/search/:username <br />
  TYPE: application/json <br />
  METHOD: GET <br />
  PARAMS: user's first name <br />

* Aggregated policy by each user: <br />
  API: http://localhost:8080/api/user_policies <br />
  TYPE: application/json <br />
  METHOD: GET <br />

* Message: <br />
  API: http://localhost:8080/api/message <br />
  TYPE: application/json <br />
  METHOD: POST <br />
  BODY: { "message": "test", "date": "14/07/2024", "time": "01:18" } <br />

Steps to run the app
- in dot env file put the db url like its there in .env.example
- run code npm i
- run npm run dev

Notes:
- Transaction can be used so that if there is any invalid data or some insert fails we can rollback.
- Additional validators can be added for data.
- For server restart at 70% cpu in production if we use pm2 then we can directly do process.exit which will stop the server and pm2 will automatically start the server.