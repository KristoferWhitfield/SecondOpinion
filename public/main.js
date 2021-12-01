
var trash = document.getElementsByClassName("fas fa-trash-alt");

var issueTrash = document.getElementsByClassName("fas fa-trash");


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

Array.from(issueTrash).forEach(function (element) {
  element.addEventListener("click", function () {
    const date = this.parentNode.parentNode.childNodes[1].innerText;
    const description = this.parentNode.parentNode.childNodes[3].innerText;
    const imageData = this.parentNode.parentNode.childNodes[5].innerText;
    fetch("issues", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date,
        imageData: imageData,
        description: description,

      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});
