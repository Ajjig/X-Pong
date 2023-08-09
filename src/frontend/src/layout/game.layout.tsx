import { Avatar, Box, Container, Flex, Title, useMantineTheme, Group } from "@mantine/core";
import React, { use, useEffect, useRef, useState } from "react";
import HeaderDashboard from "../Components/header";
import store from "@/store/store";
import Matter, { Composite } from "matter-js";
import { Match_info } from "@/Components/match_info/match_info";
import { gameState as TypeGameState, oppType } from "@/Components/game/types.d";
import socketGame from "@/socket/gameSocket";

interface props {
    gameID: string | string[] | undefined;
}

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

export function GameLayout({ gameID }: props) {
    const [oppinfo, setOppinfo] = useState<oppType>({ roomName: "", player: 0, opponentName: "", opponentId: 0 });
    const HeaderRef = React.useRef(null);
    const theme = useMantineTheme();
    const worldRef = useRef<Matter.World>();
    const engineRef = useRef<Matter.Engine>();
    const runnerRef = useRef<Matter.Runner>();
    const [score, setScore] = useState<{ player1: number; player2: number }>({ player1: 0, player2: 0 });
    const [gameColors, setGameColors] = useState<{
        background: string;
        ball: string;
        player: string;
    }>({
        background: theme.colors.cos_black[0],
        ball: theme.colors.purple[5],
        player: theme.colors.purple[5],
    });

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
        socketGame.on("gameState", (data: any) => {
            gameState = data;
            setScore(gameState.score);
        });

        socketGame.on("gameMessage", (data: any) => {
            messageGame = data;
        });

        setOppinfo(store.getState().game.opp);

        gameState = {
            ball: { x: screen.width / 2, y: screen.height / 2 },
            player1: { x: 10, y: screen.height / 2 },
            player2: { x: screen.width - 10, y: screen.height / 2 },
            score: { player1: 0, player2: 0 },
        };

        return () => {
            messageGame = "";
            socketGame.emit("left-game", { room: gameID });
        };
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
                background: gameColors.background,
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
                fillStyle: gameColors.ball,
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
                fillStyle: gameColors.player,
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
            contextRef.current.font = "90px " + theme.fontFamily;
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
                room: gameID as string,
                move: {
                    up: false,
                    down: false,
                },
            };
            if (socketGame.connected == false) socketGame.connect();

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

    const themes = [
        {
            id: 1,
            background: theme.colors.cos_black[2],
            ball: theme.colors.purple[5],
            player: theme.colors.purple[5],
        },
        {
            id: 2,
            background: theme.colors.cos_black[0],
            ball: theme.colors.red[5],
            player: theme.colors.red[5],
        },
        {
            id: 3,
            background: theme.colors.cyan[9],
            ball: theme.colors.yellow[5],
            player: theme.colors.yellow[5],
        },
    ];

    return (
        <>
            <HeaderDashboard HeaderRef={HeaderRef} />
            <Container>
                <Match_info score={score} player1={gameState.player1} player2={gameState.player2} oppinfo={oppinfo} result={"0 - 0"}>
                    <canvas style={{ borderRadius: "5%", width: "100%", background: gameColors.background }} ref={canvasRef}></canvas>
                </Match_info>
                {/* colors themes */}
                <Flex align="center" justify="center" gap={10} mt={20} direction={"column"}>
                    <Title
                        color="gray.4"
                        fz="lg"
                        mb="sm"
                        sx={{
                            [theme.fn.smallerThan("sm")]: {
                                fontSize: theme.fontSizes.sm,
                            },
                        }}
                    >
                        Colors themes
                    </Title>
                    <Flex align="center" justify="center" gap={10}>
                        {themes.map((current_theme: { background: string; ball: string; player: string; id: number }) => {
                            return (
                                <Box
                                    onClick={() => {
                                        setGameColors({
                                            background: current_theme.background,
                                            ball: current_theme.ball,
                                            player: current_theme.player,
                                        });

                                        // change color in the canvas
                                        if (ballRef.current) {
                                            ballRef.current.body.render.fillStyle = current_theme.ball;

                                            if (playerRef.current) {
                                                playerRef.current.body.render.fillStyle = current_theme.player;
                                            }
                                            if (oppRef.current) {
                                                if (oppRef.current?.body?.render) {
                                                    oppRef.current.body.render.fillStyle = current_theme.player;
                                                }
                                            }
                                        }
                                    }}
                                    key={current_theme.id}
                                >
                                    <Avatar.Group>
                                        <Box
                                            sx={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                background: current_theme.ball,
                                                cursor: "pointer",
                                                [theme.fn.smallerThan("sm")]: {
                                                    width: "20px",
                                                    height: "20px",
                                                },
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                background: current_theme.background,
                                                cursor: "pointer",
                                                marginLeft: "-10px",
                                                [theme.fn.smallerThan("sm")]: {
                                                    width: "20px",
                                                    height: "20px",
                                                },
                                            }}
                                        />
                                    </Avatar.Group>
                                </Box>
                            );
                        })}
                    </Flex>
                </Flex>
            </Container>
        </>
    );
}
