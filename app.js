(() => {
  const files = ["app-core.js", "app-render.js", "app-events.js"];

  const loadNext = (index = 0) => {
    if (index >= files.length) return;

    const script = document.createElement("script");
    script.src = files[index];
    script.onload = () => loadNext(index + 1);
    script.onerror = () => console.error(`No se pudo cargar ${files[index]}`);
    document.body.appendChild(script);
  };

  loadNext();
})();
