import React, { useState } from "react";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { type meshRef } from "./types/mesh";
import { useEffect } from "react";
import { type Object3D } from "./types";

const OPP = 0;
const PLAYER = 1;

export function PingPongBall({ Ball, Racket, oppRacket }: { Ball: Object3D, Racket: any, oppRacket: any }) {
    
    let ballDirection = PLAYER;

    const [ref, api] = useSphere(() => ({
        mass: Ball.mass,
        position: Ball.position,
        rotation: Ball.rotation,
        args: [Ball.scale],
        type: Ball.type,
        material: Ball.material,
        scale: Ball.collide.scale,
        collisionFilterGroup: Ball.collisionFilterGroup,
        collisionFilterMask: Ball.collisionFilterMask,

        onCollide(e) {

            // console.log(e.body.id, "oppRacket", oppRacket.id, "Racket", Racket.id);
            if (e.body.id === Racket.id) {
                // console.log(Racket.ref.current.position);
                console.log("hit racket");
                api.velocity.set((e.contact.contactPoint[0] - Racket.position[0]) * 15, 1.9, 5);
                ballDirection = OPP;
            } else if (e.body.id === oppRacket.id) {
                console.log("hit oppRacket");
                api.velocity.set(0, 1.9, -5);
                ballDirection = PLAYER;
            }
            // if the ball hits the table
            else {
                if (ballDirection == OPP) {
                    api.velocity.set(0, 1.6, 2);
                    // api.angularVelocity.set(0, 0, 0);
                } else {
                    api.velocity.set(0, 1.6, -2);
                    // api.angularVelocity.set(0, 0, 0);
                }
            }
        },
    }));

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === " ") {
                // reset the ball
                api.position.set(Ball.position[0], Ball.position[1], Ball.position[2]);
                api.velocity.set(0, 0, 0);
                api.angularVelocity.set(0, 0, 0);
            }
        });
    }, []);

    return (
        <mesh ref={ref as meshRef} castShadow receiveShadow>
            <sphereGeometry args={[Ball.scale]} />
            <meshStandardMaterial color={"yellow"} />
        </mesh>
    );
}
