import { Enemy } from "./enemies.js";
import { Field } from "./field.js";
import { Hero } from "./hero.js";
import { handleScore, generate_game_story } from "./healpers.js";

class Control {
  constructor(stage, score) {
    this.stage = stage;
    this.score = score;
    this.gameStatus = "initial";
    this.controller = null;
    this.pausebtn = null;
    this.restartbtn = null;
    this.resumebtn = null;
    this.startbtn = null;
    this.leftTime = 500;
    this.intervalId = null;
    this.counter = null;
    this.attemps = 3;
    this.isPaused = false;
    this.enemies = [];
  }

  createBoard() {
    const screenWidth = window.innerWidth;
    // Calculate a responsive unit size based on window width
    let unitSize = screenWidth * 0.02;
    unitSize = Math.max(20, Math.min(unitSize, 80));
    let controller = document.createElement("div");
    controller.setAttribute("id", "controller");
    controller.style.width = `${unitSize * 15}px`;
    let title = document.createElement("h1");
    let btnsContainer = document.createElement("div");
    btnsContainer.setAttribute("id", "btns_container");
    let start = document.createElement("button");
    let restart = document.createElement("button");
    let resume = document.createElement("button");
    let pause = document.createElement("button");
    // Add value to my buttons:
    start.value = "start";
    restart.value = "restart";
    resume.value = "resume";
    pause.value = "pause";
    // Add text content to my btns
    title.textContent = "Bomberman";
    start.textContent = "start";
    restart.textContent = "restart";
    resume.textContent = "resume";
    pause.textContent = "pause";
    // set atributes
    title.setAttribute("class", "title");
    title.setAttribute("id", "title");
    start.setAttribute("class", "controlBtn");
    restart.setAttribute("class", "controlBtn");

    resume.setAttribute("class", "controlBtn");
    pause.setAttribute("class", "controlBtn");
    restart.setAttribute("id", "restartBtn");
    pause.setAttribute("id", "pauseBtn");
    resume.setAttribute("id", "resumeBtn");
    btnsContainer.append(start, restart, resume, pause);
    controller.append(title, btnsContainer);
    controller.classList.add("show");
    document.body.appendChild(controller);
    // hide the buttons that should:
    if (this.gameStatus === "initial") {
      restart.classList.add("hidden");
      resume.classList.add("hidden");
      pause.classList.add("hidden");
      restart.classList.remove("show");
      resume.classList.remove("show");
      pause.classList.remove("show");
    } else {
      start.classList.remove("show");
      start.classList.add("hidden");
      restart.classList.remove("hidden");
      resume.classList.remove("hidden");
      pause.classList.remove("hidden");
      restart.classList.add("show");
      resume.classList.add("show");
      pause.classList.add("show");
      startTimer;
    }
    this.controller = controller;
    this.pausebtn = pause;
    this.restartbtn = restart;
    this.startbtn = start;
    this.resumebtn = resume;
  }

  startTimer() {
    if (this.intervalId !== null) return; // Don't start a new timer if one is running

    this.intervalId = setInterval(() => {
      this.counter.textContent = this.leftTime;
      this.leftTime--;
      if (this.leftTime < 0) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.counter.textContent = "0";
        let popup = document.createElement("div");
        popup.setAttribute("id", "popup");
        popup.classList.add("show");
        popup.textContent = "Time is up!!!";
        document.body.appendChild(popup);
        this.pausebtn.classList.add("dead");
        this.pausebtn.click();
        setTimeout(() => {
          popup.style.display = "none";
        }, 3000);
      }
    }, 1000);
  }

  pauseTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isPaused = true;
    }
  }

  resumeTimer() {
    if (this.isPaused && this.intervalId === null) {
      this.isPaused = false;
      this.startTimer();
    }
  }

  gameController() {
    if (this.gameStatus === "initial") {
      generate_game_story(0);

      // This will only run AFTER the story is done
      this.createBoard();

      this.gameStatus = "started";

      this.setupGame(); // Create fields, hero, enemies, etc.
    }
  }

  setupGame() {
    const screenWidth = window.innerWidth;
    let unitSize = screenWidth * 0.02;
    unitSize = Math.max(20, Math.min(unitSize, 80));

    let field = new Field(unitSize, this.stage);
    let hero = new Hero(unitSize);

    let controlBtns = document.querySelectorAll(".controlBtn");

    controlBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.value === "start") {
          // document.body.innerHTML = ""
          let story = document.getElementById("story");
          if (story) {
            story.remove();
          }
          this.pausebtn.classList.remove("hidden");
          this.pausebtn.classList.add("show");
          this.startbtn.classList.remove("show");
          this.startbtn.classList.add("hidden");

          field.CreateBattleField();
          this.counter = document.getElementById("timeCounter");
          hero.createHero();
          hero.moveHero();

          let randomIds = field.randomEnemies;
          randomIds.forEach((id) => {
            let enemy = new Enemy(id, field.width);
            enemy.createEnemy();
            enemy.moveEnemy();
            this.enemies.push(enemy);
          });

          this.startTimer();
        } else if (e.target.value === "restart") {
          location.reload();
        } else if (e.target.value === "resume") {
          this.resumeTimer();
          this.pausebtn.classList.remove("hidden");
          this.pausebtn.classList.add("show");
          this.restartbtn.classList.remove("show");
          this.resumebtn.classList.remove("show");
          this.restartbtn.classList.add("hidden");
          this.resumebtn.classList.add("hidden");

          hero.pause = false;
          this.enemies.forEach((enemy) => {
            enemy.resumeAnimation();
          });
        } else if (e.target.value === "pause") {
          this.pauseTimer();
          this.pausebtn.classList.remove("show");
          this.pausebtn.classList.add("hidden");
          this.restartbtn.classList.add("show");
          this.resumebtn.classList.add("show");
          this.restartbtn.classList.remove("hidden");
          this.resumebtn.classList.remove("hidden");
          if (this.pausebtn.classList.contains("dead")) {
            this.attemps--;
            hero.x = 0;
            hero.y = 0;
            this.pausebtn.classList.remove("dead");
            if (this.attemps <= 0) {
              let popup = document.createElement("div");
              popup.setAttribute("id", "popup");
              popup.classList.add("show");
              popup.textContent = "Game over!!";
              document.body.appendChild(popup);
             
              let score = document.getElementById("score").innerText;

              let score_number = parseInt(score, 10);

              setTimeout(() => {
                document.body.innerHTML = "";
                document.body.append(this.controller)
                this.resumebtn.classList.remove("show");
                this.resumebtn.classList.add("hidden");
                generate_game_story(3, () => {
                  handleScore(score_number);
                });
              }, 500);
            }
          }

          hero.pause = true;
          console.log("The left time ===>>", this.leftTime);

          this.enemies.forEach((enemy) => {
            enemy.pauseAnimation();
          });
        } else {
          console.log("Wrong choice!!!");
        }
      });
    });
  }
}

let controller = new Control(1, 0);

controller.gameController();
