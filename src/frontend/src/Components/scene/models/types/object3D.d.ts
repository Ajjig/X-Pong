interface Object3D {
    id?: string;
    mass: number;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    collide: {
        scale: number = 0;
    }
    material: {
        friction: number;
        restitution: number;
        contactEquationStiffness?: number;
    },
    type: "Kinematic" | "Dynamic" | "Static"; 
    api?: any | null;
    collisionFilterGroup?: number;
    collisionFilterMask?: number;
    ref?: any;
}

export {
    Object3D
}