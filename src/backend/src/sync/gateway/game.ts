
import { Logger } from '@nestjs/common';
import { MoveEventDto } from '../dto/move.event.dio';
import { Engine, Bodies, Body, Events, World, Runner } from 'matter-js';

const WIDTH = 900;
const HEIGHT = 500;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 120;
const BALL_RADIUS = 10;
const BALL_SPEED = 7.5;
const PLAYER_SPEED = 2.69;
const GOALS_TO_WIN = 5;

export class Game {
  private readonly id: string;
  readonly player1Username: string;
  readonly player2Username: string;
  client1: any;
  client2: any;
  endGameCallback: any;
  private readonly logger = new Logger('GAME');
  
  private world;
  private engine;
  private runner;
  private ball;
  private player1;
  private player2;
  private score;
  private playersDir;
  private ballDir = {
    x: Math.cos(1) * BALL_SPEED,
    y: Math.sin(0.5) * BALL_SPEED,
  };



  constructor(clientsData: any) {
    this.id = clientsData.id;
    this.player1Username = clientsData.player1Username;
    this.player2Username = clientsData.player2Username;
    this.client1 = clientsData.client1;
    this.client2 = clientsData.client2;
    this.emitMatch(true, true);
    this.startGame();
  }
      
  startGame() { 
    this.createWorld();
    this.createWalls();
    this.createPlayers();
    this.createBall();
    this.handleEvents();
    this.score = {
      player1: 0,
      player2: 0,
    };
    this.playersDir = {
      player1: {
        up: false,
        down: false,
      },
      player2: {
        up: false,
        down: false,
      }
    };
  }

  updateGame() {
    const gameState: GameStateDto = {
      ball: {
        x: this.ball.position.x,
        y: this.ball.position.y,
      },
      player1: {
        x: this.player1.position.x,
        y: this.player1.position.y,
      },
      player2: {
        x: this.player2.position.x,
        y: this.player2.position.y,
      },
      score: this.score,
    };
    this.client1.emit('gameState', gameState);
    this.client2.emit('gameState', gameState);

  }

  updatePlayers() {
    if (this.playersDir.player1.up && this.player1.position.y - PADDLE_HEIGHT / 2 > 0) {
      Body.setPosition(this.player1, {
        x: this.player1.position.x,
        y: this.player1.position.y - PLAYER_SPEED,
      });
    } else if (this.playersDir.player1.down && this.player1.position.y + PADDLE_HEIGHT / 2 < HEIGHT) {
      Body.setPosition(this.player1, {
        x: this.player1.position.x,
        y: this.player1.position.y + PLAYER_SPEED,
      });
    }
    if (this.playersDir.player2.up && this.player2.position.y - PADDLE_HEIGHT / 2 > 0) {
      Body.setPosition(this.player2, {
        x: this.player2.position.x,
        y: this.player2.position.y - PLAYER_SPEED,
      });
    } else if (this.playersDir.player2.down && this.player2.position.y + PADDLE_HEIGHT / 2 < HEIGHT) {
      Body.setPosition(this.player2, {
        x: this.player2.position.x,
        y: this.player2.position.y + PLAYER_SPEED,
      });
    }

  }


  createBall() {
    const world = this.world;
    this.ball = Bodies.circle(450, 250, 20, {
      id: 5,
      mass: 0,
    });
    
    World.add(world, [this.ball]);
  }

  handleEvents() {
    const  engine = this.engine;


    // const dir = this.ballDir;
    let collide = 10;

    const updateBall = () => {
      Body.setVelocity(this.ball, this.ballDir);
      this.updatePlayers();
      this.updateGame();
    };
    // if the ball is colliding with the wall then change the direction
    Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs;

      pairs.forEach((pair: any) => {
        if (pair.bodyA.id == 1 || pair.bodyA.id == 2) {
          this.ballDir.y = -this.ballDir.y;
        } else if (pair.bodyA.id == 3 || pair.bodyA.id == 4) {
          this.ballDir.x = -this.ballDir.x;
        }
        
        // paddle and ball collision
        if (pair.bodyA.id == 5 && pair.bodyB.id == 6) {
          collide = (pair.bodyA.position.y - pair.bodyB.position.y) / (PADDLE_HEIGHT / 2);
          let angle = (Math.PI / 4) * collide;
          this.ballDir.x = Math.cos(angle) * BALL_SPEED;
          this.ballDir.y = Math.sin(angle) * BALL_SPEED;

        }
        if (pair.bodyA.id == 5 && pair.bodyB.id == 7) {
          collide = (pair.bodyA.position.y - pair.bodyB.position.y) / (PADDLE_HEIGHT / 2);
          let angle = (Math.PI / 4) * collide;
          this.ballDir.x = -Math.cos(angle) * BALL_SPEED;
          this.ballDir.y = Math.sin(angle) * BALL_SPEED;
        }
      });
    });


    Events.on(engine, 'collisionEnd', (event) => {

      const resetball = () => {
        Body.setPosition(this.ball, {
          x: 450,
          y: 250,
        });

        this.ballDir = {
          x: 0,
          y: 0,
        };

        const difScore = (this.score.player1 + this.score.player2) % 2;

        const ballDirs = [
          {
            x: Math.cos(1) * BALL_SPEED,
            y: Math.sin(0.75) * BALL_SPEED,
          },
          {
            x: -Math.cos(1) * BALL_SPEED,
            y: -Math.sin(0.75) * BALL_SPEED,
          },
        ]

        setTimeout(() => {
          this.client1.emit('gameMessage', '3');
          this.client2.emit('gameMessage', '3');
        }, 1000);

        setTimeout(() => {
          this.client1.emit('gameMessage', '2');
          this.client2.emit('gameMessage', '2');
        }, 2000);

        setTimeout(() => {
          this.client1.emit('gameMessage', '1');
          this.client2.emit('gameMessage', '1');
        }, 3000);

        setTimeout(() => {
          this.client1.emit('gameMessage', 'GO!');
          this.client2.emit('gameMessage', 'GO!');
        }, 4000);

        setTimeout(() => {
          this.client1.emit('gameMessage', '');
          this.client2.emit('gameMessage', '');
        }, 5500);

        setTimeout(() => { this.ballDir = ballDirs[difScore] }, 5000);
      };

      let pairs = event.pairs;
      pairs.forEach((pair: any) => {
        if (pair.bodyA.id == 3 && pair.bodyB.id == 5) {
          this.score.player2++;
          this.score.player2 < GOALS_TO_WIN && resetball();
        } else if (pair.bodyA.id == 4 && pair.bodyB.id == 5) {
          this.score.player1++;
          this.score.player1 < GOALS_TO_WIN && resetball();
        }
      });

      const p1 = this.score.player1;
      const p2 = this.score.player2;

      if (p1 >= GOALS_TO_WIN || p2 >= GOALS_TO_WIN) {
        
        this.client1.emit('gameMessage', `You ${p1 < p2 ? 'won' : 'lost'}`);
        this.client2.emit('gameMessage', `You ${p2 < p1 ? 'won' : 'lost'}`);
        this.client1.emit('endGame', { winner: p1 > p2 ? 1 : 2 });
        this.client2.emit('endGame', { winner: p2 > p1 ? 1 : 2 });
        this.endGameCallback(this.id);
      }
    });

    Events.on(engine, "beforeUpdate", updateBall);
  }

  createWalls() {
    const world = this.world;
    const wallThickness = 1;
    const walls = [
        Bodies.rectangle(WIDTH / 2, 0, WIDTH, wallThickness, {
            isStatic: true,
            id: 1,
        }),
        Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, wallThickness, {
            isStatic: true,
            id: 2,
        }),
        Bodies.rectangle(0, HEIGHT / 2, wallThickness, HEIGHT, {
            isStatic: true,
            id: 3,
        }),
        Bodies.rectangle(WIDTH, HEIGHT / 2, wallThickness, HEIGHT, {
          isStatic: true,
          id: 4,
        }),
    ];

    World.add(world, walls);
  }

  createPlayers() {
    this.player1 = Bodies.rectangle(PADDLE_WIDTH / 2, HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT, {
      id: 6,
      mass: 100,
      isStatic: true,
    });
    this.player2 = Bodies.rectangle(WIDTH - PADDLE_WIDTH / 2, HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT, {
      id: 7,
      mass: 100,
      isStatic: true,
    });

    World.add(this.world, [this.player1, this.player2]);
  }

  createWorld() {
    const engine = Engine.create({
      gravity: {
        x: 0,
        y: 0,
        scale: 0,
      },
    });
    const world = engine.world;
    const runner = Runner.create();

    Runner.run(runner, engine);


    this.engine = engine;
    this.runner = runner;
    this.world = world;
  }

  move(client: any, move) {
    if (client === this.client1) {
      this.playersDir.player1.up = move.up;
      this.playersDir.player1.down = move.down;
    } else if (client === this.client2) {
      this.playersDir.player2.up = move.up;
      this.playersDir.player2.down = move.down;
    }
  }


  emitMatch(isClient1: boolean, isClient2: boolean) {
    isClient1 && this.client1
      .emit('match', {
        roomName: this.id,
        player: 1,
        opponentName: this.player2Username,
      });
    isClient2 && this.client2
      .emit('match', {
        roomName: this.id,
        player: 2,
        opponentName: this.player1Username,
      });
    this.logger.log(`${this.player1Username} X ${this.player2Username}`);
  }

  emitter(client: any, data: MoveEventDto): void {
    this.client1.emit('move', data);
    this.client2.emit('move', data);
    if (client === this.client1) {
      this.logger.log(`Player 1 '${this.player1Username}' moved`);
    } else {
      this.logger.log(`Player 2 '${this.player2Username}' moved`);
    }
  }

  reconnectPlayer(username: string, client: any): void {
    if (username === this.player1Username) {
      this.client1 = client;
    } else if (username === this.player2Username) {
      this.client2 = client;
    }
    this.emitMatch(username === this.player1Username, username === this.player2Username);
  }

  stopGame() {
    Events.off(this.engine, "collisionStart");
    Events.off(this.engine, "beforeUpdate");
    this.runner.stop();
    World.clear(this.world);
    Engine.clear(this.engine);
    this.logger.log(`Match '${this.id}' ended`);
  }
}
