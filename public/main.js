let trash = document.querySelectorAll(".deleteVitals");

let issueTrash = document.querySelectorAll(".deleteIssues");

let responseTrash = document.querySelectorAll(".deleteResponses");


trash.forEach((button) => {
  button.addEventListener("click", deleteVitals);
});

function deleteVitals(e) {
  vitalsTrashid = e.currentTarget.dataset.id;
  fetch("vitals", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vitalsTrash: vitalsTrashid,
    }),
  }).then(function (response) {
    window.location.reload();
  });
}


issueTrash.forEach((button) => {
  button.addEventListener("click", deleteIssue);
});

function deleteIssue(e) {
  issueTrashid = e.currentTarget.dataset.id;
  fetch("issues", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      issueTrash: issueTrashid,
    }),
  }).then(function (response) {
    window.location.reload();
  });
}

responseTrash.forEach((button) => {
  button.addEventListener("click", deleteResponse);
});

function deleteResponse(e) {
  responseTrashid = e.currentTarget.dataset.id;
  fetch("responses", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      responseTrash: responseTrashid,
    }),
  }).then(function (response) {
    window.location.reload();
  });
}
