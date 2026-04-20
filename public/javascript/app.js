async function loadDashboard() {
  const res = await fetch("api/dashboard");
  const data = await res.json();
  console.log(data);

  const appDiv = document.getElementById("app");
  appDiv.innerHTML = "";

  data.feed.forEach(element => {
    const topicDiv = document.createElement("div");
    topicDiv.innerHTML = `
    <h2>${element.topic.name}</h2>
    <p>${element.messages.map(m => `<p>${m.body}</p>`).join("")}</p>
    `;

    appDiv.appendChild(topicDiv);

  });
}

loadDashboard();