// DOM Elements
const cheatsList = document.getElementById("cheats");
const cheatsSection = document.getElementById("cheats-list");
const formSection = document.getElementById("form-section");
const moreSection = document.getElementById("more-section");
const submitBtn = document.getElementById("submit-btn");
const moreBtn = document.getElementById("more-btn");
const sendBtn = document.getElementById("send-btn");
const copyBtn = document.getElementById("copy-btn");
const cancelBtn = document.getElementById("cancel-btn");
const moreCancelBtn = document.getElementById("more-cancel-btn");
const searchField = document.getElementById("search-field");
const sortOptions = document.getElementById("sort-options");

let cheatsData = [];

// Fetch and render cheats
fetch("https://raw.githubusercontent.com/Szmelc-INC/Cheats/main/data.json")
  .then(response => response.json())
  .then(data => {
    cheatsData = data.cheatcodes;
    renderCheats(cheatsData);
  })
  .catch(err => console.error("Error fetching cheats:", err));

// Render cheats based on data
function renderCheats(cheats) {
  cheatsList.innerHTML = "";
  cheats.forEach(cheat => {
    const li = document.createElement("li");
    li.className = "cheat-item";
    li.innerHTML = `
      <h1>${cheat.code}</h1>
      <p>${cheat.desc}</p>
      <div class="command-container">
        <pre>${cheat.command}</pre>
        <button class="copy-btn" aria-label="Copy Command">Copy</button>
      </div>
    `;
    cheatsList.appendChild(li);
  });

  // Add event listeners to "Copy" buttons
  document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", handleCopy);
  });
}

// Handle Copy Button Click for cheats list
function handleCopy(event) {
  const command = event.target.previousElementSibling.textContent;

  navigator.clipboard.writeText(command)
    .then(() => {
      const originalText = event.target.textContent;
      event.target.textContent = "Copied!";
      setTimeout(() => {
        event.target.textContent = originalText;
      }, 2000); // Revert text after 2 seconds
    })
    .catch(err => console.error("Failed to copy command:", err));
}

// Show form and hide cheats
submitBtn.addEventListener("click", () => {
  cheatsSection.classList.add("hidden"); // Hide cheats section
  formSection.classList.remove("hidden"); // Show form section
});

// Show more info and hide cheats
moreBtn.addEventListener("click", () => {
  cheatsSection.classList.add("hidden"); // Hide cheats section
  moreSection.classList.remove("hidden"); // Show more info section
});

// Cancel form and return to cheats
cancelBtn.addEventListener("click", () => {
  formSection.classList.add("hidden"); // Hide form section
  cheatsSection.classList.remove("hidden"); // Show cheats section
});

// Close more info and return to cheats
moreCancelBtn.addEventListener("click", () => {
  moreSection.classList.add("hidden"); // Hide more info section
  cheatsSection.classList.remove("hidden"); // Show cheats section
});

// Handle form submission (Send)
sendBtn.addEventListener("click", () => {
  const code = document.getElementById("cheat-code").value.trim();
  const command = document.getElementById("cheat-command").value.trim();
  const desc = document.getElementById("cheat-desc").value.trim();

  // Validate fields
  if (!code || !command || !desc) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  // Construct mailto link with proper formatting
  const subject = encodeURIComponent("New Cheat Submission");
  const body = encodeURIComponent(
    `Cheat Code:\n${code}\n\nCommand:\n${command}\n\nDescription:\n${desc}`
  );
  const mailto = `mailto:your-email@example.com?subject=${subject}&body=${body}`;

  // Open email client with the constructed mailto link
  window.location.href = mailto;

  // Clear form and hide it
  document.getElementById("submit-form").reset();
  formSection.classList.add("hidden");
  cheatsSection.classList.remove("hidden");
});

// Handle "Copy" Button Click for form
copyBtn.addEventListener("click", () => {
  const code = document.getElementById("cheat-code").value.trim();
  const command = document.getElementById("cheat-command").value.trim();
  const desc = document.getElementById("cheat-desc").value.trim();

  // Validate fields
  if (!code || !command || !desc) {
    alert("Please fill out all fields before copying.");
    return;
  }

  // Format the content for clipboard
  const clipboardContent = `Cheat Code:\n${code}\n\nCommand:\n${command}\n\nDescription:\n${desc}`;

  // Copy to clipboard
  navigator.clipboard.writeText(clipboardContent)
    .then(() => {
      alert("Data copied to clipboard. Send it to szmelcinc@gmail.com");
    })
    .catch(err => {
      console.error("Failed to copy to clipboard: ", err);
      alert("Failed to copy to clipboard. Please try again.");
    });
});

// Search functionality
searchField.addEventListener("input", () => {
  const query = searchField.value.toLowerCase();
  const filteredCheats = cheatsData.filter(cheat =>
    cheat.code.toLowerCase().includes(query) ||
    cheat.desc.toLowerCase().includes(query) ||
    cheat.command.toLowerCase().includes(query)
  );
  renderCheats(filteredCheats);
});

// Sorting functionality
sortOptions.addEventListener("change", () => {
  const sortBy = sortOptions.value;

  let sortedCheats;
  if (sortBy === "newest") {
    sortedCheats = [...cheatsData].reverse(); // Newest cheats at the top
  } else if (sortBy === "alphabetically") {
    sortedCheats = [...cheatsData].sort((a, b) =>
      a.code.localeCompare(b.code)
    );
  }

  renderCheats(sortedCheats);
});
