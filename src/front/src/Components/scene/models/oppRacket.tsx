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

    return (
        <mesh ref={ref_racket as meshRef} castShadow receiveShadow>
            <mesh ref={ref} scale={Racket.scale} receiveShadow castShadow>
                <primitive object={scene} />
            </mesh>
        </mesh>
    );
}
