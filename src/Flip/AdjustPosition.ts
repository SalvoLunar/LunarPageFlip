export class PositionAdjuster {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public moveToPosition(
        positionX: number,
        positionY: number,
        duration: number
    ): void {

        console.log(positionX, positionY, duration);
        const startX = this.ctx.getTransform().e;
        const startY = this.ctx.getTransform().f;
        console.log(startX, startY);
        const deltaX = positionX - startX;
        const deltaY = positionY - startY;

        const startTime = performance.now();    
        const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = elapsed / duration;

            const currentX = startX + deltaX * progress;
            const currentY = startY + deltaY * progress;
            // console.log(currentX, currentY);
            this.ctx.save();
            //this.ctx.translate(currentX, currentY);
            this.ctx.setTransform(1, 0, 0, 1, currentX , currentY);
            // this.ctx.restore();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

    