import { useGLTF } from "@react-three/drei";
import { useBox, useCompoundBody } from "@react-three/cannon";
import { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import React from "react";
import * as THREE from "three";
import { Object3D, type meshRef } from "./types";
import { applyProps, useFrame } from "@react-three/fiber";

import { threeToCannon, ShapeType } from "three-to-cannon";

export function PingPongTable({ Table, setTable }: { Table: Object3D; setTable: Function }) {

    const { scene, nodes, materials }: any = useGLTF("/models/table.gltf", undefined, undefined, (loader) => {
        // turn on the receiveShadow and castShadow properties
        // loader.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        //     console.log(
        //         "Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files."
        //     );
        // };
        // loader.manager.onLoad = () => {
        //     console.log("@@@@@@@@@@@@@@Table loaded@@@@@@@@@@@@@@@@@");
        //     setLoading(false);
        // };
    });

    useLayoutEffect(() => {
        Object.keys(nodes).forEach((key) => {
            if (nodes[key].isMesh) {
                nodes[key].castShadow = true;
                nodes[key].receiveShadow = true;
            }
        });

        applyProps(materials["table_inside"], { color: '#382e32', roughness: 0.6, normalScale: [4, 4] })

    }, [nodes, materials]);


    const shapes = useMemo(() => {
        let shapes: any = scene?.children.map((obj: any, index: number) => {
            let arr: number[] = [1, 2, 4, 5, 6, 7, 15, 14];
            if (arr.includes(index)) {
                const shape: any = threeToCannon(obj, { type: ShapeType.HULL })?.shape;
                if (shape == undefined) return;
                const scale = 1 / (Table.collide?.scale || 1); // adjust the scale here
                const scaledVertices = shape.vertices.map((v: {x: number, y: number, z: number}) => [v.x / scale, v.y / scale, v.z / scale]);
                const position = [obj.position.x / scale, obj.position.y / scale, obj.position.z / scale];
                return {
                    type: "ConvexPolyhedron",
                    // @ts-ignore
                    args: [scaledVertices, shape.faces, shape.faceNormals.map((f) => [f.x, f.y, f.z])],
                    position: position,
                    rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                };
            }
        }).filter((obj : any) => obj != undefined);

        return shapes;
    }, []);

    const [ref, api] = useCompoundBody(() => ({
        mass: Table.mass,
        type: Table.type,
        position: Table.position,
        rotation: Table.rotation,
        material: Table.material,
        collisionFilterGroup: Table.collisionFilterGroup,
        collisionFilterMask: Table.collisionFilterMask,
        shapes: shapes
    }));

    return (
        <mesh ref={ref as meshRef}  position={Table.position} rotation={Table.rotation}>
            <primitive object={scene} scale={Table.scale}  />
        </mesh>
    );
}
