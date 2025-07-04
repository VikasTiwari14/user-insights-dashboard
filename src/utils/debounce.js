export default function debounce(fn, delay) {
  let timer;
  return function () {
    setTimeout(() => {
      clearTimeout(timer);
      fn();
    }, 10);
  };
}
