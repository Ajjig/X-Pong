import React, { useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Physics, Debug } from "@react-three/cannon";
import { Canvas, useFrame } from "@react-three/fiber";
import { Camera, Euler, Vector3 } from "three";

// 3d objects
import { PingPongTable } from "@/Components/scene/models/table";
import { PingPongBall } from "@/Components/scene/models/ball";
import { PingPongRacket } from "./models/racket";
import { PingPongOppRacket } from "./models/oppRacket";
import { type Object3D } from "@/Components/scene/models/types";
import { Sky } from "@react-three/drei";

import { World3d } from "@/Components/scene/models/world";
import { useSelector } from "react-redux";

export function Scene() {
    const socket = useSelector((state: any) => state.socket);

    const [gravity, setGravity] = React.useState(-5);
    const CameraRef = React.useRef<any>();

    const [Racket, setRacket] = React.useState<Object3D>({
        mass: 10,
        position: [0, 1.3, -2.5],
        rotation: [Math.PI / 2, 0, 0],
        scale: 1.2,
        collide: {
            scale: 2,
        },
        material: {
            friction: 0.1,
            restitution: 0.5,
            contactEquationStiffness: 1e-6,
        },
        type: "Kinematic",
        collisionFilterGroup: 1,
        collisionFilterMask: 2,
        api: null,
    });

    const [oppRacket, setOppRacket] = React.useState<Object3D>({
        mass: 10,
        position: [0, 1.3, 2.5],
        rotation: [Math.PI / 2, 0, Math.PI],
        scale: 1.2,
        collide: {
            scale: 2,
        },
        material: {
            friction: 0.1,
            restitution: 0.5,
            contactEquationStiffness: 1e-6,
        },
        type: "Kinematic",
        api: null,
        collisionFilterGroup: 1,
        collisionFilterMask: 2,
    });

    const [Ball, setBall] = React.useState<Object3D>({
        mass: 10,
        position: [0, 1.3, 0.1],
        rotation: [0, 0, 0],
        scale: 0.04,
        collide: {
            scale: 0.1,
        },
        material: {
            friction: 0.1,
            restitution: 0.5,
            contactEquationStiffness: 1e-6,
        },
        type: "Dynamic",
        api: null,
        collisionFilterGroup: 2,
        collisionFilterMask: 1,
    });

    const [Table, setTable] = React.useState<Object3D>({
        mass: 10,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1.2,
        collide: {
            scale: 1.2,
        },
        material: {
            friction: 0.1,
            restitution: 0.5,
            contactEquationStiffness: 1e-6,
        },
        type: "Static",
        api: null,
    });

    return (
        <>
            <Physics
                gravity={[0, gravity, 0]}
                iterations={20}
                defaultContactMaterial={{
                    friction: 0.1,
                    restitution: 0.5, // restitution is a property that determines how much energy is conserved when two objects collide. In Three.js, restitution is used to simulate the way objects bounce off each other when they collide.
                }}
            >
                {/* change the background of the Scene */}
                <color attach="background" args={["#000"]} />
                {/* simulate atmospheric effects */}
                {/* <fog attach="fog" args={["#000", 10, 80]} /> */}

                {/* <pointLight
                        color={"white"}
                        position={[0, 2, 0]}
                        castShadow
                        shadow-bias={-0.0001}
                        intensity={0.5}
                    /> */}
                <OrbitControls
                    target={[0, 0.35, 0]}
                    maxPolarAngle={Math.PI / 2}
                    enablePan={false}
                    enableZoom={false}
                    enableRotate={true}
                />
                <DefaultCamera CameraRef={CameraRef} />

                <ambientLight intensity={0.5} position={new Vector3(0, 10, 10)} />

                <spotLight
                    // color={"#f48fb1"}
                    color={"#fff"}
                    intensity={1.5}
                    angle={0.6}
                    penumbra={0.5}
                    position={[5, 40, -16]}
                    castShadow
                    shadow-bias={-0.00001}
                    shadow-mapSize-width={1048}
                    shadow-mapSize-height={1048}
                />

                {/* <Debug scale={1} color={"red"}> */}
                    <PingPongTable Table={Table} setTable={setTable} />
                {/* </Debug> */}
                {/* <Debug scale={1} color={"yellow"}> */}
                    <PingPongRacket Racket={Racket} setRacket={setRacket} Camera={CameraRef} />
                    <PingPongOppRacket Racket={oppRacket} setRacket={setOppRacket} Camera={CameraRef} />
                {/* </Debug> */}
                {/* <Debug scale={1} color={"blue"}> */}
                    <PingPongBall oppRacket={oppRacket} Ball={Ball} Racket={Racket} />
                {/* </Debug> */}
                {/* <Ground /> */}
                <Sky distance={900} sunPosition={[0, 0, 0]} rayleigh={10} />
                <Stars
                    radius={1} /* Radius of the inner sphere (default=100) */
                    count={1000} /*  The number of stars in the star field. */
                    factor={3} /*  The size of the stars relative to the radius of the star field. */
                    saturation={
                        1
                    } /*  The saturation of the stars (default=0) 0 means the stars will be grayscale, while a value of 1 means the stars will be fully colored. */
                    fade // Whether or not to fade the stars in and out as the camera moves. This can help create a more realistic sense of depth.
                    speed={1.5} // The speed at which the stars fade in and out.
                />

                <World3d scale={0.8} />
                {/* </Debug> */}
            </Physics>
        </>
    );
}

function DefaultCamera({ CameraRef }: { CameraRef: any }) {
    CameraRef.current?.lookAt(0, 1, 0);

    useFrame(({ clock }) => {
        // rotate the camera around the table
        CameraRef.current?.position.set(
            4 * Math.sin(clock.getElapsedTime() / 9),
            1.8,
            4 * Math.cos(clock.getElapsedTime() / 15)
        );
        CameraRef.current?.lookAt(0, 1, 0);
    });

    return <PerspectiveCamera makeDefault position={new Vector3(0, 1.8, -4)} fov={75} ref={CameraRef} />;
}
