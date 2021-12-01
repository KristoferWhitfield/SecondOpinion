var trash = document.getElementsByClassName("fas fa-trash-alt");

let issueTrash = document.querySelectorAll(".deleteIssues");

let responseTrash = document.querySelectorAll(".deleteResponses");

Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    const date = this.parentNode.parentNode.childNodes[1].innerText;
    const weight = this.parentNode.parentNode.childNodes[3].innerText;
    const height = this.parentNode.parentNode.childNodes[5].innerText;
    const bp = this.parentNode.parentNode.childNodes[7].innerText;
    const pulse = this.parentNode.parentNode.childNodes[9].innerText;
    fetch("vitals", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        weight: weight,
        height: height,
        bp: bp,
        pulse: pulse,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});

issueTrash.forEach((button) => {
  button.addEventListener("click", deleteIssue);
});

function deleteIssue(e) {
  issueTrashid = e.currentTarget.dataset.id;
  console.log(issueTrashid, "issueId");
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
// Array.from(issueTrash).forEach(function (element) {
//   element.addEventListener("click", function () {
//
//     fetch("issues", {
//       method: "delete",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user: req.user._id
//
//       }),
//     }).then(function (response) {
//       window.location.reload();
//     });
//   });
// });
