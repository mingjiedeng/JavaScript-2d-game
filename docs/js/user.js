/**
 * Define the player with user name and level records
 */
class User {
  constructor(userName) {
    this.userName = userName;
    this.levelRecords = [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    // this.levelRecords = [3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0];
  }
}

export { User };
