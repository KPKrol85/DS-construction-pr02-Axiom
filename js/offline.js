(function () {
  const btn = document.getElementById("retryBtn");
  const status = document.getElementById("netStatus");
  const retryDelays = [0, 400, 1200];
  let checking = false;
  let reloading = false;

  const announce = (message) => {
    if (status) status.textContent = message;
  };

  const reload = () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  };

  const isReachable = async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    try {
      // HEAD skips the worker's GET navigation fallback and cannot match Cache Storage.
      const response = await fetch(window.location.href, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      return response.ok || response.status === 404;
    } catch {
      return false;
    } finally {
      window.clearTimeout(timeout);
    }
  };

  if (btn) btn.addEventListener("click", reload);
  window.addEventListener("online", async () => {
    if (checking || reloading) return;
    checking = true;
    announce("Sprawdzam połączenie z serwisem.");

    for (const delay of retryDelays) {
      if (delay) await new Promise((resolve) => window.setTimeout(resolve, delay));
      if (reloading) return;
      const reachable = await isReachable();
      if (reloading) return;
      if (!reachable) continue;

      announce("Połączenie przywrócone. Odświeżam stronę.");
      reload();
      return;
    }

    checking = false;
    announce("Nie udało się połączyć z serwisem. Spróbuj ponownie.");
  });
})();
