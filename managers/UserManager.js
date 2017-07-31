class UserManager {

  constructor() {
    this.users = [];
  }
  /**
   * Добавить в массив текущих пользователей
   * @param {*} id 
   * @param {*} name 
   */
  connect(id, name) {
   const index = this.users.findIndex(elem => elem.name === name);

    if (index === -1) {
      this.users.push({ id, name });
    }
  }

  /**
   * Исключить пользователя из массива
   * @param {*} id 
   */
  disconnect(id) {
    const index = this.users.findIndex(elem => elem.id === id);

    if (index !== -1)
      this.users.splice(index, 1);
  }

  /**
   * Вывод текущих пользователей
   */
  getUsers() {
    return this.users.map(u => u.name);
  }
}

module.exports.UserManager = new UserManager();