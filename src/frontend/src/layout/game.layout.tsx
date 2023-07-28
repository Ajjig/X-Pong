import { Box, Container, useMantineTheme } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import HeaderDashboard from "../Components/header";
import store, { setProfile } from "@/store/store";
import api from "@/api";
import { Loading } from "@/Components/loading/loading";
import Matter from "matter-js";

interface props {}

export function GameLayout({}: props) {
    const HeaderRef = React.useRef(null);
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const worldRef = useRef<Matter.World>();
    const engineRef = useRef<Matter.Engine>();
    const runnerRef = useRef<Matter.Runner>();
    const playerRef = useRef<{
        body: Matter.Body;
        width: number;
        height: number;
    }>();
    const [fps, fpsSet] = useState(0);

    const { Bodies, Engine, Events, Mouse, MouseConstraint, Render, Runner, World, Composite } = Matter;

    function createWorld() {
        const engine = Engine.create({
            gravity: {
                x: 0,
                y: 0,
                scale: 0,
            },
        });
        const world = engine.world;
        const runner = Runner.create();
        const render = Render.create({
            canvas: canvasRef.current ?? undefined,
            engine: engine,
            options: {
                width: 900,
                height: 500,
                wireframes: false,
                background: theme.colors.cos_black[0],
            },
        });

        Render.run(render);
        Runner.run(runner, engine);

        engineRef.current = engine;
        runnerRef.current = runner;
        worldRef.current = world;
    }

    function createWalls() {
        const { engine, world }: any = { engine: engineRef.current, world: worldRef.current };

        let walls: any[];

        if (!canvasRef.current) return;

        let wallThickness = 1;

        walls = [
            Bodies.rectangle(canvasRef.current.width / 2, 0, canvasRef.current.width, wallThickness, {
                isStatic: true,
                id: 1,
            }),
            Bodies.rectangle(canvasRef.current.width / 2, canvasRef.current.height, canvasRef.current.width, wallThickness, {
                isStatic: true,
                id: 2,
            }),
            Bodies.rectangle(0, canvasRef.current.height / 2, wallThickness, canvasRef.current.height, {
                isStatic: true,
                id: 3,
            }),
            Bodies.rectangle(canvasRef.current.width, canvasRef.current.height / 2, wallThickness, canvasRef.current.height, {
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

    function createBall() {
        const { engine, world }: any = { engine: engineRef.current, world: worldRef.current };

        const ball = Bodies.circle(450, 250, 20, {
            render: {
                fillStyle: theme.colors.purple[5],
            },
            id: 5,
            mass: 0,
        });

        World.add(world, [ball]);

        const speed = 10;
        let dir = {
            x: Math.cos(1) * speed,
            y: Math.sin(0) * speed,
        };
        let collide = 10;

        const updateBall = () => {
            if (ball && canvasRef.current) {
                // make the ball move
                Matter.Body.setVelocity(ball, dir);

                // console.log(ball.position.x, ball.position.y, "\n", canvasRef.current?.width, canvasRef.current?.height);
                // make the ball move
                // Matter.Body.setVelocity(ball, { x: 10, y: 10 });
            }
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

                // if the ball collides with the player then change the direction of the ball
                if (pair.bodyB.id == 10) {
                    console.log("collided with player", pair.bodyB);
                    // Calculate a value between -1 and 1 based on where the ball hit the paddle

                    // let collidePoint = pair.bodyB.position.y - pair.bodyA.position.y;

                    // // Normalize the value
                    // collidePoint = collidePoint / (playerRef.current?.height ?? 1);

                    // dir.y = (10 * collidePoint) * -1
                    // dir.x = -dir.x;
                }
            });
        });

        Events.on(engine, "beforeUpdate", updateBall);
    }

    function Player(x: number, y: number, width: number, height: number) {
        const { engine, world }: any = { engine: engineRef.current, world: worldRef.current };

        const player = Bodies.rectangle(x, y, width, height, {
            render: {
                fillStyle: theme.colors.purple[5],
            },
            isStatic: true,
            id: 10,
        });

        playerRef.current = {
            body: player,
            width: width,
            height: height,
        };

        World.add(world, [player]);

        let keys: {
            up: boolean;
            down: boolean;
        } = {
            up: false,
            down: false,
        };
        // move the player using arrow keys
        if (canvasRef.current) {
            document.addEventListener("keydown", (e) => {
                if (e.key == "ArrowUp") {
                    keys.up = true;
                } else if (e.key == "ArrowDown") {
                    keys.down = true;
                }
            });
            document.addEventListener("keyup", (e) => {
                if (e.key == "ArrowUp") {
                    keys.up = false;
                } else if (e.key == "ArrowDown") {
                    keys.down = false;
                }
            });

            const updatePlayer = () => {
                if (keys.up) {
                    Matter.Body.setPosition(player, { x: player.position.x, y: player.position.y - 10 });
                } else if (keys.down) {
                    Matter.Body.setPosition(player, { x: player.position.x, y: player.position.y + 10 });
                }
            };

            Events.on(engine, "beforeUpdate", updatePlayer);
        }
    }

    useEffect(() => {
        if (canvasRef.current) {
            createWorld();
            createBall();
            createWalls();
            Player(0, canvasRef.current.height / 2, 40, 120);
            // Player(canvasRef.current.width, canvasRef.current.height / 2, 40, 120);
        }
    }, [canvasRef]);

    return (
        <>
            <HeaderDashboard HeaderRef={HeaderRef} />
            <Container>
                {/* <Box sx={{
                    border: `5px solid ${theme.colors.purple[5]}`,
                    borderRadius: 30,
                }}> */}
                <canvas style={{ borderRadius: "40px" }} ref={canvasRef}></canvas>
                {/* </Box> */}
            </Container>
        </>
    );
}
