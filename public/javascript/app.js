async function loadDashboard() {
  try {
    const res = await fetch("/api/dashboard");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);

    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "";

    data.feed.forEach((element) => {
      const topicDiv = document.createElement("div");
      topicDiv.innerHTML = `
      <h2>${element.topic.name}</h2>
      <p>${element.messages.map((m) => `<p>${m.body}</p>`).join("")}</p>
      `;

      appDiv.appendChild(topicDiv);
    });
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
}

loadDashboard();
