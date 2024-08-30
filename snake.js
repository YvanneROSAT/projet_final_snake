export default class Snake {
    constructor(ctx) {
        this.ctx = ctx;
        this.size = 20;
        this.body = [{ x: 200, y: 200 }];
        this.direction = 'right';
        this.newDirection = null;
    }

    move() {
        let head = { ...this.body[0] };
        switch (this.direction) {
            case 'right':
                head.x += this.size;
                break;
            case 'left':
                head.x -= this.size;
                break;
            case 'up':
                head.y -= this.size;
                break;
            case 'down':
                head.y += this.size;
                break;
        }

        head.x = (head.x + 400) % 400;
        head.y = (head.y + 400) % 400;

        this.body.unshift(head);
        this.body.pop();

        if (this.newDirection) {
            this.direction = this.newDirection;
            this.newDirection = null;
        }
    }

    eat(fruit) {
        const head = this.body[0];
        if (head.x === fruit.position.x && head.y === fruit.position.y) {
            this.body.push({});
            return true;
        }
        return false;
    }

    draw() {
        this.ctx.fillStyle = 'lime';
        for (const part of this.body) {
            this.ctx.fillRect(part.x, part.y, this.size, this.size);
        }
    }

    changeDirection(direction) {
        const opposites = {
            'ArrowUp': 'down',
            'ArrowDown': 'up',
            'ArrowLeft': 'right',
            'ArrowRight': 'left'
        };

        if (opposites[direction] !== this.direction) {
            this.newDirection = direction.replace('Arrow', '').toLowerCase();
        }
    }

    checkCollision() {
        const [head, ...body] = this.body;
        for (const part of body) {
            if (head.x === part.x && head.y === part.y) {
                return true;
            }
        }
        return false;
    }

    reset() {
        this.body = [{ x: 200, y: 200 }];
        this.direction = 'right';
        this.newDirection = null;
    }
}