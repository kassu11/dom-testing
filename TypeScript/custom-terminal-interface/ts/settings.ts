const settings = {
	"commandStructureInfo": true,
	"hideIntellisenseBox": false,
	"closeIntellisenseAfterTab": false,
	"smartIntellisense": false,
} as const

// @ts-ignore
const localSettings = JSON.parse(localStorage.getItem("terminalSettings")) as settings
// @ts-ignore
if (localSettings) Object.entries(localSettings)?.forEach(([key, value]) => {
	// @ts-ignore
	if (key in settings) settings[key] = value
});
