export const UserAPI = {
  getList() {
    try {
      return JSON.parse(localStorage.getItem("users")) || [];
    } catch (error) {
      return [];
    }
  },
  add(user) {
    let users = UserAPI.getList();

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  },
  find(userId) {
    let users = UserAPI.getList();
    return users.find((user) => user.id === userId);
  },
};
