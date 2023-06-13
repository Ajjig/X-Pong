import { useGLTF } from "@react-three/drei";
import { useBox } from "@react-three/cannon";
import { useEffect, useState, useMemo } from "react";
import React from "react";
import * as THREE from "three";
import { Object3D, type meshRef } from "./types";

import { threeToCannon, ShapeType } from "three-to-cannon";
import { useConvexPolyhedron } from "@react-three/cannon";



export function World3d({ scale = 0.8 }: { scale: number }) {

    const { scene } = useGLTF("/models/world.gltf", undefined, undefined, (loader) => {
    });

    useEffect(() => {
        // turn on the receiveShadow and castShadow properties
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.receiveShadow = true;
                // child.castShadow = true;
            }
        });
        
        // console.log("=====> ",scene);
    }, [scene]);


    return (
       <mesh
            scale={scale}
            position={[0, 0.36, 0]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
            receiveShadow
        >
            <primitive object={scene} />
        </mesh>
    );
}
