export default {
  levels: [
    {
      level: 1,
      homeZone: { x: 370, y: 270, width: 136, height: 136 },
      blackHoles: [{ type: "blackhole", x: 100, y: 300, radius: 35 }],
      barrierBlocks: [{ p1x: 200, p1y: 150, p2x: 200, p2y: 450 }],
      balls: [
        { rx: [100, 600], ry: [20, 130], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [100, 600], ry: [20, 130], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [100, 600], ry: [20, 130], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [100, 600], ry: [20, 130], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [100, 600], ry: [470, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [100, 600], ry: [470, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [100, 600], ry: [470, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [100, 600], ry: [470, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [400, 750], ry: [20, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [400, 750], ry: [20, 580], rVx: [0.5, 3], rVy: [0.5, 3] }
      ]
    },
    {
      level: 2,
      homeZone: { x: 370, y: 270, width: 136, height: 136 },
      blackHoles: [
        { x: 100, y: 250, radius: 30 },
        { x: 650, y: 350, radius: 35 }
      ],
      barrierBlocks: [
        { p1x: 250, p1y: 100, p2x: 350, p2y: 150 },
        { p1x: 650, p1y: 500, p2x: 770, p2y: 500 }
      ],
      balls: [
        { rx: [340, 460], ry: [20, 260], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [20, 260], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [20, 260], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [20, 260], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [20, 260], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [340, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [340, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [340, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [340, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [340, 460], ry: [340, 580], rVx: [0.5, 3], rVy: [0.5, 3] }
      ]
    },
    {
      level: 3,
      homeZone: { x: 570, y: 430, width: 120, height: 120 },
      blackHoles: [
        { type: "blackhole", x: 100, y: 400, radius: 35 },
        { type: "blackhole", x: 300, y: 300, radius: 35 }
      ],
      barrierBlocks: [
        { p1x: 200, p1y: 120, p2x: 200, p2y: 550 },
        { type: "decelerate", p1x: 200, p1y: 120, p2x: 400, p2y: 120 }
      ],
      balls: [
        { rx: [200, 750], ry: [20, 100], rVx: [1, 4], rVy: [1, 4] },
        { rx: [200, 750], ry: [20, 100], rVx: [1, 4], rVy: [1, 4] },
        { rx: [200, 750], ry: [20, 100], rVx: [1, 4], rVy: [1, 4] },
        { rx: [200, 750], ry: [20, 100], rVx: [1, 4], rVy: [1, 4] },
        { rx: [200, 750], ry: [20, 100], rVx: [1, 4], rVy: [1, 4] },
        { rx: [400, 750], ry: [340, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [400, 750], ry: [340, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [400, 750], ry: [340, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [400, 750], ry: [340, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [400, 750], ry: [340, 580], rVx: [0.5, 4], rVy: [0.5, 4] }
      ]
    },
    {
      level: 4,
      homeZone: { x: 200, y: 350, width: 136, height: 136 },
      blackHoles: [
        { type: "blackhole", x: 600, y: 100, radius: 35 },
        {
          type: "wormhole",
          x: 550,
          y: 400,
          radius: 50
        }
      ],
      barrierBlocks: [
        { p1x: 0, p1y: 200, p2x: 700, p2y: 200 },
        { type: "accelerate", p1x: 600, p1y: 525, p2x: 750, p2y: 525 }
      ],
      balls: [
        { rx: [50, 300], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [50, 300], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [50, 300], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [50, 300], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [50, 300], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [1, 4], rVy: [1, 4] }
      ]
    },
    {
      level: 5,
      homeZone: { x: 200, y: 350, width: 136, height: 136 },
      blackHoles: [
        { type: "blackhole", x: 600, y: 100, radius: 35 },
        {
          type: "wormhole",
          x: 550,
          y: 400,
          radius: 50
        }
      ],
      barrierBlocks: [
        { p1x: 50, p1y: 250, p2x: 750, p2y: 250 },
        { type: "decelerate", p1x: 270, p1y: 180, p2x: 270, p2y: 248 },
        { type: "accelerate", p1x: 170, p1y: 520, p2x: 360, p2y: 520 }
      ],
      balls: [
        { rx: [50, 300], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [50, 300], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [50, 300], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [50, 300], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [50, 300], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [450, 750], ry: [250, 580], rVx: [0.5, 4], rVy: [0.5, 4] }
      ]
    },
    {
      level: 6,
      homeZone: { x: 400, y: 350, width: 120, height: 120 },
      blackHoles: [
        { type: "blackhole", x: 600, y: 100, radius: 35 },
        { type: "blackhole", x: 130, y: 450, radius: 30 },
        {
          type: "wormhole",
          x: 650,
          y: 450,
          radius: 40
        }
      ],
      barrierBlocks: [
        { p1x: 0, p1y: 240, p2x: 400, p2y: 240 },
        { type: "accelerate", p1x: 300, p1y: 290, p2x: 800, p2y: 290 },
        { type: "decelerate", p1x: 200, p1y: 170, p2x: 360, p2y: 170 },
        { type: "accelerate", p1x: 300, p1y: 400, p2x: 300, p2y: 550 }
      ],
      balls: [
        { rx: [20, 230], ry: [20, 200], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 280], ry: [260, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 280], ry: [260, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 280], ry: [260, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 750], ry: [350, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 750], ry: [350, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 750], ry: [350, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 750], ry: [350, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 750], ry: [350, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 750], ry: [350, 580], rVx: [0.5, 3], rVy: [0.5, 3] }
      ]
    },
    {
      level: 7,
      homeZone: { x: 370, y: 270, width: 80, height: 80 },
      blackHoles: [
        { type: "blackhole", x: 80, y: 520, radius: 35 },
        { type: "blackhole", x: 610, y: 150, radius: 30 },
        {
          type: "wormhole",
          x: 700,
          y: 500,
          radius: 40,
          targetX: 200,
          targetY: 200
        }
      ],
      barrierBlocks: [
        { type: "decelerate", p1x: 150, p1y: 150, p2x: 150, p2y: 450 },
        { type: "decelerate", p1x: 150, p1y: 150, p2x: 570, p2y: 150 },
        { type: "accelerate", p1x: 650, p1y: 150, p2x: 650, p2y: 450 },
        { type: "accelerate", p1x: 150, p1y: 450, p2x: 650, p2y: 450 }
      ],
      balls: [
        { rx: [20, 130], ry: [20, 300], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 130], ry: [20, 300], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 400], ry: [20, 130], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 400], ry: [20, 130], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 600], ry: [470, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 600], ry: [470, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [350, 600], ry: [470, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [670, 600], ry: [20, 440], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [670, 600], ry: [20, 440], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [670, 600], ry: [20, 440], rVx: [0.5, 3], rVy: [0.5, 3] }
      ]
    },
    {
      level: 8,
      homeZone: { x: 670, y: 70, width: 80, height: 80 },
      blackHoles: [
        { type: "blackhole", x: 350, y: 350, radius: 65 },
        { type: "blackhole", x: 600, y: 560, radius: 35 },
        {
          type: "wormhole",
          x: 100,
          y: 100,
          radius: 40,
          targetX: 640,
          targetY: 40
        }
      ],
      barrierBlocks: [
        { type: "decelerate", p1x: 200, p1y: 250, p2x: 200, p2y: 600 },
        { type: "accelerate", p1x: 600, p1y: 0, p2x: 600, p2y: 520 },
        { type: "accelerate", p1x: 300, p1y: 200, p2x: 600, p2y: 200 }
      ],
      balls: [
        { rx: [20, 180], ry: [160, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 180], ry: [160, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 180], ry: [160, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [160, 580], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [160, 580], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [160, 580], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [160, 580], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [160, 580], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [160, 580], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [160, 580], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] }
      ]
    },
    {
      level: 9,
      homeZone: { x: 550, y: 450, width: 70, height: 70 },
      blackHoles: [
        { type: "blackhole", x: 50, y: 530, radius: 40 },
        { type: "blackhole", x: 700, y: 120, radius: 35 },
        {
          type: "wormhole",
          x: 60,
          y: 60,
          radius: 35,
          targetX: 400,
          targetY: 310
        },
        {
          type: "wormhole",
          x: 760,
          y: 40,
          radius: 35,
          targetX: 400,
          targetY: 410
        },
        {
          type: "wormhole",
          x: 750,
          y: 550,
          radius: 30,
          targetX: 20,
          targetY: 310
        }
      ],
      barrierBlocks: [
        { p1x: 100, p1y: 360, p2x: 800, p2y: 360 },
        { p1x: 350, p1y: 0, p2x: 350, p2y: 530 },
        { p1x: 100, p1y: 530, p2x: 350, p2y: 530 },
        { type: "accelerate", p1x: 0, p1y: 445, p2x: 270, p2y: 445 },
        { type: "decelerate", p1x: 700, p1y: 80, p2x: 800, p2y: 80 }
      ],
      balls: [
        { rx: [20, 330], ry: [20, 340], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [20, 330], ry: [20, 340], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [20, 330], ry: [20, 340], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [20, 330], ry: [20, 340], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [20, 330], ry: [20, 340], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [20, 330], ry: [20, 340], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [20, 330], ry: [20, 340], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [20, 330], ry: [20, 340], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [370, 680], ry: [20, 580], rVx: [0.5, 4], rVy: [0.5, 4] },
        { rx: [370, 680], ry: [20, 580], rVx: [0.5, 4], rVy: [0.5, 4] }
      ]
    },
    {
      level: 10,
      homeZone: { x: 370, y: 500, width: 65, height: 65 },
      blackHoles: [
        { type: "blackhole", x: 750, y: 100, radius: 35 },
        { type: "blackhole", x: 100, y: 100, radius: 35 },
        { type: "blackhole", x: 660, y: 400, radius: 35 },
        {
          type: "wormhole",
          x: 350,
          y: 300,
          radius: 35,
          targetX: 50,
          targetY: 550
        }
      ],
      barrierBlocks: [
        { p1x: 260, p1y: 0, p2x: 180, p2y: 120 },
        { p1x: 220, p1y: 115, p2x: 220, p2y: 600 },
        { p1x: 220, p1y: 200, p2x: 680, p2y: 200 },
        { p1x: 670, p1y: 150, p2x: 800, p2y: 260 },
        { p1x: 530, p1y: 200, p2x: 530, p2y: 400 },
        { p1x: 530, p1y: 418, p2x: 530, p2y: 600 }
      ],
      balls: [
        { rx: [20, 200], ry: [260, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 200], ry: [260, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [20, 200], ry: [260, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [250, 500], ry: [360, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [250, 500], ry: [360, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [250, 500], ry: [360, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [250, 500], ry: [360, 580], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [270, 650], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [270, 650], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] },
        { rx: [270, 650], ry: [20, 180], rVx: [0.5, 3], rVy: [0.5, 3] }
      ]
    }
  ]
};
