import Collisions from '@zubry/collisions';
import { BoundingCircle as Circle, BoundingRectangle as Rectangle } from '@zubry/boundary';
import Position from '@zubry/position';

function drawRectangle(context, rectangle, fill, stroke) {
  const [ul, ur, lr, ll] = rectangle.toCoordinateList().toArray();

  context.beginPath();

  context.moveTo(ul.x, ul.y);
  context.lineTo(ur.x, ur.y);
  context.lineTo(lr.x, lr.y);
  context.lineTo(ll.x, ll.y);

  context.closePath();

  context.lineWidth = 5;

  context.strokeStyle = stroke;
  context.stroke();

  context.fillStyle = fill;
  context.fill();
}

function drawCircle(context, circle, fill, stroke) {
  context.beginPath();

  context.arc(circle.center.x, circle.center.y, circle.radius - 2.5, 0, 2 * Math.PI, false);

  context.closePath();

  context.lineWidth = 5;

  context.strokeStyle = stroke;
  context.stroke();

  context.fillStyle = fill;
  context.fill();
}

function spawnCircles(viewWidth, number) {
  const radius = viewWidth / number / 2;

  return new Array(number)
    .fill(new Circle({ center: new Position({ x: 0, y: radius + 5}), radius }))
    .map((value, index) => value.shift(new Position({ x: 2 * (radius) * (index + 0.5), y: 0 })));
}

function spawnRectangles() {
  return [
    new Rectangle({
      center: new Position({ x: 195, y: 200 }),
      rotation: new Position(45),
      height: 24,
      width: 192,
    }),
    new Rectangle({
      center: new Position({ x: 315, y: 200 }),
      rotation: new Position(-45),
      height: 24,
      width: 192,
    }),
  ]
}

function onTick(circles, collisions) {
  const delta = new Position({ x: 0, y: 3 });

  const blocked = circles.filter((circle) => collisions.detect(circle));
  blocked
    .map((x) => x.toJS())
    .forEach((x) => console.log(x));

  return circles
    .filter((circle) => !collisions.detect(circle))
    .map((circle) => circle.shift(delta))
    .concat(circles.filter((circle) => collisions.detect(circle)));
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach((circle) => drawCircle(context, circle, '#1DCCC4', '#3D9995'));

  rects.forEach((rect) => drawRectangle(context, rect, '#B2D287', '#37664A'));

  requestAnimationFrame(render);
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let circles = spawnCircles(600, 24);
let rects = spawnRectangles();

const collisions = new Collisions({ items: rects });

requestAnimationFrame(render);

setInterval(() => {
  circles = onTick(circles, collisions);
}, 20);

document
  .getElementById('reset')
  .addEventListener('click', () => circles = spawnCircles(600, 24));
