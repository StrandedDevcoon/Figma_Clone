import React from "react";
import {EmojiReaction} from "@/components/reaction/ReactionButtonEnums";

type ReactionSelectorProps = {
    setReaction: (reaction: string) => void;
};

export default function ReactionSelector({ setReaction }: ReactionSelectorProps) {
    return (
        <div
            className="absolute bottom-20 left-0 right-0 mx-auto w-fit transform rounded-full bg-white px-2"
            onPointerMove={(e) => e.stopPropagation()}
        >
            <ReactionButton reaction={EmojiReaction.THUMBS_UP} onSelect={setReaction} />
            <ReactionButton reaction={EmojiReaction.FIRE} onSelect={setReaction} />
            <ReactionButton reaction={EmojiReaction.HEART_EYES} onSelect={setReaction} />
            <ReactionButton reaction={EmojiReaction.EYES} onSelect={setReaction} />
            <ReactionButton reaction={EmojiReaction.SCREAM} onSelect={setReaction} />
            <ReactionButton reaction={EmojiReaction.FROWN} onSelect={setReaction} />
        </div>
    );
}

function ReactionButton(
    {
        reaction,
        onSelect,
    }: {
        reaction: string;
        onSelect: (reaction: string) => void;
    }
) {
    return (
        <button
            className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
            onPointerDown={() => onSelect(reaction)}
        >
            {reaction}
        </button>
    );
}