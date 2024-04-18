Insuredmine Project

API LIST
* CSV Upload:
  API: http://localhost:8080/api/upload
  TYPE: multipart/form-data
  METHOD: POST
  BODY: { file: "file selector" }

* Policy info with username:
  API: http://localhost:8080/api/search/:username
  TYPE: application/json
  METHOD: GET
  PARAMS: user's first name

* Aggregated policy by each user:
  API: http://localhost:8080/api/user_policies
  TYPE: application/json
  METHOD: GET

* Message:
  API: http://localhost:8080/api/message
  TYPE: application/json
  METHOD: POST
  BODY: { "message": "test", "date": "14/07/2024", "time": "01:18" }


* Notes:
- Transaction can be used so that if there is any invalid data or some insert fails we can rollback.
- Additional validators can be added for data.