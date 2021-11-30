
var trash = document.getElementsByClassName("fas fa-trash-alt");


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
