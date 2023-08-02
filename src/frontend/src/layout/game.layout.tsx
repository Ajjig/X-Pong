import { Box, Container, useMantineTheme } from "@mantine/core";
import React, { use, useEffect, useRef, useState } from "react";
import HeaderDashboard from "../Components/header";
import store from "@/store/store";
import api from "@/api";
import { Loading } from "@/Components/loading/loading";
import Matter, { Composite } from "matter-js";
import { Match_info } from "@/Components/matchs_history/match_info";
import { gameState as TypeGameState } from "@/Components/game/types.d";
import socketGame from "@/socket/gameSocket";

interface props {}

let gameState: TypeGameState = {
    ball: { x: 0, y: 0 },
    player1: { x: 0, y: 0 },
    player2: { x: 0, y: 0 },
    score: { player1: 0, player2: 0 },
};

let messageGame: string = "";

type TypeMove = {
    room: string;
    move: { up: boolean; down: boolean };
};

const screen: { width: number; height: number } = { width: 900, height: 500 };

export function GameLayout({}: props) {
    const HeaderRef = React.useRef(null);
    const theme = useMantineTheme();
    const worldRef = useRef<Matter.World>();
    const engineRef = useRef<Matter.Engine>();
    const runnerRef = useRef<Matter.Runner>();
    const [score, setScore] = useState<{ player1: number; player2: number }>({ player1: 0, player2: 0 });

    // canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);

    const playerRef = useRef<{
        body: Matter.Body;
        width: number;
        height: number;
    }>();

    const oppRef = useRef<{
        body: Matter.Body;
        width: number;
        height: number;
    }>();

    const ballRef = useRef<{
        body: Matter.Body;
    }>();
    const { Bodies, Engine, Events, Render, Runner, World } = Matter;

    useEffect(() => {
        gameState = store.getState().game.gameState;
        setScore(gameState.score);
        store.subscribe(() => {
            gameState = store.getState().game.gameState;
            setScore(gameState.score);
        });

        socketGame.on("gameMessage", (data: any) => {
            messageGame = data;
            console.log(data);
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

    function createBall() {
        const { world }: any = { world: worldRef.current };

        const ball = Bodies.circle(450, 250, 20, {
            render: {
                fillStyle: theme.colors.purple[5],
            },
            id: 5,
            mass: 0,
        });

        ballRef.current = {
            body: ball,
        };

        World.add(world, [ball]);
    }

    function Player(x: number, y: number, width: number, height: number, ref: any) {
        const { world }: any = { world: worldRef.current };

        const player = Bodies.rectangle(x, y, width, height, {
            render: {
                fillStyle: theme.colors.purple[5],
            },
            id: 10,
            mass: 0,
            isStatic: true,
        });

        ref.current = {
            body: player,
        };
        World.add(world, [player]);
    }

    function updateGame() {
        if (ballRef.current) {
            Matter.Body.setPosition(ballRef.current.body, {
                x: gameState.ball.x,
                y: gameState.ball.y,
            });
        }

        if (playerRef.current) {
            Matter.Body.setPosition(playerRef.current.body, {
                x: gameState.player1.x,
                y: gameState.player1.y,
            });
        }

        if (oppRef.current) {
            Matter.Body.setPosition(oppRef.current.body, {
                x: gameState.player2.x,
                y: gameState.player2.y,
            });
        }

        if (contextRef.current && gameState.score) {
            let text = messageGame;
            // print text score in the canvas
            contextRef.current.font = "90px Arial";
            contextRef.current.fillStyle = theme.colors.gray[0];
            contextRef.current.fillText(text, screen.width / 2 - text.length * 18, screen.height / 2 + 30);
        }
    }

    useEffect(() => {
        if (canvasRef.current) {
            createWorld();
            createBall();
            Player(0, screen.height / 2, 20, 120, playerRef);
            Player(screen.width - 10, screen.height / 2, 20, 120, oppRef);

            Events.on(engineRef.current, "beforeUpdate", updateGame);

            let keys: TypeMove = {
                room: "test",
                move: {
                    up: false,
                    down: false,
                },
            };

            socketGame.connect();

            document.addEventListener("keydown", (e) => {
                if (e.key == "ArrowUp") {
                    keys.move.up = true;
                } else if (e.key == "ArrowDown") {
                    keys.move.down = true;
                }
                socketGame.emit("move", keys);
            });
            document.addEventListener("keyup", (e) => {
                if (e.key == "ArrowUp") {
                    keys.move.up = false;
                } else if (e.key == "ArrowDown") {
                    keys.move.down = false;
                }
                socketGame.emit("move", keys);
            });
        }

        contextRef.current = canvasRef.current?.getContext("2d");
    }, [canvasRef]);

    return (
        <>
            <HeaderDashboard HeaderRef={HeaderRef} />
            <Container>
                <Match_info score={score} player1={gameState.player1} player2={gameState.player2} result={"0 - 0"}>
                    <canvas style={{ borderRadius: "5%", width: "100%" }} ref={canvasRef}></canvas>
                </Match_info>
            </Container>
        </>
    );
}
