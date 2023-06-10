import React, { useEffect, useRef, useState } from "react";
import { Sparkles, useGLTF } from "@react-three/drei";
import { useBox, useConvexPolyhedron } from "@react-three/cannon";
import { useMemo } from "react";
import { threeToCannon, ShapeType } from "three-to-cannon";
import * as THREE from "three";
import { type meshRef } from "./types/mesh";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { Object3D } from "./types";
import { useSelector } from "react-redux";

interface props {
    setRacket: Function;
    Racket: Object3D;
    Camera: any;
}
export function PingPongOppRacket({ Camera, setRacket, Racket }: props) {

    const socket = useSelector((state: any) => state.socket);

    const { scene, nodes }: any = useGLTF("/models/oppRacket.glb", undefined, undefined, (e) => {
        // e.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        //     console.log(
        //         "Loading Rocket file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files."
        //     );
        // };
        // e.manager.onLoad = () => {
        //     console.log(e);
        // };
    });

    useLayoutEffect(() => {
        Object.keys(nodes).forEach((key) => {
            if (nodes[key].isMesh) {
                nodes[key].castShadow = true;
                nodes[key].receiveShadow = true;
            }
        });
    }, [nodes]);

    const ref = useRef<any>();


    const [ref_racket, api_racket] = useBox(() => ({
        mass: Racket.mass,
        position: Racket.position,
        rotation: Racket.rotation,
        type: Racket.type,
        material: Racket.material,
        scale: Racket.scale,
        args: [0.25, 0.05, 0.4],
        onCollide: (e: any) => {
        },
    }));

    // make the racket follow the mouse
    useEffect(() => {
        setRacket((prev: any) => {
            prev.id = ref_racket.current?.id;
            prev.api = api_racket;
            prev.ref = ref_racket;
            return {
                ...prev,
            };
        });

        api_racket.position.subscribe((pos: any) => {
            Racket.position = pos;
        });
    }, []);

    function handleClick() {
        document.body.requestPointerLock();
        // remove the mouce icon from the screen
        document.body.style.cursor = "none";
    }

    function handleKeyEscape() {
        document.exitPointerLock();
        // restore the mouse icon
        document.body.style.cursor = "auto";
    }

    useEffect(() => {
        setRacket((prev: any) => {
            prev.id = ref_racket.current?.id;
            prev.api = api_racket;
            prev.ref = ref_racket;
            return {
                ...prev,
            };
        });

        api_racket.position.subscribe((pos: any) => {
            Racket.position = pos;
        });

        let w_width = window.innerWidth;
        // let w_height = window.innerHeight;
        let mouseX: number = w_width / 2;

        const mouseMove = (e: MouseEvent) => {
            if (document.pointerLockElement === document.body || true) {
                if (mouseX + e.movementX > 0 && mouseX + e.movementX < w_width) {
                    mouseX += e.movementX;

                    // move the camera
                    let cameraPosition = Camera.current.position;
                    Camera.current.position.set(
                        cameraPosition.x + e.movementX / 2000,
                        cameraPosition.y,
                        cameraPosition.z
                    );
                    Camera.current.lookAt(0, 1, 0);
                }
            }

            const x = (mouseX / w_width) * 2 - 1;

            // move the racket
            api_racket.position.set(-x, Racket.position[1], Racket.position[2]);
            // rotate the racket
            // api_racket.rotation.set(Racket.rotation[0], Racket.rotation[1] + x * 2, Racket.rotation[2]);
            if (ref.current) ref.current.rotation.set(0, 0 + x * 1.5, 0);
        };

        window.addEventListener("mousemove", mouseMove);

        // // lock the mouse in the center of the screen
        document.addEventListener("pointerlockchange", () => {
            if (document.pointerLockElement) {
                document.addEventListener("mousemove", mouseMove);
            } else {
                document.removeEventListener("mousemove", mouseMove);
            }
        });

        // click to lock the mouse
        document.addEventListener("click", handleClick);

        // escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") handleKeyEscape();
        });

        return () => {
            ("");
            window.removeEventListener("mousemove", mouseMove);
        };
    }, []);

    return (
        <mesh ref={ref_racket as meshRef} castShadow receiveShadow>
            <mesh ref={ref} scale={Racket.scale} receiveShadow castShadow>
                <primitive object={scene} />
            </mesh>
        </mesh>
    );
}
