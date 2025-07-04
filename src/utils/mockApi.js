export function fetchUsers() {
  return new Promise(resolve => {
    setTimeout(() => {
      fetch("/users.json")
        .then(res => res.json())
        .then(resolve);
    }, 300);
  });
}
