/****************
 *    Config     *
 *****************/
const answer_time = 35 //en millisecondes (35ms minimum)
const percentage_good_answer = 100 // entre 0% et 100%


/***************************
 *    X-Inertia-Version     *
 ****************************/
var xinertiaVers = $inertia.page.version

/*****************************
 *    Script do not touch     *
 ******************************/

var running = true

function random() {
  randomNum = Math.floor(Math.random() * (100 - 0 + 1) + 0);
  if (randomNum > percentage_good_answer) {
    return false
  } else {
    return true
  }
}


function autoAnswer(params) {
  if (running) {
    json_all_answer = get_answer()
    //console.log(json_all_answer);
    setTimeout(() => {
      post_reponse(json_all_answer);
    }, answer_time * result.length);

  }
}


function get_answer() {
  json_all_answer = {
    "answers": [],
    "examPartId": parseInt((window.location.href).split("/").slice(-1).join("/"))
  }

  result = $inertia.page.props.examQuestions.data;
  for (let i = 0; i < result.length; i++) {
    question = result[i];
    answer = result[i]["exam_answers"];
    if (random()) {
      for (let j = 0; j < answer.length; j++) {
        element = answer[j];
        if (element["is_right_answer"] == true) {
          json_all_answer["answers"].push({
            "id": result[i]["id"],
            "answers": [element["id"]]
          });
        } else if (element["numbering"] == null) {
          json_all_answer["answers"].push({
            "id": result[i]["id"],
            "answers": [element["name"]]
          });
        }
      }
    } else {
      for (let j = 0; j < answer.length; j++) {
        element = answer[j];
        if (element["is_right_answer"] == false) {
          json_all_answer["answers"].push({
            "id": result[i]["id"],
            "answers": [element["id"]]
          });
          break;
        }
      }

    }
  }
  return json_all_answer
}


function post_reponse(json_all_answer) {
  fetch((window.location.href).split("/").slice(0, -2).join("/") + "/next", {
    method: "POST",
    headers: {
      "Cookie": "global_exam_prod_session=" + (document.cookie).split("; ").find(row => row.startsWith("XSRF-TOKEN-PROD")).split("=")[1],
      "Referer": window.location.href,
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Accept": "text/html, application/xhtml+xml",
      "X-CSRF-Token-Prod": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36",
      'Content-Type': 'application/json;charset=UTF-8',
      "x-inertia": "true",
      "x-inertia-version": xinertiaVers,
      "Origin": "https://exam.global-exam.com"
    },

    body: JSON.stringify(json_all_answer)
  }).then(response => {
    return response.json()
  }).then(data => {
    //console.log("Request complete! response:", data);
    if (data["props"]["flash"] != null) {
      if (data["props"]["flash"]["success"] != null) {
        console.log(data["props"]["flash"]["success"]);
        activityNumber = data["url"].split("/").slice(-2, -1).join("/")
        toUrl = "https://exam.global-exam.com/exam/activity/" + activityNumber + "/result"
        window.location.href = toUrl
        running = false
      } else if (data["props"]["flash"]["errors"] != null) {
        console.log("Error : " + data["props"]["flash"]["errors"][0]);
        running = false
      }

    }

    window.history.pushState(null, null, data["url"]);
    autoAnswer()

  });

}
autoAnswer()