/**
 * Vector is a 2D vector class with methods for common vector operations
 *
 * @author Mingjie Deng <mingjie.dmj@gmail.com>
 * @version 1.0 (8/19/2018)
 */
class Vector {
  /**
   * Constructor. Create an instance with the 'new' keywork.
   *
   * @param {Number} x Value of the x axis
   * @param {Number} y Value of the y axis
   */
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * Check if two lines cross,
   * one line is from point line1Begin to point line1End,
   * the other line is from point line2Begin to point line2End.
   *
   * @param {Vector} line1Begin the start point of line1
   * @param {Vector} line1End   the end point of line1
   * @param {Vector} line2Begin the start point of line2
   * @param {Vector} line2End   the end point of line2
   * @return {Boolean} true if crossing
   */
  static isCrossing(line1Begin, line1End, line2Begin, line2End) {
    let vecLine1 = line1End.subtract(line1Begin);
    let vecLine2 = line2End.subtract(line2Begin);
    let l1BToL2B = line2Begin.subtract(line1Begin);
    let l1BToL2E = line2End.subtract(line1Begin);
    let l2BToL1B = line1Begin.subtract(line2Begin);
    let l2BToL1E = line1End.subtract(line2Begin);

    let x1 = vecLine1.cross(l1BToL2B);
    let x2 = vecLine1.cross(l1BToL2E);
    let x3 = vecLine2.cross(l2BToL1B);
    let x4 = vecLine2.cross(l2BToL1E);

    return (
      ((x1 > 0 && x2 < 0) || (x1 < 0 && x2 > 0)) &&
      ((x3 > 0 && x4 < 0) || (x3 < 0 && x4 > 0))
    );
  }

  /**
   * Calculate the length(Magnitude) of the vector
   *
   * @return {Number} Length(Magnitude)
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Add another vector to this one by joining them head-to-tail.
   *
   * @param {Vector} v2 another vector
   * @return {Vector} a new vector with the result
   */
  add(v2) {
    return new Vector(this.x + v2.x, this.y + v2.y);
  }

  /**
   * Subtract another vector from this one
   *
   * @param {*} v2 another vector
   * @return {Vector} a new vector with the result
   */
  subtract(v2) {
    return new Vector(this.x - v2.x, this.y - v2.y);
  }

  /**
   * Dot product of another vector and this one. Notation: v1 · v2
   *
   * @param {*} v2 another vector
   * @return {Number} a scalar (ordinary number)
   */
  dot(v2) {
    return this.x * v2.x + this.y * v2.y;
  }

  /**
   * Cross product of another vector and this one. Notation: v1 x v2
   *
   * @param {*} v2 another vector
   * @return {Number} a number in z axis that indicates the direction with a positive or negative sign.
   */
  cross(v2) {
    return this.x * v2.y - this.y * v2.x;
  }

  /**
   * Normalize this vector
   *
   * @return {Vector} a unit vector that has been normalized
   */
  normalize() {
    let length = this.length();
    return new Vector(this.x / length, this.y / length);
  }

  /**
   * Turns this vector 90 degrees
   *
   * @return {Vector} a new vector vertical to this one with the same length
   */
  verticalV() {
    return new Vector(-this.y, this.x);
  }

  /**
   * Expands or contracts this vector a specified multiple
   *
   * @param {Number} number expands how many times
   * @return {Vector} a new vector
   */
  multiply(number) {
    this.x *= number;
    this.y *= number;
    return this;
  }

  /**
   * Expands or contracts this vector to a specified length
   *
   * @param {Number} newLen the new length of the vector
   * @return {Vector} a new vector
   */
  scaleToLength(newLen) {
    let scaleRate = newLen / this.length();
    this.x *= scaleRate;
    this.y *= scaleRate;
    return this;
  }
}

export { Vector };
