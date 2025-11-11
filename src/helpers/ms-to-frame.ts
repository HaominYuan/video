export const FPS = 30;

export const msToFrame = (time: number) => {
    return (time / 1000) * FPS;
};
