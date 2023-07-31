
import { Logger } from '@nestjs/common';
import { MoveEventDto } from '../dto/move.event.dio';
import { Engine, Bodies, Body, Events, World, Runner } from 'matter-js';

const WIDTH = 900;
const HEIGHT = 500;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 120;
const BALL_RADIUS = 10;
const BALL_SPEED = 5;
const PLAYER_SPEED = 2.69;

export class Game {
  private readonly id: string;
  private readonly player1Username: string;
  private readonly player2Username: string;
  private readonly client1: any;
  private readonly client2: any;
  private readonly logger = new Logger('GAME');
  
  private world;
  private engine;
  private runner;
  private ball;
  private player1;
  private player2;
  private score;
  private dir;

  private scoreTime = new Date();


  constructor(clientsData: any) {
    this.id = clientsData.id;
    this.player1Username = clientsData.player1Username;
    this.player2Username = clientsData.player2Username;
    this.client1 = clientsData.client1;
    this.client2 = clientsData.client2;
    this.emitMatch();
    this.startGame();
  }
      
  startGame() { 
    this.createWorld();
    this.createWalls();
    this.createPlayers();
    this.createBall();
    this.score = {
      player1: 0,
      player2: 0,
    };
    this.dir = {
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

    const world = this.world ;

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

    // console.log('\x1B[2J\x1B[0f');
    // const wallsPos = {
    //   top: world.bodies[0].position.y,
    //   bottom: world.bodies[1].position.y,
    //   left: world.bodies[2].position.x,
    //   right: world.bodies[3].position.x,
    // };
    // console.log(gameState);
    // console.log(wallsPos);
  }

  updatePlayers() {
    if (this.dir.player1.up && this.player1.position.y - PADDLE_HEIGHT / 2 > 0) {
      Body.setPosition(this.player1, {
        x: this.player1.position.x,
        y: this.player1.position.y - PLAYER_SPEED,
      });
    } else if (this.dir.player1.down && this.player1.position.y + PADDLE_HEIGHT / 2 < HEIGHT) {
      Body.setPosition(this.player1, {
        x: this.player1.position.x,
        y: this.player1.position.y + PLAYER_SPEED,
      });
    }
    if (this.dir.player2.up && this.player2.position.y - PADDLE_HEIGHT / 2 > 0) {
      Body.setPosition(this.player2, {
        x: this.player2.position.x,
        y: this.player2.position.y - PLAYER_SPEED,
      });
    } else if (this.dir.player2.down && this.player2.position.y + PADDLE_HEIGHT / 2 < HEIGHT) {
      Body.setPosition(this.player2, {
        x: this.player2.position.x,
        y: this.player2.position.y + PLAYER_SPEED,
      });
    }

  }

  createBall() {
    const { engine, world }: any = { engine: this.engine, world: this.world };

    this.ball = Bodies.circle(450, 250, 20, {
        id: 5,
        mass: 0,
    });
  
    const ball = this.ball;

    World.add(world, [ball]);

    const speed = 7.5;
    let dir = {
        x: Math.cos(1) * speed,
        y: Math.sin(0.5) * speed,
    };
    let collide = 10;

    const updateBall = () => {
      Body.setVelocity(ball, dir);
      this.updatePlayers();
      this.updateGame();
    };
    // if the ball is colliding with the wall then change the direction
    Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs;

      pairs.forEach((pair: any) => {
        if (pair.bodyA.id == 1 || pair.bodyA.id == 2) {
          dir.y = -dir.y;
        } else if (pair.bodyA.id == 3 || pair.bodyA.id == 4) {
          dir.x = -dir.x;
        }
        
        // paddle and ball collision
        if (pair.bodyA.id == 5 && pair.bodyB.id == 6) {
          collide = (pair.bodyA.position.y - pair.bodyB.position.y) / (PADDLE_HEIGHT / 2);
          let angle = (Math.PI / 4) * collide;
          dir.x = Math.cos(angle) * speed;
          dir.y = Math.sin(angle) * speed;

        }
        if (pair.bodyA.id == 5 && pair.bodyB.id == 7) {
          collide = (pair.bodyA.position.y - pair.bodyB.position.y) / (PADDLE_HEIGHT / 2);
          let angle = (Math.PI / 4) * collide;
          dir.x = -Math.cos(angle) * speed;
          dir.y = Math.sin(angle) * speed;
        }
      });
    });


    Events.on(engine, 'collisionEnd', (event) => {

      if (new Date().getTime() - this.scoreTime.getTime() < 1000) {
        return;
      }
      let pairs = event.pairs;
      pairs.forEach((pair: any) => {
        if (pair.bodyA.id == 3 && pair.bodyB.id == 5) {
          this.score.player2++;
          this.scoreTime = new Date();
        } else if (pair.bodyA.id == 4 && pair.bodyB.id == 5) {
          this.score.player1++;
          this.scoreTime = new Date();
        }
      });
    });

    Events.on(engine, "beforeUpdate", updateBall);
  }

  createWalls() {
    const { engine, world }: any = { engine: this.engine, world: this.world };

    let walls: any[];

    let wallThickness = 1;

    walls = [
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
      this.dir.player1.up = move.up;
      this.dir.player1.down = move.down;
    } else if (client === this.client2) {
      this.dir.player2.up = move.up;
      this.dir.player2.down = move.down;
    }
  }


  emitMatch() {
    this.client1
      .emit('match', {
        roomName: this.id,
        player: 1,
        opponentName: this.player2Username,
      });
    this.client2
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

  stopGame() {
    Runner.stop(this.runner);
    World.clear(this.world, false);
    Engine.clear(this.engine);
    Events.off(this.engine, "collisionStart");
    Events.off(this.engine, "beforeUpdate");
    this.client1.removeAllListeners();
    this.client2.removeAllListeners();
  }
}
