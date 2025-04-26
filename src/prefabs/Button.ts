import { Assets, Container, Graphics, Sprite } from 'pixi.js';
import gsap from 'gsap';

export default class Button extends Container {

    private direction: 'clockwise' | 'counterclockwise' = 'clockwise';
    private radius: number = 30;
    private isPressed: boolean = false;

    private backgrGraphic!: Graphics;
    private arrow!: Sprite; 

    constructor(
        direction: 'clockwise' | 'counterclockwise' = 'clockwise', 
        x: number, 
        y: number, 
        radius: number = 30,
        backgroundColor: number | string = 0xffffff
    ) {
        super();
        this.direction = direction;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.alpha = 0.5;
        this.interactive = true;
        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.backgrGraphic = new Graphics();
        this.backgrGraphic.alpha = 0.25;
        this.backgrGraphic
            .beginFill(backgroundColor)
            .drawCircle(0, 0, this.radius)
            .endFill();

        this.arrow = new Sprite(Assets.get(`arrow-rotate-${this.direction == 'clockwise' ? 'right' : 'left'}-solid`));
        const arrowRadius = this.radius * 2;
        const scaledArrowWidth = arrowRadius / this.arrow.width;
        const scaledArrowHeight = arrowRadius / this.arrow.height;
        const arrowScale = Math.min(scaledArrowWidth, scaledArrowHeight) * 0.8;
        this.arrow.scale.set(arrowScale);
        this.arrow.anchor.set(0.5);

        this.addChild(this.backgrGraphic);
        this.addChild(this.arrow);

        this.on('pointerover', this.onPointerEnter, this);
        this.on('pointerout', this.onPointerLeave, this);
        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerupoutside', this.onPointerUpOutside, this);
    }

    private onPointerEnter() {
        gsap.to(this, { alpha: 1, duration: 0.35, ease: 'power2' });
    }

    private onPointerLeave() {
        if (this.isPressed) return;
        gsap.to(this, { alpha: 0.5, duration: 0.35, ease: 'power2' });
    }

    private onPointerDown() {
        this.isPressed = true;
        gsap.to(this.scale, { 
            x: 0.85, 
            y: 0.85, 
            duration: 0.15, 
            ease: 'back.out(2)'
        });
    }

    private onPointerUp() {
        this.isPressed = false;
        gsap.to(this.scale, { 
            x: 1, 
            y: 1, 
            duration: 0.2, 
            ease: 'back.out(3)'
        });
    }

    private onPointerUpOutside() {
        this.onPointerUp();
        if (this.alpha == 1) this.onPointerLeave();
    }
}