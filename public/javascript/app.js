document.addEventListener("DOMContentLoaded", function () {
  console.log("Frontend loaded successfully!");
});

const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", function (event) {
    const textArea = form.querySelector("textarea");

    if (textArea && textArea.value.trim() === "") {
      event.preventDefault();
      alert("Message cannot be empty!");
    }
  });
}
