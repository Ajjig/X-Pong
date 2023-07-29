import { Box, Container, useMantineTheme } from "@mantine/core";
import React, { use, useEffect, useRef, useState } from "react";
import HeaderDashboard from "../Components/header";
import store, { setProfile } from "@/store/store";
import api from "@/api";
import { Loading } from "@/Components/loading/loading";
import Matter from "matter-js";

interface props {}

type gameState = {
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

export function GameLayout({}: props) {
    const HeaderRef = React.useRef(null);
    const theme = useMantineTheme();
    const [loading, setLoading] = useState(true);
    const [screen, setScreen] = useState<{ width: number; height: number }>({ width: 900, height: 500 });
    const [gameState, setGameState] = useState<gameState>({
        ball: {
            x: screen.width / 2,
            y: screen.height / 2,
        },
        player1: {
            x: 0,
            y: screen.height / 2,
        },
        player2: {
            x: screen.width,
            y: screen.height / 2,
        },
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const worldRef = useRef<Matter.World>();
    const engineRef = useRef<Matter.Engine>();
    const runnerRef = useRef<Matter.Runner>();
    const playerRef = useRef<{
        body: Matter.Body;
        width: number;
        height: number;
    }>();
    const { Bodies, Engine, Events, Mouse, MouseConstraint, Render, Runner, World, Composite } = Matter;

    useEffect(() => {
        store.getState().io.game?.on("gameState", (gameState: gameState) => {
            setGameState(gameState);
        });
    }, []);

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
                width: screen.width,
                height: screen.height,
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

    // function createWalls() {
    //     const { engine, world }: any = { engine: engineRef.current, world: worldRef.current };

    //     let walls: any[];

    //     if (!canvasRef.current) return;

    //     let wallThickness = 1;

    //     walls = [
    //         Bodies.rectangle(canvasRef.current.width / 2, 0, canvasRef.current.width, wallThickness, {
    //             isStatic: true,
    //             id: 1,
    //         }),
    //         Bodies.rectangle(canvasRef.current.width / 2, canvasRef.current.height, canvasRef.current.width, wallThickness, {
    //             isStatic: true,
    //             id: 2,
    //         }),
    //         Bodies.rectangle(0, canvasRef.current.height / 2, wallThickness, canvasRef.current.height, {
    //             isStatic: true,
    //             id: 3,
    //         }),
    //         Bodies.rectangle(canvasRef.current.width, canvasRef.current.height / 2, wallThickness, canvasRef.current.height, {
    //             isStatic: true,
    //             id: 4,
    //         }),
    //     ];

    //     // change the color of the walls
    //     walls.forEach((wall) => {
    //         wall.render.fillStyle = "transparent";
    //         wall.render.strokeStyle = "transparent";
    //     });

    //     World.add(world, walls);
    // }

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

        const updateBall = () => {
            if (ball && canvasRef.current) {
                ball.position.x = gameState.ball.x;
                ball.position.y = gameState.ball.y;
            }
        };

        Events.on(engine, "beforeUpdate", updateBall);
    }

    function Player(x: number, y: number, width: number, height: number, pos = { x: 0, y: 0 }) {
        const { engine, world }: any = { engine: engineRef.current, world: worldRef.current };

        const player = Bodies.rectangle(pos.x, pos.y, width, height, {
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
                player.position.x = pos.x;
                player.position.y = pos.y;
            };

            Events.on(engine, "beforeUpdate", updatePlayer);
        }
    }

    useEffect(() => {
        if (canvasRef.current) {
            createWorld();
            createBall();
            // createWalls();
            Player(0, canvasRef.current.height / 2, 40, 120, { x: gameState.player1.x, y: gameState.player1.y });
            Player(canvasRef.current.width, canvasRef.current.height / 2, 40, 120, { x: gameState.player2.x, y: gameState.player2.y });
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
