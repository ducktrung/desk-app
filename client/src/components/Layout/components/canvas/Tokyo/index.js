import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasLoader } from '~/components/Layout/components/Loader';

const Tokyo = ({ isMobile }) => {
    const { scene, animations } = useGLTF('/tokyo/scene.gltf');
    const { actions, mixer } = useAnimations(animations, scene);

    useEffect(() => {
        // Đảm bảo rằng tên hoạt ảnh chính xác
        if (mixer && animations.length > 0) {
            const action = mixer.clipAction(animations[0]);
            action.play();
            action.setLoop(THREE.LoopRepeat, Infinity);
        }
    }, [mixer, animations]);
    return (
        <mesh>
            <hemisphereLight intensity={0.4} groundColor="black" />
            <spotLight
                position={[5, 4, 5]}
                angle={Math.PI / 12}
                penumbra={0.5}
                intensity={200}
                castShadow
                shadow-mapSize={1024}
            />
            <spotLight intensity={10} />
            <primitive object={scene} scale={0.01} position={[0, 0, 0]} rotation={[0, -0.2, 0]} />
        </mesh>
    );
};

const TokyoCanvas = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Add a listener for changes to the screen size
        const mediaQuery = window.matchMedia('(max-width: 500px)');

        // Set the initial value of the `isMobile` state variable
        setIsMobile(mediaQuery.matches);

        // Define a callback function to handle changes to the media query
        const handleMediaQueryChange = (event) => {
            setIsMobile(event.matches);
        };
        // Add the callback function as a listener for changes to the media query
        mediaQuery.addEventListener('change', handleMediaQueryChange);

        // Remove the listener when the component is unmounted
        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);
    return (
        <Canvas
            frameloop="always"
            shadows
            dpr={[1, 2]}
            camera={{ position: [20, 3, 5], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
        >
            <Suspense fallback={<CanvasLoader />}>
                <OrbitControls
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                    mouseButtons={{
                        LEFT: 0,
                        RIGHT: null,
                    }}
                />
                <Tokyo isMobile={isMobile} />
            </Suspense>

            <Preload all />
        </Canvas>
    );
};
export default TokyoCanvas;
