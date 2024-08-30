export default class Fruit {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.position = {};
    }

    reposition() {
        this.position.x = Math.floor(Math.random() * (this.width / 20)) * 20;
        this.position.y = Math.floor(Math.random() * (this.height / 20)) * 20;
    }

    draw() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.position.x, this.position.y, 20, 20);
    }
}