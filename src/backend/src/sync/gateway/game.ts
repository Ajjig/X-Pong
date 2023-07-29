
import { Logger } from '@nestjs/common';
import { MoveEventDto } from '../dto/move.event.dio';
import { Engine, Bodies, Body, Events, World, Runner } from 'matter-js';

const WIDTH = 900;
const HEIGHT = 500;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const BALL_SPEED = 5;

type GameState = {
  ball: {
      x: number;
      y: number;
  };
  player1: {
      x: number;
      y: number;
  };
  player2: {
      x: number;
      y: number;
  };
};


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
    this.updateGame();
  }

  updateGame() {

    const { engine, world }: any = { engine: this.engine, world: this.world };

    Engine.update(engine, 1000 / 60);
    const gameState: GameState = {
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
    };
    this.client1.emit('gameState', gameState);
   
    console.log('\x1B[2J\x1B[0f');
    console.log(gameState);

  }

  createBall() {
    const { engine, world }: any = { engine: this.engine, world: this.world };

    this.ball = Bodies.circle(450, 250, 20, {
        id: 5,
        mass: 0,
    });
    const ball = this.ball;

    World.add(world, [ball]);

    const speed = 10;
    let dir = {
        x: Math.cos(1) * speed,
        y: Math.sin(0) * speed,
    };
    let collide = 10;

    const updateBall = () => {
        Body.setVelocity(ball, dir);
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

    // change the color of the walls
    walls.forEach((wall) => {
        wall.render.fillStyle = "transparent";
        wall.render.strokeStyle = "transparent";
    });

    World.add(world, walls);
  }

  createPlayers() {
    this.player1 = Bodies.rectangle(50, HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT, {
      id: 6,
      mass: 100,
    });
    this.player2 = Bodies.rectangle(WIDTH - 50, HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT, {
      id: 7,
      mass: 100,
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
}
