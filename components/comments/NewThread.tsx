"use client";

import {FormEvent, ReactNode, useCallback, useEffect, useRef, useState,} from "react";
import {Slot} from "@radix-ui/react-slot";
import * as Portal from "@radix-ui/react-portal";
import {ComposerSubmitComment} from "@liveblocks/react-comments/primitives";

import {useCreateThread} from "@/liveblocks.config";
import {useMaxZIndex} from "@/lib/useMaxZIndex";

import PinnedComposer from "./PinnedComposer";
import NewThreadCursor from "./NewThreadCursor";
import CreatingCommentStateEnum from "@/components/comments/CreatingCommentStateEnum";
import creatingCommentStateEnum from "@/components/comments/CreatingCommentStateEnum";

type ComposerCoords = null | { x: number; y: number };

type NewThreadProps = {
  children: ReactNode;
};

export const NewThread = ({ children }: NewThreadProps) => {
  const [creatingCommentState, setCreatingCommentState] = useState<CreatingCommentStateEnum>(CreatingCommentStateEnum.Complete);


  const createThread = useCreateThread();

  const maxZIndex = useMaxZIndex();

  const [composerCoords, setComposerCoords] = useState<ComposerCoords>(null);

  const lastPointerEvent = useRef<PointerEvent>();

  const [allowUseComposer, setAllowUseComposer] = useState(false);
  const allowComposerRef = useRef(allowUseComposer);
  allowComposerRef.current = allowUseComposer;

  useEffect(() => {
    if (creatingCommentState === creatingCommentStateEnum.Complete) return;

    const newComment = (e: MouseEvent) => {
      e.preventDefault();

      if (creatingCommentState === creatingCommentStateEnum.Placed) {
        const isClickOnComposer = ((e as any)._savedComposedPath = e
          .composedPath()
          .some((el: any) => {
            return el.classList?.contains("lb-composer-editor-actions");
          }));

        if (isClickOnComposer) {
          return;
        }

        if (!isClickOnComposer) {
          setCreatingCommentState(creatingCommentStateEnum.Complete);
          return;
        }
      }

      setCreatingCommentState(creatingCommentStateEnum.Placed);
      setComposerCoords({
        x: e.clientX,
        y: e.clientY,
      });
    };

    document.documentElement.addEventListener("click", newComment);

    return () => {
      document.documentElement.removeEventListener("click", newComment);
    };
  }, [creatingCommentState]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      (e as any)._savedComposedPath = e.composedPath();
      lastPointerEvent.current = e;
    };

    document.documentElement.addEventListener("pointermove", handlePointerMove);

    return () => {
      document.documentElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  useEffect(() => {
    if (creatingCommentState !== creatingCommentStateEnum.Placing) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (allowComposerRef.current) return;

      (e as any)._savedComposedPath = e.composedPath();
      lastPointerEvent.current = e;
      setAllowUseComposer(true);
    };

    const handleContextMenu = (e: Event) => {
      if (creatingCommentState === creatingCommentStateEnum.Placing) {
        e.preventDefault();
        setCreatingCommentState(creatingCommentStateEnum.Complete);
      }
    };

    document.documentElement.addEventListener("pointerdown", handlePointerDown);
    document.documentElement.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.documentElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      document.documentElement.removeEventListener(
        "contextmenu",
        handleContextMenu
      );
    };
  }, [creatingCommentState]);

  const handleComposerSubmit = useCallback(
    ({ body }: ComposerSubmitComment, event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const overlayPanel = document.querySelector("#canvas");

      if (!composerCoords || !lastPointerEvent.current || !overlayPanel) return;

      const { top, left } = overlayPanel.getBoundingClientRect();
      const x = composerCoords.x - left;
      const y = composerCoords.y - top;

      createThread({
        body,
        metadata: {
          x,
          y,
          resolved: false,
          zIndex: maxZIndex + 1,
        },
      });

      setComposerCoords(null);
      setCreatingCommentState(creatingCommentStateEnum.Complete);
      setAllowUseComposer(false);
    },
    [createThread, composerCoords, maxZIndex]
  );

  return (
    <>
      <Slot
        onClick={() =>
          setCreatingCommentState(
            creatingCommentState !== creatingCommentStateEnum.Complete
                ? creatingCommentStateEnum.Complete
                : creatingCommentStateEnum.Placing
          )
        }
        style={{ opacity: creatingCommentState !== creatingCommentStateEnum.Complete ? 0.7 : 1 }}
      >
        {children}
      </Slot>

      {composerCoords && creatingCommentState === creatingCommentStateEnum.Placed ? (

        <Portal.Root
          className='absolute left-0 top-0'
          style={{
            pointerEvents: allowUseComposer ? "initial" : "none",
            transform: `translate(${composerCoords.x}px, ${composerCoords.y}px)`,
          }}
          data-hide-cursors
        >
          <PinnedComposer onComposerSubmit={handleComposerSubmit} />
        </Portal.Root>
      ) : null}

      <NewThreadCursor display={creatingCommentState === creatingCommentStateEnum.Placing} />
    </>
  );
};
