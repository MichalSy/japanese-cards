import fs from "node:fs";
import path from "node:path";

export default {
  ssr: false, // Disable SSR for hash-based client-side routing (works better with GitHub Pages)
  async prerender() {
    const routes = ["/"];
    const publicDir = path.join(process.cwd(), "public", "GameData");

    try {
      const categoriesJson = JSON.parse(fs.readFileSync(path.join(publicDir, "categories.json"), "utf-8"));
      const gameModesJson = JSON.parse(fs.readFileSync(path.join(publicDir, "gamemodes.json"), "utf-8"));
      const enabledModes = gameModesJson.gameModes.filter(m => m.enabled).map(m => m.id);

      categoriesJson.categories.forEach(cat => {
        const catId = cat.id;
        routes.push(`/content/${catId}`);

        const catConfigPath = path.join(publicDir, catId, "category.json");
        if (fs.existsSync(catConfigPath)) {
          const catConfig = JSON.parse(fs.readFileSync(catConfigPath, "utf-8"));
          
          const groups = catConfig.groups || [];
          const supportedModes = catConfig.gameModes || [];

          const processGroup = (groupId) => {
            routes.push(`/content/${catId}/${groupId}`);
            enabledModes.forEach(modeId => {
              if (supportedModes.includes(modeId)) {
                routes.push(`/game/${catId}/${groupId}/${modeId}`);
              }
            });
          };

          groups.forEach(g => processGroup(g.id));
          if (catConfig.showAllOption) {
            processGroup("all");
          }
        }
      });
    } catch (e) {
      console.error("Error during route generation for prerender:", e);
    }

    console.log(`🚀 Prerendering ${routes.length} routes...`);
    return routes;
  },
};
