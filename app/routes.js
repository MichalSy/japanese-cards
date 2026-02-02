import { route, index } from "@react-router/dev/routes";

export default [
  index("pages/MainMenu.jsx"),
  route("content/:contentType", "pages/ContentTypeView.jsx"),
  route("content/:contentType/:groupId", "pages/GameModeSelector.jsx"),
  route("game/:contentType/:groupId/:modeId", "pages/GameScreen.jsx"),
];
