"use client";

import {fabric} from "fabric";

import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import {useEffect, useRef, useState} from "react";
import {handleCanvasMouseMove, handleCanvasMouseDown, handleResize, initializeFabric} from "@/lib/canvas";
import {ActiveElement} from "@/types/type";
import {useMutation, useStorage} from "@/liveblocks.config";
import {object} from "prop-types";

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const isDrawing = useRef(false);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedShapeRef = useRef<string | null>(null);

    const canvasObjects = useStorage((root) => root.canvasObjects);
    const syncShapeInStorage = useMutation(({storage}, object) => {
        if(!object) return;

        const {objectId} = object;
        const shapeData = object.toJSON();

        shapeData.objectId = objectId;

        const canvasObjects = storage.get('canvasObjects');

        canvasObjects.set(objectId, shapeData);
    }, []);

    const [activeElement, setActiveElement] = useState<ActiveElement>({
        name: '',
        value: '',
        icon: '',
    })

    const handleActiveElement = (elem: ActiveElement) => {
        setActiveElement(elem);

        selectedShapeRef.current = elem?.value as string;
    }

    useEffect(() => {
        const canvas = initializeFabric({
            canvasRef,
            fabricRef,
        });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({
                options,
                canvas,
                selectedShapeRef,
                isDrawing,
                shapeRef,
            });
        });

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({
                options,
                canvas,
                selectedShapeRef,
                isDrawing,
                shapeRef,
                syncShapeInStorage,
            });
        });

        window.addEventListener("resize", () => {
            handleResize({
                canvas: fabricRef.current,
            });
        });

    }, []);
    return (
        <main className="h-screen overflow-hidden">
            <Navbar
                activeElement={activeElement}
                handleActiveElement={handleActiveElement}
            />
                <section className="flex h-full flex-row">
                    <LeftSidebar />
                    <Live canvasRef={canvasRef} />
                    <RightSidebar />
            </section>
      </main>
    )
}