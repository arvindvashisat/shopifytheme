(async function() {
  document.dispatchEvent(new CustomEvent("dbtfy:loading"));

  try {
    // Request into app to get plan limits
    const limit = 5;

    let eventDetail = {};
    let enabledAddons = [];
    const response = await fetch("/index?view=addons");

    if (response.ok) {
      const addons = await response.json().then(json => json["addons"]);

      enabledAddons = Object.keys(addons).reduce((enabledAddons, addon) => {
        if (addons[addon] === true) {
          return [
            ...enabledAddons,
            {
              name: addon,
              class: addon.replace("dbtfy_", "dbtfy-")
            }
          ]
        }

        return enabledAddons;
      }, [])

      if (limit) {
        enabledAddons = enabledAddons.splice(0, limit);
      }

      eventDetail = {
        ...eventDetail,
        enabledAddons
      }
    }

    const dbtfy = [...document.querySelectorAll(".dbtfy")];
    const enabledClasses = enabledAddons.map((addon) => {
      return addon.class;
    });

    if (enabledClasses.length && dbtfy.length) {
      dbtfy.filter((dbtfyElement) => {
        return !enabledClasses.some((dbtfyElementClass) => {
          return dbtfyElement.classList.contains(dbtfyElementClass);
        });
      }).forEach((dbtfyElement) => {
        dbtfyElement.remove();
      });
    }

    document.dispatchEvent(new CustomEvent("dbtfy:loaded", {
      detail: eventDetail
    }));
  } catch (error) {
    document.dispatchEvent(new CustomEvent("dbtfy:failed"));
  }
})();
