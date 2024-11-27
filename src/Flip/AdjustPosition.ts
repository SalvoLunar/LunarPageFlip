import { CanvasRender } from '../Render/CanvasRender';
import { FlipDirection } from './Flip';

export class PositionAdjuster {


    constructor() {

    }


    public moveToCenter(render: CanvasRender) {
        
        const canvasWidth = render.getContext().canvas.width;


        const centerX = (canvasWidth > render.getRect().width)?(canvasWidth - render.getRect().width) / 2 : (canvasWidth - render.getRect().pageWidth) / 2 ;
        console.log('moveToCenter', -centerX);
        // render.getContext().setTransform(1, 0, 0, 1, 2*centerX, 0);
        render.getContext().setTransform(1, 0, 0, 1, -centerX, 0);
        render.getContext().clearRect(0, 0, canvasWidth, render.getContext().canvas.height);
        // render.getContext().save();
    }

    public moveToEdge(render: CanvasRender) {
        console.log('moveToEdge');
        render.getContext().setTransform(1, 0, 0, 1, 0, 0); 
    }

    public animateToCenter(render:CanvasRender, duration: number = 1000, currentPage: number, totalPages: number, direction: FlipDirection): Promise<void> {

        // console.log('animateToCenter', render, duration, direction);

        return new Promise((resolve, reject) => {

            // console.log('animateToCenter', render, duration);

            const startX = render.getContext().getTransform().e;

            let endX = 0;
            const firstPage = currentPage === 0;
            const lastPage = currentPage === totalPages - 1;
            const beforeLastPage = currentPage === totalPages - 3;
            const beforeFirstPage = currentPage === 1;

            if(!firstPage && !lastPage && !beforeFirstPage && !beforeLastPage) resolve(void 0);
            else{
                const ctx = render.getContext();
                const canvasWidth = ctx.canvas.width;
                const canvasHeight = ctx.canvas.height;
                const pageWidth = render.getRect().pageWidth;
                const bookWidth = render.getRect().width;
                // const pageHeight = render.getRect().height;
                let moveX = (canvasWidth > bookWidth)?(canvasWidth - bookWidth) / 2 : (canvasWidth - pageWidth) / 2 ;

                if(firstPage && direction === FlipDirection.FORWARD) endX = 0
                else if(beforeFirstPage && direction === FlipDirection.BACK) endX = -moveX;
                else if(lastPage && direction === FlipDirection.BACK) endX = 0;
                else if(beforeLastPage && direction === FlipDirection.FORWARD) endX = moveX;
                else resolve(void 0);
                // else endX = (render.getContext().canvas.width - render.getRect().pageWidth) / 2;
                // const endX = (lastPage) ? (render.getContext().canvas.width - render.getRect().pageWidth) / 2 : 0;
                console.log(endX)
                const startTime = performance.now();

                const animate = (currentTime: number) => {

    
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const currentX = startX + (endX - startX) * progress;

           
                    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix

                    console.log(canvasWidth, bookWidth)

                    if(canvasWidth === bookWidth ){
                        const clearX = (direction === FlipDirection.BACK) ? currentX + bookWidth + 1 : currentX - 10;
                        //console.log(currentX, 'clearX', clearX);
                        ctx.clearRect(clearX, 0, 50, canvasHeight);
                    }
                    
                    ctx.setTransform(1, 0, 0, 1, currentX, 0);


                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }else{
                        resolve(void 0);
                    }
                };

                requestAnimationFrame(animate);

            }

        });


    }
}
    