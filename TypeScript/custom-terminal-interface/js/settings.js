"use strict";
const settings = {
    "commandStructureInfo": true,
    "hideIntellisenseBox": false,
    "closeIntellisenseAfterTab": false,
    "smartIntellisense": false,
};
// @ts-ignore
const localSettings = JSON.parse(localStorage.getItem("terminalSettings"));
// @ts-ignore
if (localSettings)
    Object.entries(localSettings)?.forEach(([key, value]) => {
        // @ts-ignore
        if (key in settings)
            settings[key] = value;
    });
//# sourceMappingURL=settings.js.map