export function getFourDivs(element, id) {
  let wall = element.parentElement;
  let nextWall = wall.nextElementSibling;
  let prevWall = wall.previousElementSibling;

  let wallNodeList = wall.querySelectorAll(".brick");
  let nextWallNodeList = nextWall.querySelectorAll(".brick");
  let prevWallNodeList = prevWall.querySelectorAll(".brick");
  let index = getDivIndex(wallNodeList, id);

  let rightDiv = element.nextElementSibling;
  let leftDiv = element.previousElementSibling;
  let topDiv = prevWallNodeList[index];
  let bottomDiv = nextWallNodeList[index];

  let bombRange = [element, topDiv, rightDiv, bottomDiv, leftDiv];
  return bombRange;
}
// get the bomb index
function getDivIndex(wall, id) {
  let index;
  let element = document.getElementById(id);
  let parent = element.parentElement;
  parent.setAttribute("here", "this-one");
  parent.classList.add("solid");

  // Now you can access each element by index
  wall.forEach((element, divIndex) => {
    if (element.hasAttribute("here")) {
      index = divIndex;
      element.removeAttribute("here");
    }
  });
  return index;
}

// Get all the bricks in the horizontal range:
function getHorizontalBricks(element, direction = "left") {
  let bricks = document.querySelectorAll(".solid");
  let position = getPosition(element);
  let elements = [];
  bricks.forEach((brick) => {
    let hinder = getPosition(brick);
    if (
      position.top > hinder.top - position.height &&
      position.bottom < hinder.bottom + position.height
    ) {
      if (direction === "left" && position.left > hinder.right) {
        elements.push(hinder);
      } else if (direction === "right" && position.right < hinder.left) {
        elements.push(hinder);
      }
    }
  });
  return elements;
}
function getVerticalBricks(element, direction = "down") {
  let bricks = document.querySelectorAll(".solid");
  let position = getPosition(element);
  let elements = [];
  bricks.forEach((brick) => {
    let hinder = getPosition(brick);
    if (
      position.right < hinder.right + position.width &&
      position.left > hinder.left - position.width
    ) {
      if (direction === "down" && position.bottom < hinder.top) {
        elements.push(hinder);
      } else if (direction === "up" && position.top > hinder.bottom) {
        elements.push(hinder);
      }
    }
  });
  return elements;
}

export function canMoveVertically(element, direction = "down") {
  let can = true;
  let elements = getVerticalBricks(element, direction);
  let position = getPosition(element);
  elements.forEach((element) => {
    if (direction === "up") {
      if (position.top - 3 < element.bottom) {
        can = false;
      }
    } else {
      if (position.bottom + 3 > element.top) {
        can = false;
      }
    }
  });
  return can;
}

export function canMoveHorizontally(element, direction = "left") {
  let can = true;
  let elements = getHorizontalBricks(element, direction);
  let position = getPosition(element);
  elements.forEach((element) => {
    if (direction === "right") {
      if (!(position.right + 3 < element.left)) {
        can = false;
      }
    } else {
      if (!(position.left - 3 > element.right)) {
        can = false;
      }
    }
  });
  return can;
}

export function bringElementAxis(element) {
  let obj = {};
  let position = getPosition(element);
  obj.x = Math.floor(position.x + position.width / 2);
  obj.y = Math.floor(position.y + position.height / 2);
  return obj;
}
export function isCollistion(target1, targetElement, width) {
  let dead = false;
  let targetCoordinates = getPosition(targetElement);
  let target1Coordinates = getPosition(target1);
  let targetAxis = bringElementAxis(targetElement);
  let target1Axix = bringElementAxis(target1);
  if (
    isCoixial(targetCoordinates, target1Axix, "y") &&
    targetAxis.y < target1Axix.y &&
    targetCoordinates.bottom + width > target1Coordinates.top
  ) {
    // hero.style.display = "none";
    dead = true;
  }

  // top
  if (
    isCoixial(targetCoordinates, target1Axix, "y") &&
    targetAxis.y > target1Axix.y &&
    targetCoordinates.top - width < target1Coordinates.bottom
  ) {
    // hero.style.display = "none";
    dead = true;
  }
  // right
  if (
    isCoixial(targetCoordinates, target1Axix, "x") &&
    targetCoordinates.right + width > target1Coordinates.left &&
    targetAxis.x < target1Axix.x
  ) {
    // hero.style.display = "none";
    dead = true;
  }

  //left
  if (
    isCoixial(targetCoordinates, target1Axix, "x") &&
    targetCoordinates.left - width < target1Coordinates.right &&
    target1Axix.x < targetAxis.x
  ) {
    dead = true;
  }
  return dead;
}
function isCoixial(coordes, axis, direction) {
  let coixial = false;
  switch (direction) {
    case "y":
      if (axis.x >= coordes.left && axis.x <= coordes.right) {
        coixial = true;
      }
      break;

    case "x":
      if (axis.y >= coordes.top && axis.y <= coordes.bottom) {
        coixial = true;
      }
      break;
  }

  return coixial;
}

// Create a function  to generate the story of the game:
export function generate_game_story(source_index, callback = null) {
  let body = document.body;

  let story = document.createElement("div");
  story.id = "story";

  let text = document.createElement("p");
  text.setAttribute("id", "story_text");

  let img_story = document.createElement("img");
  img_story.setAttribute("id", "story_text");

  const paragraphs = [
    [
      "The year is 3087. Far beyond the Milky Way...",
      "One dark night, space raiders from a rival galaxy steal the Core...",
      "You are Zylo, a young alien tasked with a desperate mission...",
      "Board your hovercraft, navigate the cosmic fields and chase down the raiders!",
    ],
    [
      "After countless battles and narrow escapes, Zylo picks up a distress signal.",
      'It’s a transmission from a captured Zeloran elder, revealing the raiders hideout hidden inside a massive asteroid belt called the "Crimson Thorns."',
      "However, it’s a trap: the path is filled with deadly drones and collapsing meteors!",
      "Zylo must stay sharp, push forward, and reach the Core before the last light of Zelora fades.",
    ],
    [
      "Against all odds, Zylo defeats the raider leader and seizes back the Core of Life.",
      "Returning to Zelora, Zylo restores the Core to its sacred temple.",
      "Slowly, life blooms again, and the skies turn from a dull gray to vibrant colors.",
      "Zylo becomes a hero, and a new age of peace begins — thanks to your bravery!",
    ],
    [
      "The last flicker of Zelora's energy dies out as the Core remains in enemy hands.",
      "The once-lush planet becomes a barren wasteland, its people scattered among the stars.",
      "Zylo's mission ends in silence... but legends say another hero may one day rise to finish what was started.",
    ],
  ];

  const images = [
    "../img/start_story_img.png",
    "../img/mid_story_img.png",
    "../img/win_story_img.png",
    "../img/lose_story_img.png",
  ];

  text.textContent = paragraphs[source_index][0];
  img_story.src = images[source_index];
  story.append(text, img_story);

  body.appendChild(story);

  let index = 1;
  const interval = setInterval(() => {
    if (index < paragraphs.length) {
      text.textContent = paragraphs[source_index][index];
      index++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        story.remove();
        if (typeof callback == "function") {
          callback();
        }
      }, 200);
    }
  }, 5000);
}

// handle score:
export function handleScore(score) {
  console.log(score , "scoore");
  let form =document.getElementById("user_score_form")
  if (form == null ){
    let score_form = document.createElement("form");
    score_form.setAttribute("id", "user_score_form");
    score_form.innerHTML = `
      <input id="user_score_input" type="text" placeholder="Enter your username">
      <input id="user_score_submit" type="submit">
      `;
    document.body.appendChild(score_form);
    let obj = {};
    score_form.addEventListener("submit", async (e) => {
  
      e.preventDefault();
      var user_name = document.getElementById("user_score_input").value;
      obj.name = user_name;
      obj.score = score;
   console.log(obj , "obj");
   
      try {
        let res = await fetch("http://localhost:5051/api/scores", {
          method: "POST",
          body: JSON.stringify(obj),
        });
        if (!res.ok) {
          let err = {
            code: res.status || 500,
            message: res.statusText || "internal server error",
          }
          throw err
        }
        let response = await res.json();
      
        score_form.remove()
        showscores(response , 5)
      } catch (err) {
  
        
        renderErrorPage(err)
      }
    });
  }
 
}
function showscores(data, rowsPerPage = 5) {
  let board = document.createElement("div");
  board.className = "board";

  let table = document.createElement("table");
  table.className = "score-table";

  const headers = ["Rank", "Name", "Score", "Time"];
  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");

  headers.forEach(text => {
    let th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  let tbody = document.createElement("tbody");
  table.appendChild(tbody);
  board.appendChild(table);

  let pagination = document.createElement("div");
  pagination.className = "pagination";

  let currentPage = 1;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  function ordinal(n) {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return `${n}th`;
  }

  function renderPage(page) {
    tbody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, data.length);

    const pageData = data.slice(start, end);

    pageData.forEach((entry, index) => {
      let row = document.createElement("tr");

      const absoluteIndex = start + index + 1;
      let timeOnly = entry.time.split(" ")[1].slice(0, 5);
      const rowData = [ordinal(absoluteIndex), entry.name, entry.score, timeOnly];

      rowData.forEach(text => {
        let td = document.createElement("td");
        td.textContent = text;
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });

    updatePagination();
  }

  function updatePagination() {
    pagination.innerHTML = "";

    let prev = document.createElement("button");
    prev.textContent = "Previous";
    prev.disabled = currentPage === 1;
    prev.onclick = () => {
      currentPage--;
      renderPage(currentPage);
    };

    let next = document.createElement("button");
    next.textContent = "Next";
    next.disabled = currentPage === totalPages;
    next.onclick = () => {
      currentPage++;
      renderPage(currentPage);
    };

    let info = document.createElement("span");
    info.textContent = ` Page ${currentPage} of ${totalPages} `;

    pagination.appendChild(prev);
    pagination.appendChild(info);
    pagination.appendChild(next);
  }

  board.appendChild(pagination);
  document.body.appendChild(board);

  renderPage(currentPage);
}
function renderErrorPage(error_obj) {
  console.log(error_obj , "245");
  
  document.body.innerHTML = "";

  let error_container = document.createElement("div");
  error_container.id = "error_container";
  error_container.style.textAlign = "center";
  error_container.style.marginTop = "20vh";
  error_container.style.fontFamily = "Arial, sans-serif";

  error_container.innerHTML = `
    <h1 style="color: red;">${error_obj.code}</h1>
    <p>${error_obj.message}</p>
    <button id="reloadBtn" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">
      Back home
    </button>
  `;

  document.body.appendChild(error_container);

  // Add reload functionality
  document.getElementById("reloadBtn").onclick = () => location.reload();
}



export const getPosition = (element) => element.getBoundingClientRect();
