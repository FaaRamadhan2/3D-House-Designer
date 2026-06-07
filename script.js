/*
House Blueprint 3D Designer
Copyright (C) 2026 FaaRamadhan2

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

"use strict";

const STORAGE_KEY = "house-blueprint-3d-designer-project";
const HISTORY_LIMIT = 80;
const DEFAULT_PROJECT_NAME = "Untitled House";

const DEFAULT_SETTINGS = {
  gridSize: 40,
  metersPerGrid: 0.5,
  snapEnabled: true,
  wallHeight: 3,
  wallThickness: 0.2,
  defaultDoorWidth: 0.9,
  defaultWindowWidth: 1.2,
  defaultWindowHeight: 1.0,
  defaultWindowSillHeight: 1.0
};

const COLLECTIONS = {
  wall: "walls",
  room: "rooms",
  door: "doors",
  window: "windows",
  floor: "floors",
  roof: "roofs",
  furniture: "furniture",
  dimension: "dimensions",
  label: "labels"
};

const TOOL_LABELS = {
  select: "Select",
  wall: "Wall",
  room: "Room",
  door: "Door",
  window: "Window",
  floor: "Floor",
  roof: "Roof",
  furniture: "Furniture",
  dimension: "Dimension",
  label: "Text/Label",
  eraser: "Eraser"
};

const FURNITURE_PRESETS = {
  single_bed: { label: "Single Bed", category: "Bedroom", width: 2.0, depth: 1.0, height: 0.55, color: "#8b5cf6" },
  bed: { label: "Queen Bed", category: "Bedroom", width: 2.0, depth: 1.6, height: 0.55, color: "#8b5cf6" },
  king_bed: { label: "King Bed", category: "Bedroom", width: 2.1, depth: 1.9, height: 0.55, color: "#7c3aed" },
  bunk_bed: { label: "Bunk Bed", category: "Bedroom", width: 2.05, depth: 1.05, height: 1.85, color: "#7c3aed" },
  crib: { label: "Baby Crib", category: "Bedroom", width: 1.3, depth: 0.75, height: 0.95, color: "#c084fc" },
  nightstand: { label: "Nightstand", category: "Bedroom", width: 0.5, depth: 0.45, height: 0.55, color: "#a16207" },
  wardrobe: { label: "Wardrobe", category: "Bedroom", width: 1.8, depth: 0.6, height: 2.2, color: "#b45309" },
  dresser: { label: "Dresser", category: "Bedroom", width: 1.4, depth: 0.5, height: 0.9, color: "#92400e" },
  vanity_table: { label: "Makeup Vanity", category: "Bedroom", width: 1.1, depth: 0.45, height: 1.45, color: "#be185d" },
  bedroom_bench: { label: "Bedroom Bench", category: "Bedroom", width: 1.2, depth: 0.42, height: 0.48, color: "#a16207" },
  sofa: { label: "Sofa", category: "Living", width: 2.1, depth: 0.85, height: 0.75, color: "#0f766e" },
  l_sofa: { label: "L Sofa", category: "Living", width: 2.4, depth: 1.6, height: 0.78, color: "#0f766e" },
  armchair: { label: "Armchair", category: "Living", width: 0.85, depth: 0.85, height: 0.85, color: "#0f766e" },
  recliner: { label: "Recliner", category: "Living", width: 0.9, depth: 1.15, height: 0.95, color: "#0f766e" },
  ottoman: { label: "Ottoman", category: "Living", width: 0.75, depth: 0.55, height: 0.42, color: "#14b8a6" },
  coffee_table: { label: "Coffee Table", category: "Living", width: 1.2, depth: 0.6, height: 0.42, color: "#a16207" },
  side_table: { label: "Side Table", category: "Living", width: 0.55, depth: 0.55, height: 0.55, color: "#a16207" },
  console_table: { label: "Console Table", category: "Living", width: 1.5, depth: 0.35, height: 0.82, color: "#92400e" },
  tv_stand: { label: "TV Stand", category: "Living", width: 1.8, depth: 0.42, height: 0.55, color: "#334155" },
  tv: { label: "TV", category: "Living", width: 1.5, depth: 0.12, height: 0.9, color: "#111827" },
  bookcase: { label: "Bookcase", category: "Living", width: 1.0, depth: 0.35, height: 2.0, color: "#7c2d12" },
  fireplace: { label: "Fireplace", category: "Living", width: 1.3, depth: 0.35, height: 1.05, color: "#334155" },
  rug: { label: "Area Rug", category: "Living", width: 2.0, depth: 1.4, height: 0.03, color: "#dc2626" },
  floor_lamp: { label: "Floor Lamp", category: "Living", width: 0.45, depth: 0.45, height: 1.7, color: "#f59e0b" },
  table_lamp: { label: "Table Lamp", category: "Living", width: 0.32, depth: 0.32, height: 0.55, color: "#f59e0b" },
  table: { label: "Dining Table", category: "Dining", width: 1.6, depth: 0.9, height: 0.75, color: "#a16207" },
  dining_table_6: { label: "Dining Table 6", category: "Dining", width: 2.0, depth: 1.0, height: 0.75, color: "#92400e" },
  round_table: { label: "Round Table", category: "Dining", width: 1.2, depth: 1.2, height: 0.75, color: "#a16207" },
  chair: { label: "Chair", category: "Dining", width: 0.55, depth: 0.55, height: 0.85, color: "#64748b" },
  dining_bench: { label: "Dining Bench", category: "Dining", width: 1.5, depth: 0.42, height: 0.48, color: "#92400e" },
  bar_stool: { label: "Bar Stool", category: "Dining", width: 0.45, depth: 0.45, height: 0.95, color: "#475569" },
  buffet: { label: "Buffet Cabinet", category: "Dining", width: 1.8, depth: 0.45, height: 0.9, color: "#7c2d12" },
  high_chair: { label: "High Chair", category: "Dining", width: 0.55, depth: 0.55, height: 1.0, color: "#64748b" },
  desk: { label: "Work Desk", category: "Office", width: 1.4, depth: 0.65, height: 0.75, color: "#0ea5e9" },
  office_chair: { label: "Office Chair", category: "Office", width: 0.6, depth: 0.6, height: 0.95, color: "#334155" },
  meeting_table: { label: "Meeting Table", category: "Office", width: 2.4, depth: 1.1, height: 0.75, color: "#0ea5e9" },
  filing_cabinet: { label: "Filing Cabinet", category: "Office", width: 0.6, depth: 0.55, height: 1.05, color: "#64748b" },
  printer: { label: "Printer", category: "Office", width: 0.55, depth: 0.42, height: 0.32, color: "#111827" },
  server_rack: { label: "Server Rack", category: "Office", width: 0.7, depth: 0.9, height: 2.0, color: "#111827" },
  kitchen_counter: { label: "Kitchen Counter", category: "Kitchen", width: 2.4, depth: 0.6, height: 0.9, color: "#64748b" },
  kitchen_island: { label: "Kitchen Island", category: "Kitchen", width: 1.8, depth: 0.9, height: 0.9, color: "#475569" },
  upper_cabinet: { label: "Upper Cabinet", category: "Kitchen", width: 1.6, depth: 0.35, height: 0.8, color: "#64748b" },
  pantry: { label: "Pantry Cabinet", category: "Kitchen", width: 0.9, depth: 0.6, height: 2.1, color: "#92400e" },
  refrigerator: { label: "Refrigerator", category: "Kitchen", width: 0.75, depth: 0.75, height: 1.9, color: "#e2e8f0" },
  stove: { label: "Stove", category: "Kitchen", width: 0.7, depth: 0.65, height: 0.9, color: "#111827" },
  oven: { label: "Wall Oven", category: "Kitchen", width: 0.7, depth: 0.6, height: 1.1, color: "#111827" },
  microwave: { label: "Microwave", category: "Kitchen", width: 0.55, depth: 0.38, height: 0.32, color: "#111827" },
  dishwasher: { label: "Dishwasher", category: "Kitchen", width: 0.6, depth: 0.62, height: 0.85, color: "#94a3b8" },
  range_hood: { label: "Range Hood", category: "Kitchen", width: 0.8, depth: 0.45, height: 0.5, color: "#94a3b8" },
  coffee_machine: { label: "Coffee Machine", category: "Kitchen", width: 0.38, depth: 0.32, height: 0.42, color: "#111827" },
  sink: { label: "Sink", category: "Kitchen", width: 0.8, depth: 0.6, height: 0.9, color: "#94a3b8" },
  toilet: { label: "Toilet", category: "Bathroom", width: 0.45, depth: 0.7, height: 0.75, color: "#f8fafc" },
  bidet: { label: "Bidet", category: "Bathroom", width: 0.45, depth: 0.65, height: 0.55, color: "#f8fafc" },
  shower: { label: "Shower", category: "Bathroom", width: 0.9, depth: 0.9, height: 2.1, color: "#38bdf8" },
  bathtub: { label: "Bathtub", category: "Bathroom", width: 1.7, depth: 0.75, height: 0.55, color: "#e2e8f0" },
  vanity: { label: "Vanity", category: "Bathroom", width: 0.8, depth: 0.5, height: 0.85, color: "#94a3b8" },
  bathroom_mirror: { label: "Bathroom Mirror", category: "Bathroom", width: 0.8, depth: 0.08, height: 0.9, color: "#7dd3fc" },
  towel_rack: { label: "Towel Rack", category: "Bathroom", width: 0.7, depth: 0.12, height: 0.9, color: "#94a3b8" },
  washer: { label: "Washer", category: "Laundry", width: 0.65, depth: 0.65, height: 0.9, color: "#cbd5e1" },
  dryer: { label: "Dryer", category: "Laundry", width: 0.65, depth: 0.65, height: 0.9, color: "#94a3b8" },
  laundry_basket: { label: "Laundry Basket", category: "Laundry", width: 0.55, depth: 0.45, height: 0.55, color: "#f59e0b" },
  ironing_board: { label: "Ironing Board", category: "Laundry", width: 1.25, depth: 0.38, height: 0.85, color: "#64748b" },
  plant: { label: "Plant", category: "Outdoor", width: 0.55, depth: 0.55, height: 1.2, color: "#22c55e" },
  outdoor_table: { label: "Outdoor Table", category: "Outdoor", width: 1.0, depth: 1.0, height: 0.72, color: "#0f766e" },
  patio_chair: { label: "Patio Chair", category: "Outdoor", width: 0.62, depth: 0.65, height: 0.82, color: "#14b8a6" },
  lounge_chair: { label: "Lounge Chair", category: "Outdoor", width: 0.7, depth: 1.2, height: 0.75, color: "#14b8a6" },
  garden_bench: { label: "Garden Bench", category: "Outdoor", width: 1.5, depth: 0.55, height: 0.78, color: "#0f766e" },
  grill: { label: "BBQ Grill", category: "Outdoor", width: 0.9, depth: 0.55, height: 1.1, color: "#111827" },
  patio_umbrella: { label: "Patio Umbrella", category: "Outdoor", width: 1.8, depth: 1.8, height: 2.2, color: "#ef4444" },
  pergola: { label: "Pergola", category: "Outdoor", width: 2.4, depth: 2.0, height: 2.5, color: "#92400e" },
  planter_box: { label: "Planter Box", category: "Outdoor", width: 1.1, depth: 0.42, height: 0.55, color: "#22c55e" },
  car: { label: "Car", category: "Vehicle", width: 4.3, depth: 1.9, height: 1.45, color: "#2563eb" },
  motorcycle: { label: "Motorcycle", category: "Vehicle", width: 2.0, depth: 0.75, height: 1.1, color: "#111827" },
  bicycle: { label: "Bicycle", category: "Vehicle", width: 1.75, depth: 0.55, height: 1.05, color: "#2563eb" },
  scooter: { label: "Scooter", category: "Vehicle", width: 1.55, depth: 0.48, height: 1.05, color: "#ef4444" },
  cabinet: { label: "Cabinet", category: "Storage", width: 1.1, depth: 0.5, height: 1.8, color: "#b45309" },
  storage_shelf: { label: "Storage Shelf", category: "Storage", width: 1.2, depth: 0.45, height: 1.8, color: "#78350f" },
  shoe_rack: { label: "Shoe Rack", category: "Storage", width: 1.0, depth: 0.35, height: 0.75, color: "#78350f" },
  coat_rack: { label: "Coat Rack", category: "Storage", width: 0.5, depth: 0.5, height: 1.75, color: "#92400e" },
  workbench: { label: "Workbench", category: "Garage", width: 1.8, depth: 0.65, height: 0.9, color: "#78350f" },
  tool_chest: { label: "Tool Chest", category: "Garage", width: 0.85, depth: 0.5, height: 0.9, color: "#dc2626" },
  treadmill: { label: "Treadmill", category: "Fitness", width: 1.7, depth: 0.75, height: 1.25, color: "#111827" },
  exercise_bike: { label: "Exercise Bike", category: "Fitness", width: 1.1, depth: 0.55, height: 1.15, color: "#334155" }
};

const FURNITURE_TYPES = Object.entries(FURNITURE_PRESETS).map(([value, preset]) => ({
  value,
  label: preset.label,
  category: preset.category
}));

const RENDER_3D_DEFAULTS = {
  detail: "detailed",
  shadows: true,
  autoStairs: true
};

let project;
let canvas;
let ctx;
let canvasSize = { width: 1, height: 1, dpr: 1 };
let threeContainer;
let webglError;
let scene;
let camera;
let renderer;
let controls;
let root3D;
let currentTool = "select";
let selectedRef = null;
let drawingState = null;
let dragState = null;
let panState = null;
let spacePressed = false;
let viewMode = "split";
let view = { offsetX: 0, offsetY: 0, scale: 1 };
let pointerWorld = { x: 0, y: 0 };
let history = [];
let historyIndex = -1;
let suppressHistory = false;
let lastStatusMessage = "Ready";
let render3DOptions = { ...RENDER_3D_DEFAULTS };

let dom = {};

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  project = createEmptyProject();
  collectDom();
  populateFurnitureControls();
  initCanvas2D();
  bindUI();
  updateRender3DOptions();
  initThree();
  setTool("select");
  resetView();
  pushHistory();
  updatePropertiesPanel();
  render2D();
  generate3DFromProject();
  setStatusMessage("Ready");
}

function collectDom() {
  canvas = document.getElementById("blueprintCanvas");
  ctx = canvas.getContext("2d");
  threeContainer = document.getElementById("threeContainer");
  webglError = document.getElementById("webglError");
  dom.app = document.getElementById("app");
  dom.propertiesPanel = document.getElementById("propertiesPanel");
  dom.statusTool = document.getElementById("statusTool");
  dom.statusMouse = document.getElementById("statusMouse");
  dom.statusZoom = document.getElementById("statusZoom");
  dom.statusGrid = document.getElementById("statusGrid");
  dom.statusSnap = document.getElementById("statusSnap");
  dom.statusSelected = document.getElementById("statusSelected");
  dom.statusMessage = document.getElementById("statusMessage");
  dom.jsonFileInput = document.getElementById("jsonFileInput");
  dom.furnitureType = document.getElementById("furnitureType");
  dom.defaultRoofType = document.getElementById("defaultRoofType");
  dom.modelDetail = document.getElementById("modelDetail");
  dom.shadowToggle = document.getElementById("shadowToggle");
  dom.stairsToggle = document.getElementById("stairsToggle");
  dom.snapButton = document.getElementById("snapButton");
}

function getFurniturePreset(type) {
  return FURNITURE_PRESETS[type] || FURNITURE_PRESETS.bed;
}

function getFurnitureDisplayName(type) {
  const preset = getFurniturePreset(type);
  return preset.label || "Furniture";
}

function getFurnitureSelectOptions() {
  return FURNITURE_TYPES.map(({ value, label, category }) => [value, `${category} - ${label}`]);
}

function populateFurnitureControls() {
  populateFurnitureSelect(dom.furnitureType, dom.furnitureType?.value || "bed");
}

function populateFurnitureSelect(select, selectedValue = "bed") {
  if (!select) return;
  const nextValue = FURNITURE_PRESETS[selectedValue] ? selectedValue : "bed";
  select.innerHTML = "";

  let currentGroup = null;
  let optGroup = null;
  FURNITURE_TYPES.forEach(({ value, label, category }) => {
    if (category !== currentGroup) {
      currentGroup = category;
      optGroup = document.createElement("optgroup");
      optGroup.label = category;
      select.appendChild(optGroup);
    }
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = value === nextValue;
    optGroup.appendChild(option);
  });
}

function createEmptyProject() {
  const now = new Date().toISOString();
  return {
    meta: {
      name: DEFAULT_PROJECT_NAME,
      version: "1.0.0",
      units: "meters",
      createdAt: now,
      updatedAt: now
    },
    settings: { ...DEFAULT_SETTINGS },
    walls: [],
    rooms: [],
    doors: [],
    windows: [],
    floors: [],
    roofs: [],
    furniture: [],
    dimensions: [],
    labels: []
  };
}

function bindUI() {
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => setTool(button.dataset.tool));
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setViewMode(button.dataset.view));
  });

  dom.propertiesPanel.addEventListener("input", (event) => {
    const target = event.target;
    if (target.matches("[data-prop]")) {
      applyPropertyChange(target.dataset.prop, readInputValue(target), false);
    }
    if (target.matches("[data-setting]")) {
      applySettingChange(target.dataset.setting, readInputValue(target), false);
    }
  });

  dom.propertiesPanel.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-prop]")) {
      applyPropertyChange(target.dataset.prop, readInputValue(target), true);
    }
    if (target.matches("[data-setting]")) {
      applySettingChange(target.dataset.setting, readInputValue(target), true);
    }
  });

  dom.propertiesPanel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-orientation-action]");
    if (!button) return;
    handleOrientationAction(button.dataset.orientationAction);
  });

  dom.jsonFileInput.addEventListener("change", importJSON);

  [dom.modelDetail, dom.shadowToggle, dom.stairsToggle].forEach((control) => {
    if (!control) return;
    control.addEventListener("change", () => {
      updateRender3DOptions();
      generate3DFromProject();
      setStatusMessage("3D model detail updated");
    });
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    resizeThree();
    render2D();
    render3D();
  });

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

function handleAction(action) {
  switch (action) {
    case "new":
      newProject();
      break;
    case "save":
      saveProject();
      break;
    case "load":
      loadProject();
      break;
    case "export-json":
      exportJSON();
      break;
    case "import-json":
      dom.jsonFileInput.click();
      break;
    case "export-blueprint":
      exportBlueprintPNG();
      break;
    case "export-3d":
      export3DScreenshot();
      break;
    case "zoom-in":
      zoomAt(canvasSize.width / 2, canvasSize.height / 2, 1.2);
      break;
    case "zoom-out":
      zoomAt(canvasSize.width / 2, canvasSize.height / 2, 1 / 1.2);
      break;
    case "reset-view":
      resetView();
      break;
    case "fit-view":
      fitBlueprintToScreen();
      break;
    case "toggle-snap":
      project.settings.snapEnabled = !project.settings.snapEnabled;
      pushHistory();
      updateStatus();
      updatePropertiesPanel();
      setStatusMessage(project.settings.snapEnabled ? "Snap enabled" : "Snap disabled");
      break;
    case "reset-camera":
      resetCamera();
      break;
    case "delete-selected":
      deleteSelected();
      break;
    default:
      break;
  }
}

function handleOrientationAction(action) {
  if (action === "rotate-left") rotateSelectedObject(-15);
  if (action === "rotate-right") rotateSelectedObject(15);
  if (action === "flip") rotateSelectedObject(180);
  if (action === "reset") setSelectedObjectRotation(0);
}

function rotateSelectedObject(deltaDegrees) {
  const object = getSelectedObject();
  if (!object || selectedRef?.type !== "furniture") return;
  setSelectedObjectRotation((Number(object.rotation) || 0) + deltaDegrees);
}

function setSelectedObjectRotation(degrees) {
  const object = getSelectedObject();
  if (!object || selectedRef?.type !== "furniture") return;
  object.rotation = normalizeRotation(degrees);
  project.meta.updatedAt = new Date().toISOString();
  render2D();
  generate3DFromProject();
  updateStatus();
  updatePropertiesPanel();
  pushHistory();
  setStatusMessage(`Orientation set to ${object.rotation} deg`);
}

function updateRender3DOptions() {
  render3DOptions = {
    detail: dom.modelDetail ? dom.modelDetail.value : RENDER_3D_DEFAULTS.detail,
    shadows: dom.shadowToggle ? dom.shadowToggle.checked : RENDER_3D_DEFAULTS.shadows,
    autoStairs: dom.stairsToggle ? dom.stairsToggle.checked : RENDER_3D_DEFAULTS.autoStairs
  };
}

function initCanvas2D() {
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());
  canvas.addEventListener("mousedown", handleCanvasMouseDown);
  canvas.addEventListener("mousemove", handleCanvasMouseMove);
  canvas.addEventListener("mouseup", handleCanvasMouseUp);
  canvas.addEventListener("mouseleave", handleCanvasMouseUp);
  canvas.addEventListener("wheel", handleCanvasWheel, { passive: false });
  resizeCanvas();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  canvasSize = { width, height, dpr };
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function initThree() {
  if (!window.THREE || !isWebGLAvailable()) {
    webglError.hidden = false;
    setStatusMessage("WebGL or Three.js is not available");
    return;
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1016);

  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2000);
  camera.position.set(7, 7, 9);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  threeContainer.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xdbeafe, 0x111827, 0.38);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 0.95);
  sun.position.set(9, 16, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.left = -24;
  sun.shadow.camera.right = 24;
  sun.shadow.camera.top = 24;
  sun.shadow.camera.bottom = -24;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 60;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x93c5fd, 0.24);
  fill.position.set(-10, 8, -12);
  scene.add(fill);

  const grid = new THREE.GridHelper(80, 80, 0x334155, 0x1f2937);
  grid.name = "scene-grid";
  scene.add(grid);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.22 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.015;
  ground.receiveShadow = true;
  scene.add(ground);

  root3D = new THREE.Group();
  root3D.name = "generated-house-root";
  scene.add(root3D);

  resizeThree();
  animateThree();
}

function isWebGLAvailable() {
  try {
    const testCanvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
  } catch (error) {
    return false;
  }
}

function animateThree() {
  requestAnimationFrame(animateThree);
  if (controls) controls.update();
  render3D();
}

function resizeThree() {
  if (!renderer || !camera) return;
  const width = Math.max(1, threeContainer.clientWidth);
  const height = Math.max(1, threeContainer.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function render3D() {
  if (!renderer || !scene || !camera) return;
  renderer.render(scene, camera);
}

function setTool(toolName) {
  if (!TOOL_LABELS[toolName]) return;
  currentTool = toolName;
  drawingState = null;
  dragState = null;
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === toolName);
  });
  canvas.style.cursor = toolName === "select" ? "default" : "crosshair";
  updateStatus();
  setStatusMessage(`${TOOL_LABELS[toolName]} tool active`);
}

function setViewMode(mode) {
  if (!["2d", "3d", "split"].includes(mode)) return;
  viewMode = mode;
  dom.app.classList.remove("view-2d", "view-3d", "view-split");
  dom.app.classList.add(`view-${mode}`);
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === mode);
  });
  requestAnimationFrame(() => {
    resizeCanvas();
    resizeThree();
    render2D();
    render3D();
  });
}

function handleCanvasMouseDown(event) {
  const point = getCanvasPoint(event);
  const world = screenToWorld(point.x, point.y);
  pointerWorld = world;

  if (event.button === 1 || event.button === 2 || spacePressed) {
    panState = {
      x: point.x,
      y: point.y,
      offsetX: view.offsetX,
      offsetY: view.offsetY
    };
    canvas.style.cursor = "grabbing";
    return;
  }

  if (currentTool === "select") {
    const hit = getObjectAt(world);
    selectObject(hit);
    if (hit) {
      dragState = {
        ref: { ...hit },
        start: world,
        last: world,
        moved: false
      };
    }
    return;
  }

  if (currentTool === "eraser") {
    const hit = getObjectAt(world);
    if (hit) {
      selectObject(hit);
      deleteSelected();
    } else {
      setStatusMessage("No object under cursor");
    }
    return;
  }

  if (currentTool === "door") {
    const added = addDoor(world.x, world.y);
    if (added) {
      selectObject({ type: "door", id: added.id });
      pushHistory();
    }
    return;
  }

  if (currentTool === "window") {
    const added = addWindow(world.x, world.y);
    if (added) {
      selectObject({ type: "window", id: added.id });
      pushHistory();
    }
    return;
  }

  if (currentTool === "label") {
    const snapped = snapPoint(world);
    const text = window.prompt("Label text", "Room label");
    if (text === null) {
      setStatusMessage("Label cancelled");
      return;
    }
    const added = addLabel(snapped.x, snapped.y, text.trim() || "Label");
    selectObject({ type: "label", id: added.id });
    pushHistory();
    return;
  }

  const start = currentTool === "wall" || currentTool === "room" || currentTool === "floor" || currentTool === "roof" || currentTool === "furniture" || currentTool === "dimension"
    ? snapPoint(world)
    : world;

  drawingState = {
    tool: currentTool,
    start,
    current: start
  };
}

function handleCanvasMouseMove(event) {
  const point = getCanvasPoint(event);
  const rawWorld = screenToWorld(point.x, point.y);
  pointerWorld = rawWorld;

  if (panState) {
    view.offsetX = panState.offsetX + point.x - panState.x;
    view.offsetY = panState.offsetY + point.y - panState.y;
    render2D();
    updateStatus();
    return;
  }

  if (drawingState) {
    let current = snapPoint(rawWorld);
    if (drawingState.tool === "wall" && event.shiftKey) {
      current = constrainAxis(drawingState.start, current);
    }
    drawingState.current = current;
    render2D();
    updateStatus();
    return;
  }

  if (dragState && selectedRef) {
    const selected = getSelectedObject();
    if (!selected) return;
    const moveWorld = project.settings.snapEnabled && selectedRef.type !== "door" && selectedRef.type !== "window"
      ? snapPoint(rawWorld)
      : rawWorld;
    const dx = moveWorld.x - dragState.last.x;
    const dy = moveWorld.y - dragState.last.y;
    if (Math.abs(moveWorld.x - dragState.start.x) > 0.5 || Math.abs(moveWorld.y - dragState.start.y) > 0.5) {
      dragState.moved = true;
    }
    moveSelected(dx, dy, moveWorld);
    dragState.last = moveWorld;
    render2D();
    generate3DFromProject();
    updatePropertiesPanel();
  }

  updateStatus();
}

function handleCanvasMouseUp() {
  if (panState) {
    panState = null;
    canvas.style.cursor = currentTool === "select" ? "default" : "crosshair";
    return;
  }

  if (drawingState) {
    finishDrawing();
    drawingState = null;
    render2D();
    generate3DFromProject();
    updateStatus();
    return;
  }

  if (dragState) {
    if (dragState.moved) {
      pushHistory();
      updatePropertiesPanel();
      setStatusMessage("Object moved");
    }
    dragState = null;
  }
}

function handleCanvasWheel(event) {
  event.preventDefault();
  const point = getCanvasPoint(event);
  const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  zoomAt(point.x, point.y, factor);
}

function zoomAt(screenX, screenY, factor) {
  const before = screenToWorld(screenX, screenY);
  const baseScale = pixelsPerMeter();
  view.scale = clamp(view.scale * factor, baseScale * 0.02, baseScale * 12);
  view.offsetX = screenX - before.x * view.scale;
  view.offsetY = screenY - before.y * view.scale;
  render2D();
  updateStatus();
}

function resetView() {
  view.scale = pixelsPerMeter();
  view.offsetX = canvasSize.width / 2;
  view.offsetY = canvasSize.height / 2;
  render2D();
  updateStatus();
}

function fitBlueprintToScreen() {
  const bounds = getProjectBounds();
  if (!bounds) {
    resetView();
    setStatusMessage("No blueprint objects to fit");
    return;
  }
  const padding = 70;
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const baseScale = pixelsPerMeter();
  view.scale = clamp(
    Math.min((canvasSize.width - padding * 2) / width, (canvasSize.height - padding * 2) / height),
    baseScale * 0.02,
    baseScale * 12
  );
  view.offsetX = canvasSize.width / 2 - ((bounds.minX + bounds.maxX) / 2) * view.scale;
  view.offsetY = canvasSize.height / 2 - ((bounds.minY + bounds.maxY) / 2) * view.scale;
  render2D();
  updateStatus();
  setStatusMessage("Blueprint fitted to screen");
}

function resetCamera() {
  if (!camera || !controls) return;
  const framed = frameCameraToProject();
  if (!framed) {
    camera.position.set(7, 7, 9);
    controls.target.set(0, 0, 0);
  }
  controls.update();
  render3D();
  setStatusMessage("3D camera reset");
}

function frameCameraToProject() {
  if (!camera || !controls) return false;
  const bounds = getProjectBounds();
  if (!bounds) return false;
  const vertical = getProjectVerticalBounds();
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const depth = Math.max(1, bounds.maxY - bounds.minY);
  const height = Math.max(1, vertical.maxY - vertical.minY);
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerZ = (bounds.minY + bounds.maxY) / 2;
  const centerY = vertical.minY + height * 0.45;
  const size = Math.max(width, depth, height);
  camera.position.set(centerX + size * 0.9, centerY + size * 0.7, centerZ + size * 1.15);
  controls.target.set(centerX, centerY, centerZ);
  camera.near = 0.05;
  camera.far = Math.max(1000, size * 20);
  camera.updateProjectionMatrix();
  controls.update();
  return true;
}

function finishDrawing() {
  const { tool, start, current } = drawingState;
  const dx = current.x - start.x;
  const dy = current.y - start.y;
  const distance = Math.hypot(dx, dy);

  if (tool === "wall") {
    if (distance < 0.05) {
      setStatusMessage("Wall is too short");
      return;
    }
    const wall = addWall(start.x, start.y, current.x, current.y);
    selectObject({ type: "wall", id: wall.id });
    pushHistory();
    return;
  }

  if (tool === "dimension") {
    if (distance < 0.05) {
      setStatusMessage("Dimension is too short");
      return;
    }
    const dimension = addDimension(start.x, start.y, current.x, current.y);
    selectObject({ type: "dimension", id: dimension.id });
    pushHistory();
    return;
  }

  if (tool === "furniture") {
    const furniture = addFurnitureFromDrag(start, current);
    selectObject({ type: "furniture", id: furniture.id });
    pushHistory();
    return;
  }

  const rect = normalizeRect(start.x, start.y, current.x, current.y);
  if (rect.width < 0.05 || rect.height < 0.05) {
    setStatusMessage(`${TOOL_LABELS[tool]} rectangle is too small`);
    return;
  }

  if (tool === "room") {
    const room = addRoom(rect.x, rect.y, rect.width, rect.height);
    selectObject({ type: "room", id: room.id });
    pushHistory();
  } else if (tool === "floor") {
    const floor = addFloor(rect.x, rect.y, rect.width, rect.height);
    selectObject({ type: "floor", id: floor.id });
    pushHistory();
  } else if (tool === "roof") {
    const roof = addRoof(rect.x, rect.y, rect.width, rect.height);
    selectObject({ type: "roof", id: roof.id });
    pushHistory();
  }
}

function moveSelected(dx, dy, absolutePoint) {
  const object = getSelectedObject();
  if (!object) return;

  if (selectedRef.type === "door" || selectedRef.type === "window") {
    const wall = getObjectById("wall", object.wallId);
    if (!wall) return;
    object.ratio = clamp(getRatioOnWall(wall, absolutePoint.x, absolutePoint.y), 0, 1);
    return;
  }

  if (selectedRef.type === "wall") {
    object.x1 += dx;
    object.y1 += dy;
    object.x2 += dx;
    object.y2 += dy;
    return;
  }

  if (selectedRef.type === "room") {
    object.x += dx;
    object.y += dy;
    moveWallsByIds(object.wallIds, dx, dy);
    return;
  }

  if (selectedRef.type === "dimension") {
    object.x1 += dx;
    object.y1 += dy;
    object.x2 += dx;
    object.y2 += dy;
    return;
  }

  if (selectedRef.type === "label") {
    object.x += dx;
    object.y += dy;
    return;
  }

  if ("x" in object) object.x += dx;
  if ("y" in object) object.y += dy;
}

function moveWallsByIds(wallIds, dx, dy) {
  if (!Array.isArray(wallIds)) return;
  wallIds.forEach((id) => {
    const wall = getObjectById("wall", id);
    if (!wall) return;
    wall.x1 += dx;
    wall.y1 += dy;
    wall.x2 += dx;
    wall.y2 += dy;
  });
}

function handleKeyDown(event) {
  if (event.key === " ") spacePressed = true;
  const key = event.key.toLowerCase();
  const typing = isTypingTarget(event.target);

  if (event.ctrlKey && key === "s") {
    event.preventDefault();
    saveProject();
    return;
  }
  if (event.ctrlKey && key === "o") {
    event.preventDefault();
    loadProject();
    return;
  }
  if (event.ctrlKey && key === "z") {
    event.preventDefault();
    undo();
    return;
  }
  if (event.ctrlKey && key === "y") {
    event.preventDefault();
    redo();
    return;
  }

  if (typing) return;

  if (event.key === "Delete" || event.key === "Backspace") {
    deleteSelected();
    return;
  }

  if (event.key === "Escape") {
    drawingState = null;
    dragState = null;
    panState = null;
    render2D();
    setStatusMessage("Current action cancelled");
    return;
  }

  if (selectedRef?.type === "furniture") {
    if (key === "r") {
      event.preventDefault();
      rotateSelectedObject(event.shiftKey ? -15 : 15);
      return;
    }
    if (key === "q") {
      event.preventDefault();
      rotateSelectedObject(-15);
      return;
    }
    if (key === "e") {
      event.preventDefault();
      rotateSelectedObject(15);
      return;
    }
    if (key === "f") {
      event.preventDefault();
      rotateSelectedObject(180);
      return;
    }
  }

  const shortcutMap = {
    v: "select",
    w: "wall",
    r: "room",
    d: "door",
    n: "window",
    f: "floor",
    t: "label"
  };
  if (shortcutMap[key]) setTool(shortcutMap[key]);
}

function handleKeyUp(event) {
  if (event.key === " ") spacePressed = false;
}

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function render2D() {
  if (!ctx) return;
  ctx.setTransform(canvasSize.dpr, 0, 0, canvasSize.dpr, 0, 0);
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  ctx.fillStyle = "#101620";
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

  ctx.save();
  ctx.translate(view.offsetX, view.offsetY);
  ctx.scale(view.scale, view.scale);

  drawGrid();
  drawFloors();
  drawRooms();
  drawRoofs();
  drawWalls();
  drawDoorsAndWindows();
  drawFurniture();
  drawDimensions();
  drawGrid(true);
  drawRoomLabels();
  drawLabels();
  drawDrawingPreview();
  drawSelectionHighlight();

  ctx.restore();
}

function drawGrid(overlay = false) {
  const minor = Math.max(0.01, Number(project.settings.metersPerGrid) || DEFAULT_SETTINGS.metersPerGrid);
  const major = minor * 5;
  const topLeft = screenToWorld(0, 0);
  const bottomRight = screenToWorld(canvasSize.width, canvasSize.height);
  const minX = Math.floor(topLeft.x / minor) * minor - minor;
  const maxX = Math.ceil(bottomRight.x / minor) * minor + minor;
  const minY = Math.floor(topLeft.y / minor) * minor - minor;
  const maxY = Math.ceil(bottomRight.y / minor) * minor + minor;

  ctx.lineWidth = (overlay ? 0.9 : 1) / view.scale;
  ctx.strokeStyle = overlay ? "rgba(203, 213, 225, 0.28)" : "#1d2733";
  ctx.beginPath();
  for (let x = minX; x <= maxX; x += minor) {
    ctx.moveTo(x, minY);
    ctx.lineTo(x, maxY);
  }
  for (let y = minY; y <= maxY; y += minor) {
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
  }
  ctx.stroke();

  ctx.strokeStyle = overlay ? "rgba(203, 213, 225, 0.42)" : "#2e3a49";
  ctx.lineWidth = (overlay ? 1.2 : 1.4) / view.scale;
  ctx.beginPath();
  for (let x = Math.floor(minX / major) * major; x <= maxX; x += major) {
    ctx.moveTo(x, minY);
    ctx.lineTo(x, maxY);
  }
  for (let y = Math.floor(minY / major) * major; y <= maxY; y += major) {
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
  }
  ctx.stroke();

  if (!overlay) {
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.6 / view.scale;
    ctx.beginPath();
    ctx.moveTo(minX, 0);
    ctx.lineTo(maxX, 0);
    ctx.moveTo(0, minY);
    ctx.lineTo(0, maxY);
    ctx.stroke();
  }
}

function drawFloors() {
  project.floors.forEach((floor) => {
    ctx.save();
    ctx.fillStyle = withAlpha(floor.color || "#475569", 0.2);
    ctx.strokeStyle = floor.color || "#64748b";
    ctx.lineWidth = 1.5 / view.scale;
    ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
    ctx.strokeRect(floor.x, floor.y, floor.width, floor.height);
    drawSmallTag("Floor", floor.x + 8 / view.scale, floor.y + 18 / view.scale, floor.color || "#cbd5e1");
    ctx.restore();
  });
}

function drawRooms() {
  project.rooms.forEach((room) => {
    ctx.save();
    ctx.fillStyle = withAlpha(room.fillColor || "#3b82f6", 0.07);
    ctx.strokeStyle = withAlpha(room.fillColor || "#3b82f6", 0.65);
    ctx.lineWidth = 1.5 / view.scale;
    ctx.setLineDash([8 / view.scale, 8 / view.scale]);
    ctx.fillRect(room.x, room.y, room.width, room.height);
    ctx.strokeRect(room.x, room.y, room.width, room.height);
    ctx.setLineDash([]);
    ctx.restore();
  });
}

function drawRoomLabels() {
  project.rooms.forEach((room) => {
    ctx.save();
    ctx.fillStyle = "#dbeafe";
    ctx.font = `${12 / view.scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const area = getRectAreaMeters(room.width, room.height).toFixed(2);
    ctx.fillText(room.name || "Room", room.x + room.width / 2, room.y + room.height / 2 - 8 / view.scale);
    ctx.fillStyle = "#93c5fd";
    ctx.fillText(`${area} m2`, room.x + room.width / 2, room.y + room.height / 2 + 10 / view.scale);
    ctx.restore();
  });
}

function drawRoofs() {
  project.roofs.forEach((roof) => {
    ctx.save();
    ctx.fillStyle = withAlpha(roof.color || "#7c2d12", 0.1);
    ctx.strokeStyle = roof.color || "#ea580c";
    ctx.lineWidth = 1.6 / view.scale;
    ctx.setLineDash([10 / view.scale, 5 / view.scale]);
    ctx.fillRect(roof.x, roof.y, roof.width, roof.height);
    ctx.strokeRect(roof.x, roof.y, roof.width, roof.height);
    ctx.setLineDash([]);
    if (roof.roofType === "gable") {
      ctx.beginPath();
      if (roof.width >= roof.height) {
        ctx.moveTo(roof.x, roof.y + roof.height / 2);
        ctx.lineTo(roof.x + roof.width, roof.y + roof.height / 2);
      } else {
        ctx.moveTo(roof.x + roof.width / 2, roof.y);
        ctx.lineTo(roof.x + roof.width / 2, roof.y + roof.height);
      }
      ctx.stroke();
    }
    drawSmallTag(roof.roofType === "gable" ? "Gable roof" : "Flat roof", roof.x + 8 / view.scale, roof.y + 18 / view.scale, "#fed7aa");
    ctx.restore();
  });
}

function drawWalls() {
  project.walls.forEach((wall) => {
    if (wall.openingGuide || wall.skip2D) return;
    const thickness = Math.max(0.03, Number(wall.thickness) || project.settings.wallThickness);
    ctx.save();
    ctx.lineCap = "square";
    ctx.strokeStyle = wall.color || "#e5e7eb";
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = Math.max(1, 1.5 / view.scale);
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();

    const mx = (wall.x1 + wall.x2) / 2;
    const my = (wall.y1 + wall.y2) / 2;
    const length = getWallLength(wall).toFixed(2);
    drawSmallTag(`${length} m`, mx + 6 / view.scale, my - 8 / view.scale, "#f8fafc");
    ctx.restore();
  });
}

function drawDoorsAndWindows() {
  project.doors.forEach((door) => drawDoor2D(door));
  project.windows.forEach((windowObject) => drawWindow2D(windowObject));
}

function drawDoor2D(door) {
  const wall = getObjectById("wall", door.wallId);
  if (!wall) return;
  const point = getWallPointAtRatio(wall, door.ratio);
  const angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
  const width = Number(door.width) || project.settings.defaultDoorWidth;
  const swing = door.swingDirection === "right" ? 1 : -1;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(angle);
  ctx.lineWidth = Math.max(2, 2 / view.scale);
  ctx.strokeStyle = "#fbbf24";
  ctx.fillStyle = withAlpha("#f59e0b", 0.28);
  ctx.fillRect(-width / 2, -0.08, width, 0.16);
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  ctx.lineTo(-width / 2, swing * width);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-width / 2, 0, width, swing < 0 ? -Math.PI / 2 : 0, swing < 0 ? 0 : Math.PI / 2, swing < 0);
  ctx.stroke();
  ctx.restore();
}

function drawWindow2D(windowObject) {
  const wall = getObjectById("wall", windowObject.wallId);
  if (!wall) return;
  const point = getWallPointAtRatio(wall, windowObject.ratio);
  const angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
  const width = Number(windowObject.width) || project.settings.defaultWindowWidth;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(angle);
  ctx.lineWidth = Math.max(4, 4 / view.scale);
  ctx.strokeStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  ctx.lineTo(width / 2, 0);
  ctx.stroke();
  ctx.lineWidth = Math.max(1, 1.2 / view.scale);
  ctx.strokeStyle = "#bae6fd";
  ctx.beginPath();
  ctx.moveTo(-width / 2, -5 / view.scale);
  ctx.lineTo(width / 2, -5 / view.scale);
  ctx.moveTo(-width / 2, 5 / view.scale);
  ctx.lineTo(width / 2, 5 / view.scale);
  ctx.stroke();
  ctx.restore();
}

function drawFurniture() {
  project.furniture.forEach((item) => {
    const type = item.furnitureType || "bed";
    const preset = getFurniturePreset(type);
    const label = getFurnitureDisplayName(item.furnitureType);
    const width = Math.max(0.05, Math.abs(item.width));
    const depth = Math.max(0.05, Math.abs(item.height));
    const color = item.color || preset.color;
    ctx.save();
    ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
    ctx.rotate(degToRad(item.rotation || 0));
    drawFurnitureBase2D(width, depth, color);
    drawFurnitureSymbol2D(type, width, depth, color);
    drawFurnitureLabel2D(label, width, depth);
    ctx.restore();
  });
}

function drawFurnitureBase2D(width, depth, color) {
  ctx.fillStyle = withAlpha(color || "#8b5cf6", 0.36);
  ctx.strokeStyle = color || "#c4b5fd";
  ctx.lineWidth = 1.35 / view.scale;
  drawRoundedRect2D(-width / 2, -depth / 2, width, depth, Math.min(width, depth) * 0.06);
  ctx.fill();
  ctx.stroke();
}

function drawFurnitureSymbol2D(type, width, depth, color) {
  const stroke = "#e2e8f0";
  const dark = "#0f172a";
  const light = "#f8fafc";
  const metal = "#94a3b8";
  const glass = "#7dd3fc";
  const wood = "#92400e";
  const green = "#22c55e";
  const primary = color || "#8b5cf6";

  if (["single_bed", "bed", "king_bed", "bunk_bed", "crib"].includes(type)) {
    drawBedSymbol2D(type, width, depth, primary, dark, light);
    return;
  }

  if (["sofa", "l_sofa", "armchair", "recliner", "ottoman", "lounge_chair", "patio_chair"].includes(type)) {
    drawSeatingSymbol2D(type, width, depth, primary, dark, light);
    return;
  }

  if (["chair", "office_chair", "bar_stool", "high_chair", "dining_bench", "bedroom_bench", "garden_bench"].includes(type)) {
    drawChairSymbol2D(type, width, depth, primary, dark);
    return;
  }

  if (["table", "dining_table_6", "round_table", "outdoor_table", "coffee_table", "side_table", "console_table", "meeting_table"].includes(type)) {
    drawTableSymbol2D(type, width, depth, primary, wood, dark);
    return;
  }

  if (["desk", "vanity_table", "printer", "filing_cabinet", "server_rack"].includes(type)) {
    drawOfficeSymbol2D(type, width, depth, primary, dark, metal, glass);
    return;
  }

  if (["kitchen_counter", "kitchen_island", "upper_cabinet", "pantry", "refrigerator", "stove", "oven", "microwave", "dishwasher", "range_hood", "coffee_machine", "sink"].includes(type)) {
    drawKitchenSymbol2D(type, width, depth, primary, dark, metal, glass, light);
    return;
  }

  if (["toilet", "bidet", "shower", "bathtub", "vanity", "bathroom_mirror", "towel_rack", "washer", "dryer", "laundry_basket", "ironing_board"].includes(type)) {
    drawBathLaundrySymbol2D(type, width, depth, primary, dark, metal, glass, light);
    return;
  }

  if (["tv", "tv_stand", "bookcase", "storage_shelf", "wardrobe", "dresser", "nightstand", "cabinet", "buffet", "shoe_rack", "coat_rack", "workbench", "tool_chest"].includes(type)) {
    drawStorageSymbol2D(type, width, depth, primary, dark, metal, wood, glass);
    return;
  }

  if (["plant", "planter_box", "grill", "patio_umbrella", "pergola", "fireplace", "rug", "floor_lamp", "table_lamp"].includes(type)) {
    drawOutdoorDecorSymbol2D(type, width, depth, primary, dark, metal, wood, green);
    return;
  }

  if (["car", "motorcycle", "bicycle", "scooter"].includes(type)) {
    drawVehicleSymbol2D(type, width, depth, primary, dark, glass, metal);
    return;
  }

  if (["treadmill", "exercise_bike"].includes(type)) {
    drawFitnessSymbol2D(type, width, depth, primary, dark, metal);
    return;
  }

  drawRect2D(-width * 0.32, -depth * 0.24, width * 0.64, depth * 0.48, withAlpha(primary, 0.5), stroke);
}

function drawFurnitureLabel2D(label, width, depth) {
  const textY = Math.max(-depth / 2 + 0.08, depth / 2 - 9 / view.scale);
  ctx.fillStyle = "#f8fafc";
  ctx.font = `${9 / view.scale}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  const maxTextWidth = Math.max(0.25, width * 0.84);
  let displayText = label;
  while (displayText.length > 4 && ctx.measureText(displayText).width > maxTextWidth) {
    displayText = displayText.slice(0, -2).trimEnd();
  }
  if (displayText !== label) displayText = `${displayText}..`;
  drawSmallLabelBack(displayText, 0, textY, maxTextWidth);
  ctx.fillText(displayText, 0, textY);
}

function drawSmallLabelBack(text, x, y, maxWidth) {
  const paddingX = 4 / view.scale;
  const paddingY = 2 / view.scale;
  const width = Math.min(maxWidth, ctx.measureText(text).width + paddingX * 2);
  const height = 11 / view.scale;
  ctx.save();
  ctx.fillStyle = withAlpha("#020617", 0.62);
  drawRoundedRect2D(x - width / 2, y - height + paddingY, width, height, 3 / view.scale);
  ctx.fill();
  ctx.restore();
}

function drawBedSymbol2D(type, width, depth, primary, dark, light) {
  drawRect2D(-width * 0.43, -depth * 0.36, width * 0.86, depth * 0.72, withAlpha(primary, 0.48), light);
  drawRect2D(-width * 0.5, -depth * 0.5, width, depth * 0.13, withAlpha(dark, 0.7), dark);
  if (type === "bunk_bed") {
    drawLine2D(-width * 0.44, 0, width * 0.44, 0, dark, 1.2);
    [-0.42, 0.42].forEach((x) => drawLine2D(x * width, -depth * 0.48, x * width, depth * 0.48, dark, 1.2));
  } else if (type === "crib") {
    [-0.3, -0.15, 0, 0.15, 0.3].forEach((x) => drawLine2D(x * width, -depth * 0.48, x * width, depth * 0.48, light, 0.9));
  } else {
    const pillows = width > 1.2 ? [-0.22, 0.22] : [0];
    pillows.forEach((x) => drawRect2D(x * width - width * 0.13, -depth * 0.28, width * 0.26, depth * 0.16, withAlpha(light, 0.86), light));
  }
}

function drawSeatingSymbol2D(type, width, depth, primary, dark, light) {
  drawRect2D(-width * 0.42, -depth * 0.25, width * 0.84, depth * 0.58, withAlpha(primary, 0.58), light);
  drawRect2D(-width * 0.48, -depth * 0.48, width * 0.96, depth * 0.14, withAlpha(dark, 0.58), dark);
  if (["sofa", "l_sofa", "armchair", "recliner", "patio_chair"].includes(type)) {
    drawRect2D(-width * 0.5, -depth * 0.28, width * 0.12, depth * 0.62, withAlpha(primary, 0.72), light);
    drawRect2D(width * 0.38, -depth * 0.28, width * 0.12, depth * 0.62, withAlpha(primary, 0.72), light);
  }
  if (type === "l_sofa") drawRect2D(-width * 0.48, -depth * 0.05, width * 0.42, depth * 0.5, withAlpha(primary, 0.62), light);
  if (type === "recliner" || type === "lounge_chair") drawRect2D(-width * 0.32, depth * 0.22, width * 0.64, depth * 0.22, withAlpha(primary, 0.62), light);
  if (type === "ottoman") drawEllipse2D(0, 0, width * 0.36, depth * 0.3, withAlpha(primary, 0.62), light);
}

function drawChairSymbol2D(type, width, depth, primary, dark) {
  if (["bedroom_bench", "dining_bench", "garden_bench"].includes(type)) {
    drawRect2D(-width * 0.44, -depth * 0.22, width * 0.88, depth * 0.44, withAlpha(primary, 0.6), "#e2e8f0");
    drawLine2D(-width * 0.4, -depth * 0.36, width * 0.4, -depth * 0.36, dark, 1.2);
    return;
  }
  if (type === "bar_stool") {
    drawEllipse2D(0, 0, width * 0.32, depth * 0.32, withAlpha(primary, 0.58), "#e2e8f0");
    drawCross2D(0, 0, width * 0.34, depth * 0.34, dark);
    return;
  }
  drawRect2D(-width * 0.32, -depth * 0.15, width * 0.64, depth * 0.52, withAlpha(primary, 0.58), "#e2e8f0");
  drawRect2D(-width * 0.34, -depth * 0.44, width * 0.68, depth * 0.16, withAlpha(dark, 0.58), dark);
  if (type === "high_chair") drawRect2D(-width * 0.4, depth * 0.28, width * 0.8, depth * 0.14, withAlpha("#e2e8f0", 0.7), "#e2e8f0");
  if (type === "office_chair") drawCross2D(0, depth * 0.08, width * 0.44, depth * 0.44, dark);
}

function drawTableSymbol2D(type, width, depth, primary, wood, dark) {
  if (type === "round_table") {
    drawEllipse2D(0, 0, width * 0.42, depth * 0.42, withAlpha(primary, 0.5), "#e2e8f0");
    drawEllipse2D(0, 0, width * 0.12, depth * 0.12, withAlpha(dark, 0.5), dark);
    return;
  }
  drawRect2D(-width * 0.42, -depth * 0.34, width * 0.84, depth * 0.68, withAlpha(type === "meeting_table" ? primary : wood, 0.54), "#e2e8f0");
  if (type === "dining_table_6") {
    [-0.28, 0, 0.28].forEach((x) => {
      drawRect2D(x * width - width * 0.06, -depth * 0.58, width * 0.12, depth * 0.16, withAlpha(dark, 0.55), dark);
      drawRect2D(x * width - width * 0.06, depth * 0.42, width * 0.12, depth * 0.16, withAlpha(dark, 0.55), dark);
    });
  }
  if (type === "coffee_table") drawRect2D(-width * 0.32, -depth * 0.18, width * 0.64, depth * 0.36, withAlpha("#f8fafc", 0.2), "#f8fafc");
}

function drawOfficeSymbol2D(type, width, depth, primary, dark, metal, glass) {
  if (type === "desk" || type === "vanity_table") {
    drawRect2D(-width * 0.44, -depth * 0.34, width * 0.88, depth * 0.68, withAlpha(primary, 0.5), "#e2e8f0");
    drawRect2D(width * 0.2, -depth * 0.26, width * 0.2, depth * 0.52, withAlpha(dark, 0.55), dark);
    drawRect2D(-width * 0.28, -depth * 0.24, width * 0.24, depth * 0.14, withAlpha(type === "vanity_table" ? glass : dark, 0.62), type === "vanity_table" ? glass : dark);
    return;
  }
  if (type === "printer") {
    drawRect2D(-width * 0.42, -depth * 0.32, width * 0.84, depth * 0.64, withAlpha("#e2e8f0", 0.68), dark);
    drawRect2D(-width * 0.32, depth * 0.1, width * 0.64, depth * 0.16, withAlpha(dark, 0.58), dark);
    return;
  }
  if (type === "server_rack") {
    drawRect2D(-width * 0.42, -depth * 0.42, width * 0.84, depth * 0.84, withAlpha(dark, 0.72), metal);
    [-0.22, 0, 0.22].forEach((y) => drawLine2D(-width * 0.32, y * depth, width * 0.32, y * depth, glass, 1));
    return;
  }
  drawRect2D(-width * 0.38, -depth * 0.38, width * 0.76, depth * 0.76, withAlpha(primary, 0.55), metal);
  [-0.2, 0.05, 0.3].forEach((y) => drawLine2D(-width * 0.28, y * depth, width * 0.28, y * depth, dark, 1));
}

function drawKitchenSymbol2D(type, width, depth, primary, dark, metal, glass, light) {
  if (["kitchen_counter", "kitchen_island", "upper_cabinet", "pantry"].includes(type)) {
    drawRect2D(-width * 0.46, -depth * 0.38, width * 0.92, depth * 0.76, withAlpha(primary, 0.52), light);
    [-0.2, 0.2].forEach((x) => drawLine2D(x * width, -depth * 0.34, x * width, depth * 0.34, dark, 0.8));
    if (type === "kitchen_island") drawEllipse2D(0, 0, width * 0.18, depth * 0.22, withAlpha(metal, 0.65), metal);
    return;
  }
  if (type === "refrigerator" || type === "dishwasher" || type === "oven") {
    drawRect2D(-width * 0.42, -depth * 0.42, width * 0.84, depth * 0.84, withAlpha(type === "refrigerator" ? light : dark, 0.68), metal);
    drawLine2D(-width * 0.36, 0, width * 0.36, 0, metal, 1);
    drawLine2D(width * 0.3, -depth * 0.28, width * 0.3, depth * 0.28, metal, 1);
    return;
  }
  if (type === "stove") {
    drawRect2D(-width * 0.42, -depth * 0.42, width * 0.84, depth * 0.84, withAlpha(dark, 0.68), metal);
    [-0.2, 0.2].forEach((x) => [-0.2, 0.2].forEach((y) => drawEllipse2D(x * width, y * depth, width * 0.09, depth * 0.09, withAlpha("#020617", 0.8), metal)));
    return;
  }
  if (type === "sink") {
    drawRect2D(-width * 0.44, -depth * 0.36, width * 0.88, depth * 0.72, withAlpha(primary, 0.48), light);
    drawEllipse2D(0, 0, width * 0.28, depth * 0.22, withAlpha(metal, 0.7), metal);
    drawLine2D(0, -depth * 0.16, width * 0.18, -depth * 0.3, metal, 1);
    return;
  }
  if (type === "microwave" || type === "coffee_machine") {
    drawRect2D(-width * 0.42, -depth * 0.34, width * 0.84, depth * 0.68, withAlpha(dark, 0.7), metal);
    drawRect2D(-width * 0.28, -depth * 0.22, width * 0.44, depth * 0.44, withAlpha(glass, 0.45), glass);
    drawRect2D(width * 0.22, -depth * 0.2, width * 0.14, depth * 0.4, withAlpha(metal, 0.65), metal);
    return;
  }
  if (type === "range_hood") {
    drawPolygon2D([[0, -depth * 0.44], [width * 0.44, depth * 0.22], [-width * 0.44, depth * 0.22]], withAlpha(metal, 0.62), metal);
  }
}

function drawBathLaundrySymbol2D(type, width, depth, primary, dark, metal, glass, light) {
  if (type === "toilet" || type === "bidet") {
    drawRect2D(-width * 0.32, -depth * 0.42, width * 0.64, depth * 0.24, withAlpha(light, 0.78), light);
    drawEllipse2D(0, depth * 0.12, width * 0.28, depth * 0.28, withAlpha(light, 0.72), metal);
    return;
  }
  if (type === "shower") {
    drawRect2D(-width * 0.44, -depth * 0.44, width * 0.88, depth * 0.88, withAlpha(glass, 0.28), glass);
    drawLine2D(-width * 0.4, -depth * 0.4, width * 0.4, depth * 0.4, glass, 1);
    drawEllipse2D(width * 0.24, -depth * 0.26, width * 0.09, depth * 0.09, withAlpha(metal, 0.7), metal);
    return;
  }
  if (type === "bathtub") {
    drawRoundedRect2D(-width * 0.44, -depth * 0.36, width * 0.88, depth * 0.72, depth * 0.18);
    ctx.fillStyle = withAlpha(light, 0.78);
    ctx.strokeStyle = metal;
    ctx.fill();
    ctx.stroke();
    drawEllipse2D(0, 0, width * 0.3, depth * 0.2, withAlpha("#bae6fd", 0.42), glass);
    return;
  }
  if (type === "vanity" || type === "bathroom_mirror") {
    drawRect2D(-width * 0.42, -depth * 0.34, width * 0.84, depth * 0.68, withAlpha(primary, 0.48), light);
    drawEllipse2D(0, 0, width * 0.24, depth * 0.18, withAlpha(glass, 0.45), glass);
    return;
  }
  if (type === "washer" || type === "dryer") {
    drawRect2D(-width * 0.42, -depth * 0.42, width * 0.84, depth * 0.84, withAlpha(light, 0.7), metal);
    drawEllipse2D(0, 0.06 * depth, width * 0.22, depth * 0.22, withAlpha(glass, 0.5), glass);
    drawRect2D(-width * 0.32, -depth * 0.34, width * 0.64, depth * 0.1, withAlpha(dark, 0.55), dark);
    return;
  }
  if (type === "ironing_board") {
    drawPolygon2D([[-width * 0.48, 0], [width * 0.38, -depth * 0.3], [width * 0.48, depth * 0.25], [-width * 0.38, depth * 0.34]], withAlpha(primary, 0.5), light);
    drawCross2D(0, 0, width * 0.48, depth * 0.42, metal);
    return;
  }
  if (type === "towel_rack") drawLine2D(-width * 0.42, 0, width * 0.42, 0, metal, 2);
  else drawRect2D(-width * 0.36, -depth * 0.32, width * 0.72, depth * 0.64, withAlpha(primary, 0.5), light);
}

function drawStorageSymbol2D(type, width, depth, primary, dark, metal, wood, glass) {
  if (type === "tv") {
    drawRect2D(-width * 0.46, -depth * 0.28, width * 0.92, depth * 0.56, withAlpha(dark, 0.84), glass);
    drawRect2D(-width * 0.16, depth * 0.3, width * 0.32, depth * 0.1, withAlpha(metal, 0.6), metal);
    return;
  }
  if (type === "bookcase" || type === "storage_shelf" || type === "shoe_rack") {
    drawRect2D(-width * 0.44, -depth * 0.42, width * 0.88, depth * 0.84, withAlpha(wood, 0.45), wood);
    [-0.22, 0, 0.22].forEach((y) => drawLine2D(-width * 0.4, y * depth, width * 0.4, y * depth, "#e2e8f0", 0.9));
    return;
  }
  if (type === "coat_rack") {
    drawEllipse2D(0, 0, width * 0.3, depth * 0.3, withAlpha(wood, 0.45), wood);
    drawCross2D(0, 0, width * 0.42, depth * 0.42, metal);
    return;
  }
  if (type === "workbench" || type === "tool_chest") {
    drawRect2D(-width * 0.44, -depth * 0.36, width * 0.88, depth * 0.72, withAlpha(type === "tool_chest" ? primary : wood, 0.56), metal);
    [-0.18, 0.08, 0.32].forEach((y) => drawLine2D(-width * 0.34, y * depth, width * 0.34, y * depth, dark, 0.9));
    return;
  }
  drawRect2D(-width * 0.42, -depth * 0.4, width * 0.84, depth * 0.8, withAlpha(primary, 0.5), "#e2e8f0");
  drawLine2D(0, -depth * 0.34, 0, depth * 0.34, dark, 0.9);
  drawLine2D(-width * 0.32, 0, width * 0.32, 0, dark, 0.9);
}

function drawOutdoorDecorSymbol2D(type, width, depth, primary, dark, metal, wood, green) {
  if (type === "plant" || type === "planter_box") {
    drawRect2D(-width * 0.38, -depth * 0.24, width * 0.76, depth * 0.48, withAlpha(wood, 0.45), wood);
    [-0.22, 0, 0.22].forEach((x) => drawEllipse2D(x * width, 0, width * 0.14, depth * 0.22, withAlpha(green, 0.68), green));
    return;
  }
  if (type === "patio_umbrella") {
    drawEllipse2D(0, 0, width * 0.44, depth * 0.44, withAlpha(primary, 0.42), primary);
    drawCross2D(0, 0, width * 0.42, depth * 0.42, metal);
    return;
  }
  if (type === "pergola") {
    [-0.42, 0.42].forEach((x) => [-0.38, 0.38].forEach((y) => drawEllipse2D(x * width, y * depth, width * 0.035, depth * 0.035, withAlpha(wood, 0.8), wood)));
    [-0.25, 0, 0.25].forEach((x) => drawLine2D(x * width, -depth * 0.42, x * width, depth * 0.42, wood, 1.2));
    return;
  }
  if (type === "grill" || type === "fireplace") {
    drawRect2D(-width * 0.42, -depth * 0.32, width * 0.84, depth * 0.64, withAlpha(dark, 0.72), metal);
    drawEllipse2D(0, 0, width * 0.16, depth * 0.16, withAlpha("#f97316", 0.75), "#facc15");
    return;
  }
  if (type === "rug") drawRect2D(-width * 0.46, -depth * 0.42, width * 0.92, depth * 0.84, withAlpha(primary, 0.28), primary);
  else drawEllipse2D(0, 0, width * 0.28, depth * 0.28, withAlpha(primary, 0.5), "#e2e8f0");
}

function drawVehicleSymbol2D(type, width, depth, primary, dark, glass, metal) {
  if (type === "car") {
    drawRoundedRect2D(-width * 0.44, -depth * 0.36, width * 0.88, depth * 0.72, depth * 0.16);
    ctx.fillStyle = withAlpha(primary, 0.58);
    ctx.strokeStyle = "#e2e8f0";
    ctx.fill();
    ctx.stroke();
    drawRect2D(-width * 0.12, -depth * 0.28, width * 0.32, depth * 0.56, withAlpha(glass, 0.42), glass);
    [-0.3, 0.3].forEach((x) => [-0.44, 0.44].forEach((y) => drawEllipse2D(x * width, y * depth, width * 0.08, depth * 0.08, withAlpha(dark, 0.8), dark)));
    return;
  }
  if (type === "motorcycle" || type === "bicycle" || type === "scooter") {
    drawEllipse2D(-width * 0.34, 0, width * 0.13, depth * 0.2, withAlpha(dark, 0.78), dark);
    drawEllipse2D(width * 0.34, 0, width * 0.13, depth * 0.2, withAlpha(dark, 0.78), dark);
    drawLine2D(-width * 0.28, 0, width * 0.26, -depth * 0.08, primary, 1.5);
    drawLine2D(width * 0.24, -depth * 0.08, width * 0.38, -depth * 0.3, metal, 1);
  }
}

function drawFitnessSymbol2D(type, width, depth, primary, dark, metal) {
  if (type === "treadmill") {
    drawRect2D(-width * 0.44, -depth * 0.3, width * 0.78, depth * 0.6, withAlpha(dark, 0.72), metal);
    drawRect2D(-width * 0.32, -depth * 0.2, width * 0.48, depth * 0.4, withAlpha("#020617", 0.78), dark);
    drawLine2D(width * 0.28, -depth * 0.34, width * 0.44, -depth * 0.12, metal, 1.2);
    drawLine2D(width * 0.28, depth * 0.34, width * 0.44, depth * 0.12, metal, 1.2);
    return;
  }
  drawEllipse2D(-width * 0.25, 0, width * 0.18, depth * 0.28, withAlpha(dark, 0.75), dark);
  drawLine2D(-width * 0.18, 0, width * 0.3, -depth * 0.12, primary, 1.3);
  drawRect2D(width * 0.14, -depth * 0.28, width * 0.18, depth * 0.1, withAlpha(dark, 0.72), dark);
}

function drawRect2D(x, y, width, height, fill, stroke) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1 / view.scale;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}

function drawEllipse2D(x, y, radiusX, radiusY, fill, stroke) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1 / view.scale;
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.01, Math.abs(radiusX)), Math.max(0.01, Math.abs(radiusY)), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawLine2D(x1, y1, x2, y2, stroke, multiplier = 1) {
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = (1.1 * multiplier) / view.scale;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawCross2D(x, y, width, depth, stroke) {
  drawLine2D(x - width / 2, y, x + width / 2, y, stroke, 1);
  drawLine2D(x, y - depth / 2, x, y + depth / 2, stroke, 1);
}

function drawPolygon2D(points, fill, stroke) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1 / view.scale;
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawRoundedRect2D(x, y, width, height, radius) {
  const r = Math.max(0, Math.min(Math.abs(radius), Math.abs(width) / 2, Math.abs(height) / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawDimensions() {
  project.dimensions.forEach((dimension) => {
    drawDimensionLine(dimension.x1, dimension.y1, dimension.x2, dimension.y2, "#f97316");
  });
}

function drawLabels() {
  project.labels.forEach((label) => {
    ctx.save();
    ctx.fillStyle = label.color || "#f8fafc";
    ctx.font = `${(label.fontSize || 16) / view.scale}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(label.text || "Label", label.x, label.y);
    ctx.restore();
  });
}

function drawDrawingPreview() {
  if (!drawingState) return;
  const { tool, start, current } = drawingState;
  ctx.save();
  ctx.strokeStyle = "#60a5fa";
  ctx.fillStyle = withAlpha("#3b82f6", 0.12);
  ctx.lineWidth = 2 / view.scale;
  ctx.setLineDash([8 / view.scale, 7 / view.scale]);

  if (tool === "wall" || tool === "dimension") {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
    if (tool === "wall") {
      drawSmallTag(`${Math.hypot(current.x - start.x, current.y - start.y).toFixed(2)} m`, (start.x + current.x) / 2, (start.y + current.y) / 2 - 10 / view.scale, "#bfdbfe");
    }
  } else {
    const rect = normalizeRect(start.x, start.y, current.x, current.y);
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }
  ctx.restore();
}

function drawSelectionHighlight() {
  const object = getSelectedObject();
  if (!object || !selectedRef) return;

  ctx.save();
  ctx.strokeStyle = "#fde047";
  ctx.fillStyle = withAlpha("#fde047", 0.12);
  ctx.lineWidth = 2.5 / view.scale;
  ctx.setLineDash([6 / view.scale, 5 / view.scale]);

  if (selectedRef.type === "wall") {
    ctx.beginPath();
    ctx.moveTo(object.x1, object.y1);
    ctx.lineTo(object.x2, object.y2);
    ctx.stroke();
  } else if (selectedRef.type === "door") {
    const wall = getObjectById("wall", object.wallId);
    if (wall) {
      const point = getWallPointAtRatio(wall, object.ratio);
      const box = Number(object.width) || project.settings.defaultDoorWidth;
      ctx.strokeRect(point.x - box / 2, point.y - box / 2, box, box);
    }
  } else if (selectedRef.type === "window") {
    const wall = getObjectById("wall", object.wallId);
    if (wall) {
      const point = getWallPointAtRatio(wall, object.ratio);
      const box = Number(object.width) || project.settings.defaultWindowWidth;
      ctx.strokeRect(point.x - box / 2, point.y - box / 2, box, box);
    }
  } else if (selectedRef.type === "dimension") {
    ctx.beginPath();
    ctx.moveTo(object.x1, object.y1);
    ctx.lineTo(object.x2, object.y2);
    ctx.stroke();
  } else if (selectedRef.type === "label") {
    const metrics = measureLabel(object);
    ctx.strokeRect(metrics.x, metrics.y, metrics.width, metrics.height);
  } else if (selectedRef.type === "furniture") {
    drawFurnitureSelectionHighlight(object);
  } else if ("x" in object && "y" in object && "width" in object && "height" in object) {
    ctx.strokeRect(object.x, object.y, object.width, object.height);
  }

  ctx.restore();
}

function drawFurnitureSelectionHighlight(item) {
  const width = Math.abs(item.width);
  const depth = Math.abs(item.height);
  ctx.save();
  ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
  ctx.rotate(degToRad(item.rotation || 0));
  ctx.strokeRect(-width / 2, -depth / 2, width, depth);
  ctx.setLineDash([]);
  ctx.fillStyle = "#fde047";
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 1.4 / view.scale;
  const arrowLength = Math.max(0.25, Math.min(width, depth) * 0.42);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(arrowLength, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(arrowLength, 0);
  ctx.lineTo(arrowLength - 6 / view.scale, -4 / view.scale);
  ctx.lineTo(arrowLength - 6 / view.scale, 4 / view.scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDimensionLine(x1, y1, x2, y2, color) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const length = Math.hypot(x2 - x1, y2 - y1).toFixed(2);
  const arrow = 9 / view.scale;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6 / view.scale;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  drawArrowHead(x1, y1, angle + Math.PI, arrow);
  drawArrowHead(x2, y2, angle, arrow);
  drawSmallTag(`${length} m`, (x1 + x2) / 2 + 5 / view.scale, (y1 + y2) / 2 - 5 / view.scale, "#fed7aa");
  ctx.restore();
}

function drawArrowHead(x, y, angle, size) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - Math.cos(angle - Math.PI / 6) * size, y - Math.sin(angle - Math.PI / 6) * size);
  ctx.lineTo(x - Math.cos(angle + Math.PI / 6) * size, y - Math.sin(angle + Math.PI / 6) * size);
  ctx.closePath();
  ctx.fill();
}

function drawSmallTag(text, x, y, color) {
  ctx.save();
  ctx.font = `${10 / view.scale}px sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const metrics = ctx.measureText(text);
  const padX = 4 / view.scale;
  const padY = 3 / view.scale;
  const height = 16 / view.scale;
  ctx.fillStyle = "rgba(2, 6, 23, 0.72)";
  ctx.fillRect(x - padX, y - height / 2, metrics.width + padX * 2, height + padY * 0.2);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function addWall(x1, y1, x2, y2) {
  const wall = {
    id: createId("wall"),
    type: "wall",
    x1: roundNumber(x1),
    y1: roundNumber(y1),
    x2: roundNumber(x2),
    y2: roundNumber(y2),
    thickness: Number(project.settings.wallThickness),
    height: Number(project.settings.wallHeight),
    color: "#e5e7eb"
  };
  project.walls.push(wall);
  setStatusMessage("Wall added");
  return wall;
}

function addRoom(x, y, width, height) {
  const roomWalls = [
    addWall(x, y, x + width, y),
    addWall(x + width, y, x + width, y + height),
    addWall(x + width, y + height, x, y + height),
    addWall(x, y + height, x, y)
  ];
  const room = {
    id: createId("room"),
    type: "room",
    name: `Room ${project.rooms.length + 1}`,
    x: roundNumber(x),
    y: roundNumber(y),
    width: roundNumber(width),
    height: roundNumber(height),
    wallIds: roomWalls.map((wall) => wall.id),
    fillColor: "#3b82f6"
  };
  project.rooms.push(room);
  setStatusMessage("Room added with four walls");
  return room;
}

function addDoor(x, y) {
  const nearest = getNearestWall(x, y, 0.8);
  if (!nearest) {
    setStatusMessage("Door needs a nearby wall");
    window.alert("Door placement failed: click near an existing wall.");
    return null;
  }
  const door = {
    id: createId("door"),
    type: "door",
    wallId: nearest.wall.id,
    ratio: roundNumber(nearest.ratio, 4),
    width: Number(project.settings.defaultDoorWidth),
    height: 2.1,
    swingDirection: "left"
  };
  project.doors.push(door);
  setStatusMessage("Door attached to nearest wall");
  generate3DFromProject();
  render2D();
  return door;
}

function addWindow(x, y) {
  const nearest = getNearestWall(x, y, 0.8);
  if (!nearest) {
    setStatusMessage("Window needs a nearby wall");
    window.alert("Window placement failed: click near an existing wall.");
    return null;
  }
  const windowObject = {
    id: createId("window"),
    type: "window",
    wallId: nearest.wall.id,
    ratio: roundNumber(nearest.ratio, 4),
    width: Number(project.settings.defaultWindowWidth),
    height: Number(project.settings.defaultWindowHeight),
    sillHeight: Number(project.settings.defaultWindowSillHeight)
  };
  project.windows.push(windowObject);
  setStatusMessage("Window attached to nearest wall");
  generate3DFromProject();
  render2D();
  return windowObject;
}

function addFloor(x, y, width, height) {
  const floor = {
    id: createId("floor"),
    type: "floor",
    x: roundNumber(x),
    y: roundNumber(y),
    width: roundNumber(width),
    height: roundNumber(height),
    color: "#475569"
  };
  project.floors.push(floor);
  setStatusMessage("Floor added");
  return floor;
}

function addRoof(x, y, width, height) {
  const roof = {
    id: createId("roof"),
    type: "roof",
    roofType: dom.defaultRoofType.value || "flat",
    x: roundNumber(x),
    y: roundNumber(y),
    width: roundNumber(width),
    height: roundNumber(height),
    roofHeight: 0.75,
    overhang: 0.35,
    color: "#9a3412"
  };
  project.roofs.push(roof);
  setStatusMessage("Roof added");
  return roof;
}

function addFurniture(x, y, width, height, furnitureType) {
  const type = furnitureType || dom.furnitureType.value || "bed";
  const preset = getFurniturePreset(type);
  const item = {
    id: createId("furniture"),
    type: "furniture",
    furnitureType: type,
    x: roundNumber(x),
    y: roundNumber(y),
    width: roundNumber(width),
    height: roundNumber(height),
    rotation: 0,
    color: preset.color
  };
  project.furniture.push(item);
  setStatusMessage("Furniture added");
  return item;
}

function addFurnitureFromDrag(start, current) {
  const rect = normalizeRect(start.x, start.y, current.x, current.y);
  const type = dom.furnitureType.value || "bed";
  const preset = getFurniturePreset(type);
  if (rect.width < 0.05 || rect.height < 0.05) {
    const width = preset.width;
    const height = preset.depth;
    return addFurniture(start.x - width / 2, start.y - height / 2, width, height, type);
  }
  return addFurniture(rect.x, rect.y, rect.width, rect.height, type);
}

function addDimension(x1, y1, x2, y2) {
  const dimension = {
    id: createId("dimension"),
    type: "dimension",
    x1: roundNumber(x1),
    y1: roundNumber(y1),
    x2: roundNumber(x2),
    y2: roundNumber(y2)
  };
  project.dimensions.push(dimension);
  setStatusMessage("Dimension added");
  return dimension;
}

function addLabel(x, y, text) {
  const label = {
    id: createId("label"),
    type: "label",
    x: roundNumber(x),
    y: roundNumber(y),
    text,
    fontSize: 16,
    color: "#f8fafc"
  };
  project.labels.push(label);
  setStatusMessage("Label added");
  return label;
}

function selectObject(objectRef) {
  selectedRef = objectRef ? { type: objectRef.type, id: objectRef.id } : null;
  updatePropertiesPanel();
  render2D();
  generate3DFromProject();
  updateStatus();
}

function deleteSelected() {
  if (!selectedRef) {
    setStatusMessage("No selected object to delete");
    return;
  }

  const { type, id } = selectedRef;
  if (type === "wall") {
    project.doors = project.doors.filter((door) => door.wallId !== id);
    project.windows = project.windows.filter((windowObject) => windowObject.wallId !== id);
    project.rooms.forEach((room) => {
      room.wallIds = (room.wallIds || []).filter((wallId) => wallId !== id);
    });
  }

  if (type === "room") {
    const room = getObjectById("room", id);
    if (room && Array.isArray(room.wallIds)) {
      const wallIdSet = new Set(room.wallIds);
      project.walls = project.walls.filter((wall) => !wallIdSet.has(wall.id));
      project.doors = project.doors.filter((door) => !wallIdSet.has(door.wallId));
      project.windows = project.windows.filter((windowObject) => !wallIdSet.has(windowObject.wallId));
    }
  }

  const collection = COLLECTIONS[type];
  if (!collection) return;
  project[collection] = project[collection].filter((object) => object.id !== id);
  selectedRef = null;
  pushHistory();
  updatePropertiesPanel();
  render2D();
  generate3DFromProject();
  updateStatus();
  setStatusMessage("Selected object deleted");
}

function updatePropertiesPanel() {
  const object = getSelectedObject();
  if (!object || !selectedRef) {
    dom.propertiesPanel.innerHTML = buildProjectSettingsPanel();
    return;
  }

  const type = selectedRef.type;
  if (type === "wall") dom.propertiesPanel.innerHTML = buildWallPanel(object);
  if (type === "room") dom.propertiesPanel.innerHTML = buildRoomPanel(object);
  if (type === "door") dom.propertiesPanel.innerHTML = buildDoorPanel(object);
  if (type === "window") dom.propertiesPanel.innerHTML = buildWindowPanel(object);
  if (type === "floor") dom.propertiesPanel.innerHTML = buildFloorPanel(object);
  if (type === "roof") dom.propertiesPanel.innerHTML = buildRoofPanel(object);
  if (type === "furniture") dom.propertiesPanel.innerHTML = buildFurniturePanel(object);
  if (type === "dimension") dom.propertiesPanel.innerHTML = buildDimensionPanel(object);
  if (type === "label") dom.propertiesPanel.innerHTML = buildLabelPanel(object);
}

function buildProjectSettingsPanel() {
  return `
    <div class="property-group">
      <h3>No Object Selected</h3>
      <p class="empty-state">Choose a tool from the left sidebar, draw on the blueprint canvas, or select an existing object to edit its live properties.</p>
    </div>
    <div class="property-group">
      <h3>Project Settings</h3>
      <div class="property-grid">
        ${settingNumber("metersPerGrid", "Grid spacing (m)", project.settings.metersPerGrid, 0.05)}
        ${settingNumber("gridSize", "Base grid screen size", project.settings.gridSize, 1)}
        ${settingCheckbox("snapEnabled", "Snap enabled", project.settings.snapEnabled)}
        ${settingNumber("wallHeight", "Default wall height (m)", project.settings.wallHeight, 0.1)}
        ${settingNumber("wallThickness", "Default wall thickness (m)", project.settings.wallThickness, 0.01)}
        ${settingNumber("defaultDoorWidth", "Default door width (m)", project.settings.defaultDoorWidth, 0.05)}
        ${settingNumber("defaultWindowWidth", "Default window width (m)", project.settings.defaultWindowWidth, 0.05)}
        ${settingNumber("defaultWindowHeight", "Default window height (m)", project.settings.defaultWindowHeight, 0.05)}
        ${settingNumber("defaultWindowSillHeight", "Default sill height (m)", project.settings.defaultWindowSillHeight, 0.05)}
      </div>
    </div>
    <div class="property-group">
      <h3>Object Count</h3>
      <div class="counter-grid">
        ${counter("Walls", project.walls.length)}
        ${counter("Rooms", project.rooms.length)}
        ${counter("Doors", project.doors.length)}
        ${counter("Windows", project.windows.length)}
        ${counter("Floors", project.floors.length)}
        ${counter("Roofs", project.roofs.length)}
        ${counter("Furniture", project.furniture.length)}
        ${counter("Dims", project.dimensions.length)}
        ${counter("Labels", project.labels.length)}
      </div>
    </div>
  `;
}

function buildWallPanel(wall) {
  return group("Wall", `
    <div class="property-grid">
      ${readonlyField("ID", wall.id)}
      ${readonlyField("Length", `${getWallLength(wall).toFixed(2)} m`)}
      ${numberField("x1", "Start X (m)", wall.x1, 0.05)}
      ${numberField("y1", "Start Y (m)", wall.y1, 0.05)}
      ${numberField("x2", "End X (m)", wall.x2, 0.05)}
      ${numberField("y2", "End Y (m)", wall.y2, 0.05)}
      ${numberField("thickness", "Thickness (m)", wall.thickness, 0.01)}
      ${numberField("height", "Height (m)", wall.height, 0.1)}
      ${colorField("color", "Color", wall.color)}
    </div>
  `);
}

function buildRoomPanel(room) {
  return group("Room", `
    <div class="property-grid">
      ${readonlyField("ID", room.id)}
      ${readonlyField("Area", `${getRectAreaMeters(room.width, room.height).toFixed(2)} m2`)}
      ${textField("name", "Name", room.name)}
      ${numberField("x", "X (m)", room.x, 0.05)}
      ${numberField("y", "Y (m)", room.y, 0.05)}
      ${numberField("width", "Width (m)", room.width, 0.05)}
      ${numberField("height", "Height (m)", room.height, 0.05)}
      ${colorField("fillColor", "Fill color", room.fillColor)}
    </div>
  `);
}

function buildDoorPanel(door) {
  return group("Door", `
    <div class="property-grid">
      ${readonlyField("ID", door.id)}
      ${readonlyField("Wall ID", door.wallId)}
      ${numberField("ratio", "Ratio", door.ratio, 0.01, 0, 1)}
      ${numberField("width", "Width (m)", door.width, 0.05)}
      ${numberField("height", "Height (m)", door.height, 0.05)}
      ${selectField("swingDirection", "Swing direction", door.swingDirection, [["left", "Left"], ["right", "Right"]])}
    </div>
  `);
}

function buildWindowPanel(windowObject) {
  return group("Window", `
    <div class="property-grid">
      ${readonlyField("ID", windowObject.id)}
      ${readonlyField("Wall ID", windowObject.wallId)}
      ${numberField("ratio", "Ratio", windowObject.ratio, 0.01, 0, 1)}
      ${numberField("width", "Width (m)", windowObject.width, 0.05)}
      ${numberField("height", "Height (m)", windowObject.height, 0.05)}
      ${numberField("sillHeight", "Sill height (m)", windowObject.sillHeight, 0.05)}
    </div>
  `);
}

function buildFloorPanel(floor) {
  return group("Floor", `
    <div class="property-grid">
      ${readonlyField("ID", floor.id)}
      ${numberField("x", "X (m)", floor.x, 0.05)}
      ${numberField("y", "Y (m)", floor.y, 0.05)}
      ${numberField("width", "Width (m)", floor.width, 0.05)}
      ${numberField("height", "Height (m)", floor.height, 0.05)}
      ${colorField("color", "Color", floor.color)}
    </div>
  `);
}

function buildRoofPanel(roof) {
  return group("Roof", `
    <div class="property-grid">
      ${readonlyField("ID", roof.id)}
      ${selectField("roofType", "Roof type", roof.roofType, [["flat", "Flat roof"], ["gable", "Gable roof"]])}
      ${numberField("x", "X (m)", roof.x, 0.05)}
      ${numberField("y", "Y (m)", roof.y, 0.05)}
      ${numberField("width", "Width (m)", roof.width, 0.05)}
      ${numberField("height", "Height (m)", roof.height, 0.05)}
      ${numberField("roofHeight", "Roof height (m)", roof.roofHeight, 0.05)}
      ${numberField("overhang", "Overhang (m)", roof.overhang, 0.05)}
      ${colorField("color", "Color", roof.color)}
    </div>
  `);
}

function buildFurniturePanel(item) {
  return group("Furniture", `
    <div class="property-grid">
      ${readonlyField("ID", item.id)}
      ${selectField("furnitureType", "Furniture type", item.furnitureType, getFurnitureSelectOptions())}
      ${numberField("x", "X (m)", item.x, 0.05)}
      ${numberField("y", "Y (m)", item.y, 0.05)}
      ${numberField("width", "Width (m)", item.width, 0.05)}
      ${numberField("height", "Depth (m)", item.height, 0.05)}
      ${orientationField(item.rotation)}
      ${numberField("rotation", "Angle (deg)", normalizeRotation(item.rotation), 1)}
      ${orientationButtons()}
      ${colorField("color", "Color", item.color)}
    </div>
  `);
}

function buildDimensionPanel(dimension) {
  return group("Dimension", `
    <div class="property-grid">
      ${readonlyField("ID", dimension.id)}
      ${readonlyField("Length", `${Math.hypot(dimension.x2 - dimension.x1, dimension.y2 - dimension.y1).toFixed(2)} m`)}
      ${numberField("x1", "Start X (m)", dimension.x1, 0.05)}
      ${numberField("y1", "Start Y (m)", dimension.y1, 0.05)}
      ${numberField("x2", "End X (m)", dimension.x2, 0.05)}
      ${numberField("y2", "End Y (m)", dimension.y2, 0.05)}
    </div>
  `);
}

function buildLabelPanel(label) {
  return group("Label", `
    <div class="property-grid">
      ${readonlyField("ID", label.id)}
      ${textareaField("text", "Text", label.text)}
      ${numberField("x", "X (m)", label.x, 0.05)}
      ${numberField("y", "Y (m)", label.y, 0.05)}
      ${numberField("fontSize", "Font size", label.fontSize, 1)}
      ${colorField("color", "Color", label.color)}
    </div>
  `);
}

function group(title, content) {
  return `<div class="property-group"><h3>${escapeHtml(title)}</h3>${content}</div>`;
}

function counter(label, value) {
  return `<div class="counter"><strong>${Number(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function readonlyField(label, value) {
  return `<div class="property-row"><label>${escapeHtml(label)}</label><input type="text" value="${escapeAttr(value)}" readonly></div>`;
}

function numberField(prop, label, value, step, min, max) {
  const minAttr = min === undefined ? "" : ` min="${min}"`;
  const maxAttr = max === undefined ? "" : ` max="${max}"`;
  return `<div class="property-row"><label>${escapeHtml(label)}</label><input type="number" data-prop="${prop}" value="${escapeAttr(value)}" step="${step}"${minAttr}${maxAttr}></div>`;
}

function textField(prop, label, value) {
  return `<div class="property-row wide"><label>${escapeHtml(label)}</label><input type="text" data-prop="${prop}" value="${escapeAttr(value)}"></div>`;
}

function textareaField(prop, label, value) {
  return `<div class="property-row wide"><label>${escapeHtml(label)}</label><textarea data-prop="${prop}">${escapeHtml(value || "")}</textarea></div>`;
}

function colorField(prop, label, value) {
  return `<div class="property-row"><label>${escapeHtml(label)}</label><input type="color" data-prop="${prop}" value="${escapeAttr(value || "#ffffff")}"></div>`;
}

function selectField(prop, label, value, options) {
  const html = options.map(([optionValue, optionLabel]) => {
    const selected = optionValue === value ? " selected" : "";
    return `<option value="${escapeAttr(optionValue)}"${selected}>${escapeHtml(optionLabel)}</option>`;
  }).join("");
  return `<div class="property-row"><label>${escapeHtml(label)}</label><select data-prop="${prop}">${html}</select></div>`;
}

function orientationField(value) {
  const options = [
    [0, "East / right (0 deg)"],
    [90, "North / up (90 deg)"],
    [180, "West / left (180 deg)"],
    [270, "South / down (270 deg)"]
  ];
  const current = snapOrientation(value);
  const html = options.map(([optionValue, optionLabel]) => {
    const selected = optionValue === current ? " selected" : "";
    return `<option value="${optionValue}"${selected}>${escapeHtml(optionLabel)}</option>`;
  }).join("");
  return `<div class="property-row"><label>Orientation</label><select data-prop="rotation" data-value-type="number">${html}</select></div>`;
}

function orientationButtons() {
  return `
    <div class="property-row wide">
      <label>Rotate selected</label>
      <div class="orientation-controls">
        <button type="button" data-orientation-action="rotate-left">Left 15</button>
        <button type="button" data-orientation-action="rotate-right">Right 15</button>
        <button type="button" data-orientation-action="flip">Flip 180</button>
        <button type="button" data-orientation-action="reset">Reset</button>
      </div>
    </div>
  `;
}

function settingNumber(prop, label, value, step) {
  return `<div class="property-row"><label>${escapeHtml(label)}</label><input type="number" data-setting="${prop}" value="${escapeAttr(value)}" step="${step}"></div>`;
}

function settingCheckbox(prop, label, value) {
  return `<div class="property-row"><label>${escapeHtml(label)}</label><input type="checkbox" data-setting="${prop}"${value ? " checked" : ""}></div>`;
}

function readInputValue(input) {
  if (input.type === "checkbox") return input.checked;
  if (input.type === "number") return Number(input.value);
  if (input.dataset.valueType === "number") return Number(input.value);
  return input.value;
}

function applyPropertyChange(prop, value, shouldPush) {
  const object = getSelectedObject();
  if (!object) return;
  const isFurnitureTypeChange = selectedRef.type === "furniture" && prop === "furnitureType";
  const oldFurniturePreset = isFurnitureTypeChange ? getFurniturePreset(object.furnitureType) : null;
  const oldFurnitureColor = isFurnitureTypeChange ? object.color : null;
  const oldFurnitureCenter = isFurnitureTypeChange
    ? { x: object.x + object.width / 2, y: object.y + object.height / 2 }
    : null;

  const numericProps = new Set(["x", "y", "x1", "y1", "x2", "y2", "width", "height", "thickness", "ratio", "sillHeight", "roofHeight", "overhang", "rotation", "fontSize"]);
  if (numericProps.has(prop)) {
    if (!Number.isFinite(value)) return;
    value = roundNumber(value, prop === "ratio" ? 4 : 2);
  }
  if (prop === "rotation") value = normalizeRotation(value);
  if (prop === "ratio") value = clamp(value, 0, 1);
  if (["width", "height", "thickness", "fontSize", "roofHeight", "overhang", "sillHeight"].includes(prop)) {
    value = Math.max(0, value);
  }

  object[prop] = value;

  if (selectedRef.type === "room" && ["x", "y", "width", "height"].includes(prop)) {
    syncRoomWalls(object);
  }

  if (isFurnitureTypeChange) {
    const preset = FURNITURE_PRESETS[value];
    const sizeWasDefault = oldFurniturePreset
      && Math.abs(Math.abs(object.width) - oldFurniturePreset.width) < 0.01
      && Math.abs(Math.abs(object.height) - oldFurniturePreset.depth) < 0.01;
    const colorWasDefault = !oldFurnitureColor
      || !oldFurniturePreset
      || oldFurnitureColor.toLowerCase() === oldFurniturePreset.color.toLowerCase();
    if (preset && colorWasDefault) object.color = preset.color;
    if (preset && sizeWasDefault) {
      object.width = preset.width;
      object.height = preset.depth;
      object.x = roundNumber(oldFurnitureCenter.x - preset.width / 2);
      object.y = roundNumber(oldFurnitureCenter.y - preset.depth / 2);
    }
  }

  project.meta.updatedAt = new Date().toISOString();
  render2D();
  generate3DFromProject();
  updateStatus();
  if (shouldPush) {
    pushHistory();
    updatePropertiesPanel();
  }
}

function applySettingChange(prop, value, shouldPush) {
  const oldBaseScale = pixelsPerMeter();
  if (typeof DEFAULT_SETTINGS[prop] === "number") {
    if (!Number.isFinite(value)) return;
    value = Math.max(prop === "gridSize" ? 4 : 0.01, value);
  }
  project.settings[prop] = value;
  if (prop === "gridSize" || prop === "metersPerGrid") {
    const newBaseScale = pixelsPerMeter();
    view.scale = oldBaseScale > 0 ? view.scale * (newBaseScale / oldBaseScale) : newBaseScale;
  }
  project.meta.updatedAt = new Date().toISOString();
  dom.snapButton.textContent = project.settings.snapEnabled ? "Snap On" : "Snap Off";
  render2D();
  generate3DFromProject();
  updateStatus();
  if (shouldPush) pushHistory();
}

function syncRoomWalls(room) {
  if (!Array.isArray(room.wallIds) || room.wallIds.length < 4) return;
  const coords = [
    [room.x, room.y, room.x + room.width, room.y],
    [room.x + room.width, room.y, room.x + room.width, room.y + room.height],
    [room.x + room.width, room.y + room.height, room.x, room.y + room.height],
    [room.x, room.y + room.height, room.x, room.y]
  ];
  room.wallIds.slice(0, 4).forEach((id, index) => {
    const wall = getObjectById("wall", id);
    if (!wall) return;
    [wall.x1, wall.y1, wall.x2, wall.y2] = coords[index].map((value) => roundNumber(value));
  });
}

function generate3DFromProject() {
  if (!root3D || !window.THREE) return;
  updateRender3DOptions();
  if (renderer) renderer.shadowMap.enabled = render3DOptions.shadows;
  clearGroup(root3D);

  const selectedId = selectedRef ? selectedRef.id : null;
  project.rooms.forEach((room) => {
    if (room.skip3D) return;
    addFloorMesh(room, room.fillColor || "#1d4ed8", 0.035, selectedId === room.id, room.id, "room");
  });
  project.floors.forEach((floor) => addFloorMesh(floor, floor.color || "#475569", 0.08, selectedId === floor.id, floor.id, "floor"));
  project.walls.forEach((wall) => {
    if (wall.openingGuide || wall.skip3D) return;
    addWallMesh(wall, selectedId === wall.id);
  });
  project.doors.forEach((door) => addDoorMesh(door, selectedId === door.id));
  project.windows.forEach((windowObject) => addWindowMesh(windowObject, selectedId === windowObject.id));
  project.furniture.forEach((item) => addFurnitureMesh(item, selectedId === item.id));
  if (render3DOptions.autoStairs) {
    project.rooms.forEach((room) => addStairMesh(room, selectedId === room.id));
  }
  project.roofs.forEach((roof) => addRoofMesh(roof, selectedId === roof.id));
  render3D();
}

function addWallMesh(wall, selected) {
  const length = Math.max(0.01, getWallLength(wall));
  const height = Math.max(0.05, Number(wall.height) || project.settings.wallHeight);
  const thickness = Math.max(0.03, Number(wall.thickness) || project.settings.wallThickness);
  const p1 = pixelPointTo3D(wall.x1, wall.y1);
  const p2 = pixelPointTo3D(wall.x2, wall.y2);
  const elevation = getElevation(wall);
  const rotationY = getWallRotation(wall);
  const material = createStandardMaterial(selected ? "#fde047" : (wall.color || "#e5e7eb"), {
    roughness: 0.76,
    metalness: 0.02
  });
  addBoxMesh({
    width: length,
    height,
    depth: thickness,
    x: (p1.x + p2.x) / 2,
    y: elevation + height / 2,
    z: (p1.z + p2.z) / 2,
    rotationY,
    material,
    userData: { sourceId: wall.id, sourceType: "wall" }
  });

  if (render3DOptions.detail === "simple") return;

  const capColor = height <= 1.3 ? "#cbd5e1" : "#f8fafc";
  addBoxMesh({
    width: length + 0.08,
    height: 0.06,
    depth: thickness + 0.08,
    x: (p1.x + p2.x) / 2,
    y: elevation + height + 0.03,
    z: (p1.z + p2.z) / 2,
    rotationY,
    material: createStandardMaterial(capColor, { roughness: 0.62 }),
    userData: { sourceId: wall.id, sourceType: "wall-cap" }
  });

  if (height > 1.3) {
    addBoxMesh({
      width: length + 0.02,
      height: 0.1,
      depth: thickness + 0.05,
      x: (p1.x + p2.x) / 2,
      y: elevation + 0.08,
      z: (p1.z + p2.z) / 2,
      rotationY,
      material: createStandardMaterial("#94a3b8", { roughness: 0.7 }),
      userData: { sourceId: wall.id, sourceType: "wall-base-trim" }
    });
  }

  if (height <= 1.3 && render3DOptions.detail === "detailed") {
    addRailingPosts(wall, elevation, height, thickness);
  }
}

function addDoorMesh(door, selected) {
  const wall = getObjectById("wall", door.wallId);
  if (!wall) return;
  const point = getWallPointAtRatio(wall, door.ratio);
  const p = pixelPointTo3D(point.x, point.y);
  const wallThickness = Math.max(0.04, Number(wall.thickness) || project.settings.wallThickness);
  const elevation = getElevation(door, wall);
  const rotationY = getWallRotation(wall);
  const width = Math.max(0.1, Number(door.width) || project.settings.defaultDoorWidth);
  const height = Math.max(0.1, Number(door.height) || 2.1);
  const basis = getWallBasis(wall);
  const markerMaterial = createStandardMaterial(selected ? "#fde047" : "#f59e0b", {
    transparent: true,
    opacity: selected ? 0.82 : 0.38,
    roughness: 0.45
  });
  addBoxMesh({
    width,
    height,
    depth: wallThickness + 0.1,
    x: p.x,
    y: elevation + height / 2,
    z: p.z,
    rotationY,
    material: markerMaterial,
    userData: { sourceId: door.id, sourceType: "door-opening" }
  });

  if (render3DOptions.detail === "simple") return;

  const frameMaterial = createStandardMaterial("#1f2937", { roughness: 0.5 });
  const leafMaterial = createStandardMaterial(selected ? "#fde047" : "#92400e", { roughness: 0.55 });
  const outward = wallThickness / 2 + 0.055;
  const sideOffsets = [-width / 2 - 0.055, width / 2 + 0.055];
  sideOffsets.forEach((along) => {
    const pos = offsetWallPoint(p, basis, along, outward);
    addBoxMesh({
      width: 0.08,
      height: height + 0.18,
      depth: wallThickness + 0.16,
      x: pos.x,
      y: elevation + (height + 0.18) / 2,
      z: pos.z,
      rotationY,
      material: frameMaterial,
      userData: { sourceId: door.id, sourceType: "door-frame" }
    });
  });
  const headerPos = offsetWallPoint(p, basis, 0, outward);
  addBoxMesh({
    width: width + 0.2,
    height: 0.1,
    depth: wallThickness + 0.16,
    x: headerPos.x,
    y: elevation + height + 0.05,
    z: headerPos.z,
    rotationY,
    material: frameMaterial,
    userData: { sourceId: door.id, sourceType: "door-header" }
  });
  const leafOffset = door.swingDirection === "right" ? width * 0.18 : -width * 0.18;
  const leafPos = offsetWallPoint(p, basis, leafOffset, outward + 0.08);
  addBoxMesh({
    width: width * 0.82,
    height: height * 0.92,
    depth: 0.045,
    x: leafPos.x,
    y: elevation + height * 0.46,
    z: leafPos.z,
    rotationY,
    material: leafMaterial,
    userData: { sourceId: door.id, sourceType: "door-leaf" }
  });
  const handleAlong = door.swingDirection === "right" ? -width * 0.28 : width * 0.28;
  const handlePos = offsetWallPoint(p, basis, handleAlong, outward + 0.12);
  addBoxMesh({
    width: 0.08,
    height: 0.08,
    depth: 0.08,
    x: handlePos.x,
    y: elevation + 1.05,
    z: handlePos.z,
    rotationY,
    material: createStandardMaterial("#f8fafc", { metalness: 0.35, roughness: 0.28 }),
    userData: { sourceId: door.id, sourceType: "door-handle" }
  });
}

function addWindowMesh(windowObject, selected) {
  const wall = getObjectById("wall", windowObject.wallId);
  if (!wall) return;
  const point = getWallPointAtRatio(wall, windowObject.ratio);
  const p = pixelPointTo3D(point.x, point.y);
  const wallThickness = Math.max(0.04, Number(wall.thickness) || project.settings.wallThickness);
  const width = Math.max(0.1, Number(windowObject.width) || project.settings.defaultWindowWidth);
  const height = Math.max(0.1, Number(windowObject.height) || project.settings.defaultWindowHeight);
  const sill = Math.max(0, Number(windowObject.sillHeight) || project.settings.defaultWindowSillHeight);
  const elevation = getElevation(windowObject, wall);
  const rotationY = getWallRotation(wall);
  const material = createStandardMaterial(selected ? "#fde047" : "#38bdf8", {
    transparent: true,
    opacity: selected ? 0.86 : 0.42,
    roughness: 0.08,
    metalness: 0.02
  });
  addBoxMesh({
    width,
    height,
    depth: wallThickness + 0.09,
    x: p.x,
    y: elevation + sill + height / 2,
    z: p.z,
    rotationY,
    material,
    userData: { sourceId: windowObject.id, sourceType: "window-glass" },
    castShadow: false
  });

  if (render3DOptions.detail === "simple") return;

  const basis = getWallBasis(wall);
  const frameMaterial = createStandardMaterial(selected ? "#fde047" : "#e2e8f0", { roughness: 0.42, metalness: 0.08 });
  const outward = wallThickness / 2 + 0.07;
  const frameY = elevation + sill + height / 2;
  [-width / 2 - 0.04, width / 2 + 0.04].forEach((along) => {
    const pos = offsetWallPoint(p, basis, along, outward);
    addBoxMesh({
      width: 0.06,
      height: height + 0.12,
      depth: 0.08,
      x: pos.x,
      y: frameY,
      z: pos.z,
      rotationY,
      material: frameMaterial,
      userData: { sourceId: windowObject.id, sourceType: "window-frame" }
    });
  });
  [sill - 0.04, sill + height + 0.04].forEach((frameElevation) => {
    const pos = offsetWallPoint(p, basis, 0, outward);
    addBoxMesh({
      width: width + 0.16,
      height: 0.06,
      depth: 0.09,
      x: pos.x,
      y: elevation + frameElevation,
      z: pos.z,
      rotationY,
      material: frameMaterial,
      userData: { sourceId: windowObject.id, sourceType: "window-frame" }
    });
  });
  if (render3DOptions.detail === "detailed" && width > 0.9) {
    const mullion = offsetWallPoint(p, basis, 0, outward + 0.01);
    addBoxMesh({
      width: 0.045,
      height: height,
      depth: 0.07,
      x: mullion.x,
      y: elevation + sill + height / 2,
      z: mullion.z,
      rotationY,
      material: frameMaterial,
      userData: { sourceId: windowObject.id, sourceType: "window-mullion" }
    });
  }
}

function addFloorMesh(rectObject, color, thickness, selected, id, type) {
  const width = Math.max(0.05, Math.abs(rectObject.width));
  const depth = Math.max(0.05, Math.abs(rectObject.height));
  const p = pixelPointTo3D(rectObject.x + rectObject.width / 2, rectObject.y + rectObject.height / 2);
  const elevation = getElevation(rectObject);
  const material = createStandardMaterial(selected ? "#fde047" : color, {
    roughness: 0.8,
    metalness: 0.01,
    transparent: type === "room",
    opacity: type === "room" ? 0.32 : 1
  });
  addBoxMesh({
    width,
    height: thickness,
    depth,
    x: p.x,
    y: elevation + thickness / 2,
    z: p.z,
    material,
    userData: { sourceId: id, sourceType: type },
    castShadow: type !== "room"
  });

  if (type === "room" || render3DOptions.detail === "simple") return;
  addFloorEdges(rectObject, elevation, thickness, selected);
  if (render3DOptions.detail === "detailed") addFloorTileLines(rectObject, elevation, thickness, id);
}

function addFurnitureMesh(item, selected) {
  const type = item.furnitureType || "bed";
  const preset = getFurniturePreset(type);
  const width = Math.max(0.05, Math.abs(item.width));
  const depth = Math.max(0.05, Math.abs(item.height));
  const height = preset.height;
  const p = pixelPointTo3D(item.x + item.width / 2, item.y + item.height / 2);
  const elevation = getElevation(item);
  const rotationY = -degToRad(item.rotation || 0);
  if (render3DOptions.detail === "simple") {
    addBoxMesh({
      width,
      height,
      depth,
      x: p.x,
      y: elevation + height / 2,
      z: p.z,
      rotationY,
      material: createStandardMaterial(selected ? "#fde047" : (item.color || preset.color), { roughness: 0.72, metalness: 0.03 }),
      userData: { sourceId: item.id, sourceType: "furniture" }
    });
    return;
  }
  addDetailedFurniture(item, type, preset, width, depth, elevation, rotationY, selected);
}

function addRoofMesh(roof, selected) {
  const overhang = Number(roof.overhang) || 0;
  const rect = {
    x: roof.x - overhang,
    y: roof.y - overhang,
    width: roof.width + overhang * 2,
    height: roof.height + overhang * 2
  };
  const width = Math.max(0.05, Math.abs(rect.width));
  const depth = Math.max(0.05, Math.abs(rect.height));
  const p = pixelPointTo3D(rect.x + rect.width / 2, rect.y + rect.height / 2);
  const baseHeight = Number.isFinite(Number(roof.elevation))
    ? Number(roof.elevation) + 0.05
    : getMaxWallHeight() + 0.05;
  const roofHeight = Math.max(0.05, Number(roof.roofHeight) || 0.5);
  const color = selected ? new THREE.Color(0xfde047) : new THREE.Color(roof.color || "#9a3412");

  if (roof.roofType === "gable") {
    const geometry = createGableRoofGeometry(width, depth, roofHeight, baseHeight);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.68, metalness: 0.02, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(p.x, 0, p.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { sourceId: roof.id, sourceType: "roof" };
    root3D.add(mesh);
    return;
  }

  const material = createStandardMaterial(color, { roughness: 0.7, metalness: 0.02 });
  addBoxMesh({
    width,
    height: 0.18,
    depth,
    x: p.x,
    y: baseHeight + 0.09,
    z: p.z,
    material,
    userData: { sourceId: roof.id, sourceType: "roof" }
  });
  if (render3DOptions.detail !== "simple") {
    const fascia = { ...roof, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    addRectPerimeterBoxes(fascia, baseHeight - 0.1, 0.28, 0.12, "#1e293b", { sourceId: roof.id, sourceType: "roof-fascia" });
  }
}

function createStandardMaterial(color, options = {}) {
  const materialColor = color && color.isColor ? color : new THREE.Color(color || "#ffffff");
  return new THREE.MeshStandardMaterial({
    color: materialColor,
    roughness: options.roughness ?? 0.72,
    metalness: options.metalness ?? 0.02,
    transparent: options.transparent || false,
    opacity: options.opacity ?? 1,
    side: options.side || THREE.FrontSide
  });
}

function addBoxMesh({
  width,
  height,
  depth,
  x,
  y,
  z,
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
  quaternion = null,
  material,
  userData = {},
  castShadow = true,
  receiveShadow = true
}) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(Math.max(0.001, width), Math.max(0.001, height), Math.max(0.001, depth)),
    material
  );
  mesh.position.set(x, y, z);
  if (quaternion && mesh.quaternion && typeof mesh.quaternion.copy === "function") {
    mesh.quaternion.copy(quaternion);
  } else {
    mesh.rotation.set(rotationX, rotationY, rotationZ);
  }
  mesh.castShadow = render3DOptions.shadows && castShadow;
  mesh.receiveShadow = receiveShadow;
  mesh.userData = userData;
  root3D.add(mesh);
  return mesh;
}

function addCylinderMesh({
  radiusTop,
  radiusBottom,
  height,
  x,
  y,
  z,
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
  quaternion = null,
  radialSegments = 20,
  material,
  userData = {},
  castShadow = true,
  receiveShadow = true
}) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(
      Math.max(0.001, radiusTop),
      Math.max(0.001, radiusBottom),
      Math.max(0.001, height),
      radialSegments
    ),
    material
  );
  mesh.position.set(x, y, z);
  if (quaternion && mesh.quaternion && typeof mesh.quaternion.copy === "function") {
    mesh.quaternion.copy(quaternion);
  } else {
    mesh.rotation.set(rotationX, rotationY, rotationZ);
  }
  mesh.castShadow = render3DOptions.shadows && castShadow;
  mesh.receiveShadow = receiveShadow;
  mesh.userData = userData;
  root3D.add(mesh);
  return mesh;
}

function composeFurniturePartRotation(rotationY = 0, rotationX = 0, rotationZ = 0) {
  if (typeof THREE === "undefined" || !THREE.Quaternion || !THREE.Euler) return null;
  const yaw = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotationY, 0));
  const local = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotationX, 0, rotationZ));
  return yaw.multiply(local);
}

function addSphereMesh({
  radius,
  x,
  y,
  z,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1,
  material,
  userData = {},
  castShadow = true,
  receiveShadow = true
}) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(Math.max(0.001, radius), 20, 14),
    material
  );
  mesh.position.set(x, y, z);
  mesh.scale.set(scaleX, scaleY, scaleZ);
  mesh.castShadow = render3DOptions.shadows && castShadow;
  mesh.receiveShadow = receiveShadow;
  mesh.userData = userData;
  root3D.add(mesh);
  return mesh;
}

function getWallRotation(wall) {
  return -Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
}

function getWallBasis(wall) {
  const dx = wall.x2 - wall.x1;
  const dz = wall.y2 - wall.y1;
  const length = Math.max(0.0001, Math.hypot(dx, dz));
  const tx = dx / length;
  const tz = dz / length;
  return {
    tx,
    tz,
    nx: -tz,
    nz: tx
  };
}

function offsetWallPoint(point, basis, along = 0, outward = 0) {
  const baseZ = Number.isFinite(point.z) ? point.z : point.y;
  return {
    x: point.x + basis.tx * along + basis.nx * outward,
    z: baseZ + basis.tz * along + basis.nz * outward
  };
}

function addRailingPosts(wall, elevation, height, thickness) {
  const length = getWallLength(wall);
  const basis = getWallBasis(wall);
  const p1 = pixelPointTo3D(wall.x1, wall.y1);
  const rotationY = getWallRotation(wall);
  const postMaterial = createStandardMaterial("#e2e8f0", { roughness: 0.55 });
  const postCount = Math.max(2, Math.ceil(length / 1.1) + 1);
  for (let i = 0; i < postCount; i += 1) {
    const along = (length / Math.max(1, postCount - 1)) * i;
    const pos = { x: p1.x + basis.tx * along, z: p1.z + basis.tz * along };
    addBoxMesh({
      width: 0.12,
      height: height + 0.22,
      depth: thickness + 0.08,
      x: pos.x,
      y: elevation + (height + 0.22) / 2,
      z: pos.z,
      rotationY,
      material: postMaterial,
      userData: { sourceId: wall.id, sourceType: "railing-post" }
    });
  }
}

function addFloorEdges(rectObject, elevation, thickness, selected) {
  addRectPerimeterBoxes(
    rectObject,
    elevation + thickness / 2,
    thickness + 0.02,
    0.08,
    selected ? "#fde047" : "#1e293b",
    { sourceId: rectObject.id, sourceType: "floor-edge" }
  );
}

function addRectPerimeterBoxes(rect, centerY, height, thickness, color, userData) {
  const material = createStandardMaterial(color, { roughness: 0.62 });
  const x = rect.x;
  const y = rect.y;
  const width = Math.abs(rect.width);
  const depth = Math.abs(rect.height);
  addBoxMesh({ width, height, depth: thickness, x: x + width / 2, y: centerY, z: y, material, userData });
  addBoxMesh({ width, height, depth: thickness, x: x + width / 2, y: centerY, z: y + depth, material, userData });
  addBoxMesh({ width: thickness, height, depth, x, y: centerY, z: y + depth / 2, material, userData });
  addBoxMesh({ width: thickness, height, depth, x: x + width, y: centerY, z: y + depth / 2, material, userData });
}

function addFloorTileLines(rectObject, elevation, thickness, id) {
  const lineMaterial = createStandardMaterial("#0f172a", { roughness: 0.8 });
  const topY = elevation + thickness + 0.01;
  const maxLines = 48;
  const xStart = rectObject.x;
  const xEnd = rectObject.x + rectObject.width;
  const yStart = rectObject.y;
  const yEnd = rectObject.y + rectObject.height;
  let lineCount = 0;
  for (let x = Math.ceil(xStart); x < xEnd && lineCount < maxLines; x += 1, lineCount += 1) {
    addBoxMesh({
      width: 0.012,
      height: 0.012,
      depth: Math.abs(rectObject.height),
      x,
      y: topY,
      z: yStart + rectObject.height / 2,
      material: lineMaterial,
      userData: { sourceId: id, sourceType: "floor-tile-line" },
      castShadow: false
    });
  }
  for (let y = Math.ceil(yStart); y < yEnd && lineCount < maxLines; y += 1, lineCount += 1) {
    addBoxMesh({
      width: Math.abs(rectObject.width),
      height: 0.012,
      depth: 0.012,
      x: xStart + rectObject.width / 2,
      y: topY,
      z: y,
      material: lineMaterial,
      userData: { sourceId: id, sourceType: "floor-tile-line" },
      castShadow: false
    });
  }
}

function rotateLocalOffset(dx, dz, rotationY) {
  const cos = Math.cos(rotationY);
  const sin = Math.sin(rotationY);
  return {
    x: dx * cos + dz * sin,
    z: -dx * sin + dz * cos
  };
}

function addFurnitureBox({
  sourceId,
  sourceType,
  cx,
  cz,
  elevation,
  rotationY,
  dx = 0,
  centerY,
  dz = 0,
  width,
  height,
  depth,
  material,
  rotationX = 0,
  rotationZ = 0,
  castShadow = true,
  receiveShadow = true
}) {
  const offset = rotateLocalOffset(dx, dz, rotationY);
  return addBoxMesh({
    width: Math.max(0.01, width),
    height: Math.max(0.01, height),
    depth: Math.max(0.01, depth),
    x: cx + offset.x,
    y: elevation + centerY,
    z: cz + offset.z,
    rotationX,
    rotationY,
    rotationZ,
    quaternion: composeFurniturePartRotation(rotationY, rotationX, rotationZ),
    material,
    userData: { sourceId, sourceType },
    castShadow,
    receiveShadow
  });
}

function addFurnitureCylinder({
  sourceId,
  sourceType,
  cx,
  cz,
  elevation,
  rotationY,
  dx = 0,
  centerY,
  dz = 0,
  radiusTop,
  radiusBottom = radiusTop,
  height,
  material,
  rotationX = 0,
  rotationZ = 0,
  radialSegments = 20,
  castShadow = true,
  receiveShadow = true
}) {
  const offset = rotateLocalOffset(dx, dz, rotationY);
  return addCylinderMesh({
    radiusTop,
    radiusBottom,
    height,
    x: cx + offset.x,
    y: elevation + centerY,
    z: cz + offset.z,
    rotationX,
    rotationY,
    rotationZ,
    quaternion: composeFurniturePartRotation(rotationY, rotationX, rotationZ),
    radialSegments,
    material,
    userData: { sourceId, sourceType },
    castShadow,
    receiveShadow
  });
}

function addFurnitureSphere({
  sourceId,
  sourceType,
  cx,
  cz,
  elevation,
  rotationY,
  dx = 0,
  centerY,
  dz = 0,
  radius,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1,
  material,
  castShadow = true,
  receiveShadow = true
}) {
  const offset = rotateLocalOffset(dx, dz, rotationY);
  return addSphereMesh({
    radius,
    x: cx + offset.x,
    y: elevation + centerY,
    z: cz + offset.z,
    scaleX,
    scaleY,
    scaleZ,
    material,
    userData: { sourceId, sourceType },
    castShadow,
    receiveShadow
  });
}

function addDetailedFurniture(item, type, preset, width, depth, elevation, rotationY, selected) {
  const cx = item.x + item.width / 2;
  const cz = item.y + item.height / 2;
  const id = item.id;
  const color = selected ? "#fde047" : (item.color || preset.color);
  const primary = createStandardMaterial(color, { roughness: 0.68 });
  const dark = createStandardMaterial("#111827", { roughness: 0.72, metalness: 0.03 });
  const light = createStandardMaterial("#e2e8f0", { roughness: 0.55 });
  const white = createStandardMaterial("#f8fafc", { roughness: 0.5 });
  const wood = createStandardMaterial(item.color || "#a16207", { roughness: 0.58 });
  const metal = createStandardMaterial("#94a3b8", { roughness: 0.38, metalness: 0.22 });
  const glass = createStandardMaterial("#7dd3fc", { roughness: 0.12, metalness: 0.02, transparent: true, opacity: 0.34, side: THREE.DoubleSide });
  const green = createStandardMaterial("#22c55e", { roughness: 0.74 });
  const rubber = createStandardMaterial("#020617", { roughness: 0.8 });
  const accent = createStandardMaterial("#60a5fa", { roughness: 0.65 });
  const safe = (value, min = 0.03) => Math.max(min, value);
  const box = (sourceType, dx, centerY, dz, boxWidth, boxHeight, boxDepth, material = primary, options = {}) => addFurnitureBox({
    sourceId: id,
    sourceType,
    cx,
    cz,
    elevation,
    rotationY,
    dx,
    centerY,
    dz,
    width: safe(boxWidth),
    height: safe(boxHeight),
    depth: safe(boxDepth),
    material,
    ...options
  });
  const cylinder = (sourceType, dx, centerY, dz, radiusTop, radiusBottom, cylinderHeight, material = primary, options = {}) => addFurnitureCylinder({
    sourceId: id,
    sourceType,
    cx,
    cz,
    elevation,
    rotationY,
    dx,
    centerY,
    dz,
    radiusTop: safe(radiusTop, 0.015),
    radiusBottom: safe(radiusBottom ?? radiusTop, 0.015),
    height: safe(cylinderHeight, 0.015),
    material,
    ...options
  });
  const sphere = (sourceType, dx, centerY, dz, radius, material = primary, options = {}) => addFurnitureSphere({
    sourceId: id,
    sourceType,
    cx,
    cz,
    elevation,
    rotationY,
    dx,
    centerY,
    dz,
    radius: safe(radius, 0.02),
    material,
    ...options
  });

  if (type === "bunk_bed") {
    box("bunk-bed-frame", 0, 0.13, 0, width, 0.18, depth, dark);
    box("bunk-bed-lower-mattress", 0, 0.34, 0.04, width * 0.88, 0.18, depth * 0.78, primary);
    box("bunk-bed-upper-mattress", 0, 1.28, 0.04, width * 0.88, 0.18, depth * 0.78, primary);
    [-0.44, 0.44].forEach((dx) => [-0.42, 0.42].forEach((dz) => box("bunk-bed-post", dx * width, 0.9, dz * depth, 0.08, 1.8, 0.08, dark)));
    box("bunk-bed-upper-rail-front", 0, 1.52, depth / 2 - 0.04, width, 0.18, 0.08, dark);
    box("bunk-bed-upper-rail-back", 0, 1.52, -depth / 2 + 0.04, width, 0.18, 0.08, dark);
    [-0.36, -0.18, 0, 0.18, 0.36].forEach((dz) => box("bunk-bed-ladder-rung", width / 2 + 0.08, 0.35 + dz + 0.42, dz * depth, 0.06, 0.05, depth * 0.28, metal));
    box("bunk-bed-ladder-side", width / 2 + 0.08, 0.9, -depth * 0.28, 0.05, 1.35, 0.05, metal);
    box("bunk-bed-ladder-side", width / 2 + 0.08, 0.9, depth * 0.28, 0.05, 1.35, 0.05, metal);
    return;
  }

  if (type === "crib") {
    box("crib-mattress", 0, 0.24, 0, width * 0.86, 0.18, depth * 0.74, primary);
    box("crib-head-rail", 0, 0.62, -depth / 2 + 0.035, width, 0.74, 0.07, wood);
    box("crib-foot-rail", 0, 0.62, depth / 2 - 0.035, width, 0.74, 0.07, wood);
    box("crib-left-rail", -width / 2 + 0.035, 0.62, 0, 0.07, 0.74, depth, wood);
    box("crib-right-rail", width / 2 - 0.035, 0.62, 0, 0.07, 0.74, depth, wood);
    for (let i = -3; i <= 3; i += 1) {
      box("crib-slat-front", (i / 7) * width, 0.58, depth / 2 - 0.035, 0.035, 0.62, 0.04, light);
      box("crib-slat-back", (i / 7) * width, 0.58, -depth / 2 + 0.035, 0.035, 0.62, 0.04, light);
    }
    return;
  }

  if (["single_bed", "bed", "king_bed"].includes(type)) {
    box("bed-base", 0, 0.12, 0, width, 0.24, depth, dark);
    box("bed-mattress", 0, 0.34, depth * 0.04, width * 0.9, 0.22, depth * 0.78, primary);
    box("bed-blanket", 0, 0.49, depth * 0.18, width * 0.78, 0.08, depth * 0.38, accent);
    box("bed-headboard", 0, 0.42, -depth / 2 + 0.05, width, 0.84, 0.1, dark);
    const pillows = width > 1.25 ? [-width * 0.23, width * 0.23] : [0];
    pillows.forEach((dx) => box("bed-pillow", dx, 0.55, -depth * 0.28, width / (pillows.length * 2.3), 0.12, depth * 0.18, light));
    return;
  }

  if (["bedroom_bench", "dining_bench", "garden_bench"].includes(type)) {
    const hasBack = type === "garden_bench";
    const benchMaterial = type === "garden_bench" ? primary : wood;
    box("bench-seat", 0, 0.44, 0, width, 0.12, depth * 0.82, benchMaterial);
    if (hasBack) {
      [-0.25, 0, 0.25].forEach((dz) => box("bench-seat-slat", 0, 0.46, dz * depth, width, 0.06, depth * 0.12, benchMaterial));
      box("bench-back", 0, 0.68, -depth / 2 + 0.06, width, 0.42, 0.08, benchMaterial, { rotationX: -0.18 });
      box("bench-left-arm", -width / 2 + 0.06, 0.58, 0, 0.08, 0.34, depth, benchMaterial);
      box("bench-right-arm", width / 2 - 0.06, 0.58, 0, 0.08, 0.34, depth, benchMaterial);
    }
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.38, dark, { legWidth: 0.06 });
    return;
  }

  if (["armchair", "recliner", "patio_chair"].includes(type)) {
    const seatDepth = type === "recliner" ? depth * 0.66 : depth * 0.78;
    box(`${type}-seat`, 0, 0.36, type === "recliner" ? -depth * 0.08 : 0.04, width, 0.24, seatDepth, primary);
    box(`${type}-back`, 0, 0.72, -depth / 2 + 0.06, width, 0.64, 0.12, primary, { rotationX: type === "recliner" ? -0.22 : 0 });
    box(`${type}-left-arm`, -width / 2 + 0.07, 0.48, 0, 0.14, 0.42, depth * 0.85, primary);
    box(`${type}-right-arm`, width / 2 - 0.07, 0.48, 0, 0.14, 0.42, depth * 0.85, primary);
    if (type === "recliner") box("recliner-footrest", 0, 0.24, depth * 0.34, width * 0.84, 0.18, depth * 0.32, primary, { rotationX: 0.18 });
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.2, dark, { legWidth: 0.055 });
    return;
  }

  if (type === "ottoman") {
    box("ottoman-base", 0, 0.18, 0, width, 0.28, depth, dark);
    box("ottoman-cushion", 0, 0.38, 0, width * 0.94, 0.18, depth * 0.9, primary);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.12, dark, { legWidth: 0.05 });
    return;
  }

  if (type === "sofa" || type === "l_sofa") {
    box("sofa-seat", 0, 0.24, type === "l_sofa" ? -depth * 0.12 : 0, width, 0.32, type === "l_sofa" ? depth * 0.58 : depth, primary);
    if (type === "l_sofa") box("sofa-chaise", -width * 0.28, 0.24, depth * 0.2, width * 0.44, 0.32, depth * 0.86, primary);
    box("sofa-back", 0, 0.55, -depth / 2 + 0.06, width, 0.62, 0.12, primary);
    box("sofa-left-arm", -width / 2 + 0.07, 0.42, 0, 0.14, 0.5, depth, primary);
    box("sofa-right-arm", width / 2 - 0.07, 0.42, 0, 0.14, 0.5, depth, primary);
    [-0.22, 0.22].forEach((dx) => box("sofa-cushion", dx * width, 0.44, depth * 0.02, width * 0.34, 0.08, depth * 0.42, light));
    return;
  }

  if (type === "rug") {
    box("rug-surface", 0, 0.018, 0, width, 0.035, depth, primary, { castShadow: false, receiveShadow: true });
    box("rug-border-front", 0, 0.04, depth / 2 - 0.03, width, 0.025, 0.06, dark, { castShadow: false });
    box("rug-border-back", 0, 0.04, -depth / 2 + 0.03, width, 0.025, 0.06, dark, { castShadow: false });
    box("rug-border-left", -width / 2 + 0.03, 0.04, 0, 0.06, 0.025, depth, dark, { castShadow: false });
    box("rug-border-right", width / 2 - 0.03, 0.04, 0, 0.06, 0.025, depth, dark, { castShadow: false });
    return;
  }

  if (type === "fireplace") {
    box("fireplace-body", 0, 0.52, 0, width, 1.04, depth, primary);
    box("fireplace-mantel", 0, 1.04, 0, width + 0.16, 0.12, depth + 0.08, light);
    box("fireplace-opening", 0, 0.42, depth / 2 + 0.018, width * 0.62, 0.48, 0.035, dark);
    [-0.16, 0, 0.16].forEach((dx) => box("fireplace-log", dx * width, 0.24, depth / 2 + 0.06, width * 0.18, 0.08, 0.08, createStandardMaterial("#7c2d12", { roughness: 0.8 })));
    sphere("fireplace-flame", -width * 0.08, 0.42, depth / 2 + 0.07, 0.12, createStandardMaterial("#f97316", { roughness: 0.5 }), { scaleY: 1.4, castShadow: false });
    sphere("fireplace-flame", width * 0.08, 0.48, depth / 2 + 0.07, 0.1, createStandardMaterial("#facc15", { roughness: 0.5 }), { scaleY: 1.35, castShadow: false });
    return;
  }

  if (type === "floor_lamp" || type === "table_lamp") {
    const lampHeight = type === "floor_lamp" ? 1.7 : 0.55;
    const baseRadius = width * 0.32;
    cylinder(`${type}-base`, 0, 0.04, 0, baseRadius, baseRadius * 0.9, 0.08, metal);
    cylinder(`${type}-pole`, 0, lampHeight * 0.45, 0, 0.025, 0.03, lampHeight * 0.78, metal);
    cylinder(`${type}-shade`, 0, lampHeight * 0.88, 0, width * 0.28, width * 0.38, lampHeight * 0.22, createStandardMaterial("#fde68a", { roughness: 0.45 }), { radialSegments: 24, castShadow: false });
    sphere(`${type}-bulb`, 0, lampHeight * 0.78, 0, width * 0.08, createStandardMaterial("#fef3c7", { roughness: 0.3 }), { castShadow: false });
    return;
  }

  if (type === "round_table") {
    cylinder("round-table-top", 0, 0.72, 0, width * 0.5, width * 0.5, 0.1, wood, { radialSegments: 36 });
    cylinder("round-table-post", 0, 0.38, 0, width * 0.06, width * 0.08, 0.66, wood, { radialSegments: 18 });
    cylinder("round-table-base", 0, 0.06, 0, width * 0.28, width * 0.32, 0.08, wood, { radialSegments: 24 });
    return;
  }

  if (["table", "outdoor_table", "coffee_table", "side_table", "console_table", "meeting_table"].includes(type)) {
    const tableHeight = type === "coffee_table" ? 0.42 : type === "side_table" ? 0.55 : 0.75;
    const topThickness = type === "coffee_table" ? 0.08 : 0.12;
    const tableMaterial = ["outdoor_table", "meeting_table"].includes(type) ? primary : wood;
    box("table-top", 0, tableHeight - topThickness / 2, 0, width, topThickness, depth, tableMaterial);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, tableHeight - topThickness, tableMaterial);
    if (type === "coffee_table") box("table-lower-shelf", 0, 0.16, 0, width * 0.78, 0.05, depth * 0.72, dark);
    if (type === "console_table") box("console-table-crossbar", 0, 0.34, 0, width * 0.86, 0.05, 0.06, dark);
    if (type === "meeting_table") {
      box("meeting-table-cable-box", 0, tableHeight + 0.02, 0, width * 0.2, 0.035, depth * 0.16, dark);
      [-0.32, 0, 0.32].forEach((dx) => box("meeting-chair-marker", dx * width, 0.43, -depth * 0.72, width * 0.12, 0.08, depth * 0.2, dark));
      [-0.32, 0, 0.32].forEach((dx) => box("meeting-chair-marker", dx * width, 0.43, depth * 0.72, width * 0.12, 0.08, depth * 0.2, dark));
    }
    return;
  }

  if (type === "dining_table_6") {
    box("dining-table-top", 0, 0.7, 0, width, 0.12, depth, wood);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.64, wood);
    const seatMaterial = createStandardMaterial("#64748b", { roughness: 0.68 });
    [
      [-width * 0.3, -depth * 0.72],
      [0, -depth * 0.72],
      [width * 0.3, -depth * 0.72],
      [-width * 0.3, depth * 0.72],
      [0, depth * 0.72],
      [width * 0.3, depth * 0.72]
    ].forEach(([dx, dz]) => {
      box("dining-chair-seat", dx, 0.42, dz, width * 0.18, 0.1, 0.34, seatMaterial);
      box("dining-chair-back", dx, 0.68, dz + (dz < 0 ? -0.19 : 0.19), width * 0.18, 0.42, 0.07, seatMaterial);
    });
    return;
  }

  if (type === "chair") {
    box("chair-seat", 0, 0.45, 0.04, width, 0.12, depth * 0.82, primary);
    box("chair-back", 0, 0.72, -depth / 2 + 0.04, width, 0.52, 0.08, primary);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.39, dark, { legWidth: 0.055 });
    return;
  }

  if (type === "high_chair") {
    box("high-chair-seat", 0, 0.62, 0.02, width * 0.78, 0.12, depth * 0.68, primary);
    box("high-chair-back", 0, 0.9, -depth / 2 + 0.06, width * 0.8, 0.44, 0.08, primary);
    box("high-chair-tray", 0, 0.72, depth * 0.3, width * 0.86, 0.06, depth * 0.28, light);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.58, metal, { legWidth: 0.045 });
    box("high-chair-footrest", 0, 0.34, depth * 0.24, width * 0.7, 0.04, 0.04, metal);
    return;
  }

  if (type === "office_chair") {
    box("office-chair-seat", 0, 0.48, 0.03, width, 0.14, depth * 0.78, primary);
    box("office-chair-back", 0, 0.82, -depth * 0.35, width * 0.86, 0.56, 0.08, primary);
    cylinder("office-chair-post", 0, 0.25, 0, 0.055, 0.07, 0.42, metal);
    box("office-chair-base-x", 0, 0.08, 0, width * 0.9, 0.06, 0.08, metal);
    box("office-chair-base-z", 0, 0.08, 0, 0.08, 0.06, depth * 0.9, metal);
    return;
  }

  if (type === "bar_stool") {
    cylinder("bar-stool-seat", 0, 0.92, 0, width * 0.42, width * 0.44, 0.1, primary);
    cylinder("bar-stool-post", 0, 0.46, 0, 0.045, 0.065, 0.82, metal);
    box("bar-stool-footrest-x", 0, 0.42, 0, width * 0.82, 0.04, 0.05, metal);
    box("bar-stool-footrest-z", 0, 0.42, 0, 0.05, 0.04, depth * 0.82, metal);
    cylinder("bar-stool-base", 0, 0.04, 0, width * 0.48, width * 0.5, 0.08, metal);
    return;
  }

  if (type === "lounge_chair") {
    box("lounge-seat", 0, 0.22, depth * 0.12, width, 0.2, depth * 0.62, primary);
    box("lounge-back", 0, 0.52, -depth * 0.28, width, 0.52, depth * 0.18, primary, { rotationX: -0.35 });
    box("lounge-footrest", 0, 0.16, depth * 0.38, width * 0.86, 0.14, depth * 0.32, primary);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.16, dark, { legWidth: 0.06 });
    return;
  }

  if (type === "desk") {
    box("desk-top", 0, 0.74, 0, width, 0.1, depth, wood);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.68, wood, { legWidth: 0.06 });
    box("desk-drawer", width * 0.33, 0.42, 0, width * 0.25, 0.56, depth * 0.78, primary);
    box("desk-monitor", -width * 0.18, 1.05, -depth * 0.22, width * 0.34, 0.34, 0.04, dark);
    box("desk-keyboard", -width * 0.18, 0.82, depth * 0.12, width * 0.32, 0.03, depth * 0.16, dark);
    return;
  }

  if (type === "vanity_table") {
    box("vanity-table-top", 0, 0.74, 0, width, 0.1, depth, wood);
    box("vanity-table-drawer", 0, 0.52, depth * 0.18, width * 0.74, 0.22, depth * 0.18, primary);
    box("vanity-table-mirror", 0, 1.16, -depth / 2 + 0.03, width * 0.66, 0.62, 0.05, glass, { castShadow: false });
    box("vanity-table-mirror-frame", 0, 1.16, -depth / 2 + 0.015, width * 0.74, 0.7, 0.035, metal);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.68, wood, { legWidth: 0.055 });
    return;
  }

  if (type === "printer") {
    box("printer-body", 0, 0.16, 0, width, 0.24, depth, light);
    box("printer-lid", 0, 0.31, -depth * 0.08, width * 0.92, 0.08, depth * 0.72, dark);
    box("printer-output-tray", 0, 0.08, depth / 2 + 0.08, width * 0.74, 0.035, depth * 0.28, dark);
    box("printer-control-panel", width * 0.28, 0.34, depth * 0.26, width * 0.24, 0.035, depth * 0.18, metal);
    return;
  }

  if (type === "filing_cabinet") {
    box("filing-cabinet-body", 0, 0.52, 0, width, 1.04, depth, primary);
    [0.24, 0.5, 0.76].forEach((ratio) => {
      box("filing-cabinet-drawer", 0, ratio, depth / 2 + 0.018, width * 0.86, 0.2, 0.035, light);
      box("filing-cabinet-handle", 0, ratio, depth / 2 + 0.05, width * 0.34, 0.03, 0.03, metal);
    });
    return;
  }

  if (type === "server_rack") {
    box("server-rack-shell", 0, 1.0, 0, width, 2.0, depth, dark);
    box("server-rack-glass-door", 0, 1.0, depth / 2 + 0.018, width * 0.86, 1.78, 0.035, glass, { castShadow: false });
    for (let i = 0; i < 7; i += 1) {
      box("server-rack-unit", 0, 0.32 + i * 0.22, depth / 2 + 0.04, width * 0.72, 0.08, 0.04, i % 2 ? metal : primary);
    }
    return;
  }

  if (type === "kitchen_counter" || type === "kitchen_island") {
    box("counter-base", 0, 0.39, 0, width, 0.78, depth, primary);
    box("counter-top", 0, 0.84, 0, width + 0.08, 0.12, depth + 0.08, light);
    if (type === "kitchen_counter") box("counter-backsplash", 0, 1.04, -depth / 2 + 0.035, width, 0.34, 0.07, light);
    [-0.25, 0.25].forEach((dx) => box("counter-door", dx * width, 0.44, depth / 2 + 0.012, width * 0.38, 0.48, 0.035, dark));
    if (type === "kitchen_island") {
      [-0.26, 0.26].forEach((dx) => {
        cylinder("island-stool-seat", dx * width, 0.68, depth * 0.68, 0.16, 0.17, 0.08, dark);
        cylinder("island-stool-post", dx * width, 0.34, depth * 0.68, 0.035, 0.045, 0.6, metal);
      });
    }
    return;
  }

  if (type === "upper_cabinet") {
    box("upper-cabinet-body", 0, 1.35, 0, width, 0.8, depth, primary);
    [-0.25, 0.25].forEach((dx) => {
      box("upper-cabinet-door", dx * width, 1.35, depth / 2 + 0.018, width * 0.44, 0.68, 0.035, light);
      box("upper-cabinet-handle", dx * width + (dx < 0 ? 0.11 : -0.11), 1.35, depth / 2 + 0.05, 0.03, 0.34, 0.03, metal);
    });
    return;
  }

  if (type === "pantry") {
    box("pantry-body", 0, 1.05, 0, width, 2.1, depth, wood);
    [-0.25, 0.25].forEach((dx) => {
      box("pantry-door", dx * width, 1.05, depth / 2 + 0.018, width * 0.44, 1.88, 0.035, primary);
      box("pantry-handle", dx * width + (dx < 0 ? 0.1 : -0.1), 1.0, depth / 2 + 0.052, 0.035, 0.58, 0.035, metal);
    });
    box("pantry-kick", 0, 0.08, depth / 2 + 0.02, width, 0.16, 0.04, dark);
    return;
  }

  if (type === "refrigerator") {
    box("refrigerator-body", 0, 0.95, 0, width, 1.9, depth, light);
    box("refrigerator-freezer-door", 0, 1.52, depth / 2 + 0.015, width * 0.94, 0.62, 0.035, white);
    box("refrigerator-fridge-door", 0, 0.72, depth / 2 + 0.015, width * 0.94, 0.9, 0.035, white);
    box("refrigerator-handle-top", width * 0.38, 1.5, depth / 2 + 0.045, 0.035, 0.42, 0.035, metal);
    box("refrigerator-handle-bottom", width * 0.38, 0.82, depth / 2 + 0.045, 0.035, 0.56, 0.035, metal);
    return;
  }

  if (type === "dishwasher") {
    box("dishwasher-body", 0, 0.42, 0, width, 0.84, depth, light);
    box("dishwasher-door", 0, 0.43, depth / 2 + 0.018, width * 0.9, 0.72, 0.035, primary);
    box("dishwasher-control-strip", 0, 0.77, depth / 2 + 0.05, width * 0.8, 0.08, 0.03, dark);
    box("dishwasher-handle", 0, 0.62, depth / 2 + 0.055, width * 0.6, 0.035, 0.035, metal);
    return;
  }

  if (type === "stove") {
    box("stove-body", 0, 0.42, 0, width, 0.84, depth, dark);
    box("stove-cooktop", 0, 0.89, 0, width, 0.06, depth, metal);
    [-0.22, 0.22].forEach((dx) => [-0.18, 0.18].forEach((dz) => cylinder("stove-burner", dx * width, 0.94, dz * depth, 0.08, 0.08, 0.025, rubber)));
    box("stove-oven-glass", 0, 0.42, depth / 2 + 0.015, width * 0.7, 0.42, 0.035, glass);
    box("stove-handle", 0, 0.69, depth / 2 + 0.05, width * 0.62, 0.035, 0.035, metal);
    return;
  }

  if (type === "oven") {
    box("oven-tower", 0, 0.55, 0, width, 1.1, depth, dark);
    box("oven-glass-top", 0, 0.78, depth / 2 + 0.018, width * 0.72, 0.34, 0.035, glass, { castShadow: false });
    box("oven-glass-bottom", 0, 0.34, depth / 2 + 0.018, width * 0.72, 0.34, 0.035, glass, { castShadow: false });
    box("oven-handle-top", 0, 0.98, depth / 2 + 0.052, width * 0.62, 0.035, 0.035, metal);
    box("oven-handle-bottom", 0, 0.54, depth / 2 + 0.052, width * 0.62, 0.035, 0.035, metal);
    return;
  }

  if (type === "microwave") {
    box("microwave-body", 0, 0.16, 0, width, 0.32, depth, dark);
    box("microwave-door-glass", -width * 0.08, 0.16, depth / 2 + 0.018, width * 0.58, 0.22, 0.035, glass, { castShadow: false });
    box("microwave-control-panel", width * 0.34, 0.16, depth / 2 + 0.02, width * 0.18, 0.24, 0.035, metal);
    box("microwave-handle", -width * 0.38, 0.16, depth / 2 + 0.052, 0.035, 0.2, 0.035, light);
    return;
  }

  if (type === "range_hood") {
    box("range-hood-duct", 0, 0.62, -depth * 0.1, width * 0.34, 0.7, depth * 0.28, metal);
    box("range-hood-canopy", 0, 0.18, 0, width, 0.24, depth, metal);
    box("range-hood-filter", 0, 0.05, depth * 0.12, width * 0.72, 0.035, depth * 0.48, dark);
    return;
  }

  if (type === "coffee_machine") {
    box("coffee-machine-body", 0, 0.22, 0, width, 0.42, depth, dark);
    box("coffee-machine-water-tank", -width * 0.28, 0.28, -depth * 0.18, width * 0.22, 0.28, depth * 0.22, glass, { castShadow: false });
    box("coffee-machine-panel", width * 0.18, 0.3, depth / 2 + 0.018, width * 0.32, 0.16, 0.035, metal);
    box("coffee-machine-spout", 0, 0.26, depth / 2 + 0.05, width * 0.28, 0.06, 0.05, metal);
    cylinder("coffee-cup", 0, 0.08, depth * 0.28, width * 0.12, width * 0.1, 0.16, white);
    return;
  }

  if (type === "sink") {
    box("sink-cabinet", 0, 0.38, 0, width, 0.76, depth, primary);
    box("sink-counter", 0, 0.82, 0, width + 0.05, 0.08, depth + 0.04, light);
    box("sink-basin", 0, 0.88, 0.02, width * 0.62, 0.07, depth * 0.48, metal);
    box("sink-faucet-neck", 0, 1.03, -depth * 0.2, 0.05, 0.28, 0.05, metal);
    box("sink-faucet-spout", 0, 1.16, -depth * 0.05, 0.05, 0.05, depth * 0.22, metal);
    return;
  }

  if (type === "toilet") {
    box("toilet-base", 0, 0.13, depth * 0.1, width * 0.78, 0.26, depth * 0.58, white);
    cylinder("toilet-bowl", 0, 0.34, depth * 0.08, width * 0.32, width * 0.28, 0.22, white);
    box("toilet-seat", 0, 0.48, depth * 0.08, width * 0.74, 0.05, depth * 0.45, light);
    box("toilet-tank", 0, 0.62, -depth * 0.32, width * 0.96, 0.46, depth * 0.2, white);
    return;
  }

  if (type === "bidet") {
    box("bidet-base", 0, 0.14, 0.06, width * 0.78, 0.28, depth * 0.56, white);
    cylinder("bidet-bowl", 0, 0.34, 0.04, width * 0.32, width * 0.28, 0.18, white);
    box("bidet-rim", 0, 0.45, 0.04, width * 0.72, 0.05, depth * 0.44, light);
    box("bidet-faucet", 0, 0.56, -depth * 0.22, 0.05, 0.22, 0.05, metal);
    return;
  }

  if (type === "shower") {
    box("shower-tray", 0, 0.05, 0, width, 0.1, depth, white);
    box("shower-glass-back", 0, 1.08, -depth / 2 + 0.025, width, 2.05, 0.05, glass, { castShadow: false });
    box("shower-glass-side", -width / 2 + 0.025, 1.08, 0, 0.05, 2.05, depth, glass, { castShadow: false });
    box("shower-pipe", width * 0.26, 1.25, -depth * 0.34, 0.04, 1.42, 0.04, metal);
    cylinder("shower-head", width * 0.18, 1.96, -depth * 0.22, 0.11, 0.08, 0.06, metal, { rotationX: Math.PI / 2 });
    return;
  }

  if (type === "bathtub") {
    box("bathtub-shell", 0, 0.28, 0, width, 0.56, depth, white);
    box("bathtub-inner", 0, 0.48, 0, width * 0.82, 0.16, depth * 0.62, light);
    box("bathtub-rim-front", 0, 0.6, depth / 2 - 0.04, width, 0.12, 0.08, white);
    box("bathtub-rim-back", 0, 0.6, -depth / 2 + 0.04, width, 0.12, 0.08, white);
    box("bathtub-faucet", -width * 0.34, 0.78, -depth * 0.24, 0.06, 0.22, 0.06, metal);
    return;
  }

  if (type === "vanity") {
    box("vanity-cabinet", 0, 0.37, 0, width, 0.74, depth, primary);
    box("vanity-counter", 0, 0.79, 0, width + 0.04, 0.08, depth + 0.04, light);
    box("vanity-basin", 0, 0.86, 0.04, width * 0.55, 0.08, depth * 0.38, white);
    box("vanity-mirror", 0, 1.36, -depth / 2 + 0.025, width * 0.84, 0.82, 0.04, glass, { castShadow: false });
    return;
  }

  if (type === "bathroom_mirror") {
    const mirrorHeight = preset.height || 0.9;
    box("bathroom-mirror-glass", 0, 1.25, 0, width, mirrorHeight, depth, glass, { castShadow: false });
    box("bathroom-mirror-frame-top", 0, 1.72, 0, width + 0.05, 0.05, depth + 0.02, metal);
    box("bathroom-mirror-frame-bottom", 0, 0.78, 0, width + 0.05, 0.05, depth + 0.02, metal);
    box("bathroom-mirror-frame-left", -width / 2, 1.25, 0, 0.05, mirrorHeight, depth + 0.02, metal);
    box("bathroom-mirror-frame-right", width / 2, 1.25, 0, 0.05, mirrorHeight, depth + 0.02, metal);
    return;
  }

  if (type === "towel_rack") {
    box("towel-rack-left-mount", -width / 2 + 0.04, 1.05, 0, 0.06, 0.28, depth, metal);
    box("towel-rack-right-mount", width / 2 - 0.04, 1.05, 0, 0.06, 0.28, depth, metal);
    box("towel-rack-bar", 0, 1.12, depth / 2, width, 0.035, 0.035, metal);
    box("towel-fold", 0, 0.86, depth / 2 + 0.02, width * 0.72, 0.42, 0.04, primary);
    return;
  }

  if (type === "washer" || type === "dryer") {
    box(`${type}-body`, 0, 0.45, 0, width, 0.9, depth, light);
    box(`${type}-control-strip`, 0, 0.78, depth / 2 + 0.015, width * 0.88, 0.14, 0.035, dark);
    cylinder(`${type}-door`, 0, 0.42, depth / 2 + 0.035, width * 0.28, width * 0.28, 0.04, glass, { rotationX: Math.PI / 2, castShadow: false });
    return;
  }

  if (type === "laundry_basket") {
    box("laundry-basket-shell", 0, 0.26, 0, width, 0.52, depth, createStandardMaterial("#f59e0b", { roughness: 0.75, transparent: true, opacity: 0.82 }));
    box("laundry-basket-hole-front", 0, 0.34, depth / 2 + 0.018, width * 0.72, 0.16, 0.035, dark);
    [-0.22, 0, 0.22].forEach((dx) => sphere("laundry-cloth", dx * width, 0.56, -depth * 0.08, width * 0.13, dx === 0 ? accent : light, { scaleY: 0.55 }));
    return;
  }

  if (type === "ironing_board") {
    box("ironing-board-top", 0, 0.84, 0, width, 0.06, depth, primary, { rotationZ: 0.03 });
    box("ironing-board-pad", 0, 0.89, 0, width * 0.92, 0.035, depth * 0.82, light);
    box("ironing-board-leg-a", -width * 0.18, 0.42, 0, 0.055, 0.78, 0.055, metal, { rotationZ: 0.35 });
    box("ironing-board-leg-b", width * 0.18, 0.42, 0, 0.055, 0.78, 0.055, metal, { rotationZ: -0.35 });
    return;
  }

  if (type === "tv") {
    box("tv-screen", 0, 0.85, 0, width, 0.82, 0.06, dark);
    box("tv-panel-glass", 0, 0.85, depth / 2 + 0.01, width * 0.92, 0.7, 0.025, glass, { castShadow: false });
    box("tv-neck", 0, 0.32, 0, width * 0.08, 0.36, 0.06, dark);
    box("tv-base", 0, 0.08, 0, width * 0.45, 0.08, depth, dark);
    return;
  }

  if (type === "buffet") {
    box("buffet-body", 0, 0.45, 0, width, 0.86, depth, wood);
    box("buffet-top", 0, 0.9, 0, width + 0.06, 0.08, depth + 0.04, light);
    [-0.3, 0, 0.3].forEach((dx) => {
      box("buffet-door", dx * width, 0.42, depth / 2 + 0.018, width * 0.24, 0.54, 0.035, primary);
      box("buffet-handle", dx * width, 0.48, depth / 2 + 0.05, width * 0.1, 0.03, 0.03, metal);
    });
    [-0.2, 0.2].forEach((dx) => box("buffet-drawer", dx * width, 0.73, depth / 2 + 0.018, width * 0.32, 0.16, 0.035, primary));
    return;
  }

  if (type === "shoe_rack") {
    box("shoe-rack-frame-left", -width / 2 + 0.035, 0.38, 0, 0.07, 0.72, depth, wood);
    box("shoe-rack-frame-right", width / 2 - 0.035, 0.38, 0, 0.07, 0.72, depth, wood);
    [0.18, 0.42, 0.66].forEach((y) => box("shoe-rack-shelf", 0, y, 0, width, 0.055, depth, wood));
    [-0.28, 0, 0.28].forEach((dx) => {
      box("shoe-pair-left", dx * width, 0.23, depth * 0.16, width * 0.14, 0.07, depth * 0.2, dark);
      box("shoe-pair-right", dx * width + width * 0.08, 0.23, depth * 0.16, width * 0.14, 0.07, depth * 0.2, dark);
    });
    return;
  }

  if (type === "coat_rack") {
    cylinder("coat-rack-base", 0, 0.05, 0, width * 0.32, width * 0.34, 0.1, dark, { radialSegments: 20 });
    cylinder("coat-rack-pole", 0, 0.85, 0, 0.035, 0.045, 1.65, wood, { radialSegments: 16 });
    for (let i = 0; i < 4; i += 1) {
      const angle = (Math.PI / 2) * i;
      const dx = Math.cos(angle) * width * 0.23;
      const dz = Math.sin(angle) * depth * 0.23;
      box("coat-rack-hook", dx / 2, 1.48, dz / 2, Math.abs(dx) + 0.06, 0.045, Math.abs(dz) + 0.06, metal);
    }
    return;
  }

  if (type === "workbench") {
    box("workbench-top", 0, 0.86, 0, width, 0.1, depth, wood);
    addFurnitureLegs(id, cx, cz, width, depth, elevation, rotationY, 0.8, wood, { legWidth: 0.08 });
    box("workbench-lower-shelf", 0, 0.26, 0, width * 0.84, 0.08, depth * 0.72, dark);
    box("workbench-pegboard", 0, 1.35, -depth / 2 + 0.035, width, 0.9, 0.07, createStandardMaterial("#92400e", { roughness: 0.68 }));
    [-0.28, 0, 0.28].forEach((dx) => box("workbench-tool", dx * width, 1.42, -depth / 2 + 0.08, 0.06, 0.36, 0.04, metal));
    box("workbench-vise", -width * 0.38, 0.98, depth * 0.28, width * 0.16, 0.16, depth * 0.18, metal);
    return;
  }

  if (type === "tool_chest") {
    box("tool-chest-body", 0, 0.45, 0, width, 0.9, depth, primary);
    [0.2, 0.38, 0.56, 0.74].forEach((y) => {
      box("tool-chest-drawer", 0, y, depth / 2 + 0.018, width * 0.86, 0.12, 0.035, createStandardMaterial("#b91c1c", { roughness: 0.66 }));
      box("tool-chest-handle", 0, y, depth / 2 + 0.05, width * 0.5, 0.025, 0.025, metal);
    });
    [-0.32, 0.32].forEach((dx) => cylinder("tool-chest-caster", dx * width, 0.06, depth * 0.32, 0.055, 0.055, 0.045, rubber, { rotationZ: Math.PI / 2 }));
    return;
  }

  if (type === "treadmill") {
    box("treadmill-deck", 0, 0.18, 0, width, 0.14, depth, dark, { rotationZ: -0.04 });
    box("treadmill-belt", 0, 0.27, 0, width * 0.82, 0.035, depth * 0.64, rubber);
    box("treadmill-front-roller", width * 0.42, 0.32, 0, 0.12, 0.16, depth * 0.76, metal);
    box("treadmill-left-rail", width * 0.2, 0.78, -depth * 0.36, 0.055, 0.88, 0.055, metal, { rotationZ: -0.22 });
    box("treadmill-right-rail", width * 0.2, 0.78, depth * 0.36, 0.055, 0.88, 0.055, metal, { rotationZ: -0.22 });
    box("treadmill-console", width * 0.42, 1.18, 0, 0.16, 0.3, depth * 0.62, primary);
    return;
  }

  if (type === "exercise_bike") {
    cylinder("exercise-bike-flywheel", -width * 0.22, 0.34, 0, 0.28, 0.28, 0.08, rubber, { rotationX: Math.PI / 2, radialSegments: 28 });
    box("exercise-bike-frame", 0, 0.55, 0, width * 0.72, 0.06, 0.06, primary, { rotationZ: 0.18 });
    box("exercise-bike-seat-post", width * 0.08, 0.68, 0, 0.055, 0.7, 0.055, metal, { rotationZ: -0.12 });
    box("exercise-bike-seat", width * 0.1, 1.02, 0, width * 0.22, 0.08, depth * 0.36, dark);
    box("exercise-bike-handle-post", width * 0.36, 0.75, 0, 0.055, 0.72, 0.055, metal, { rotationZ: 0.18 });
    box("exercise-bike-handlebar", width * 0.42, 1.08, 0, 0.08, 0.06, depth * 0.76, metal);
    box("exercise-bike-base", 0, 0.08, 0, width, 0.08, depth * 0.18, dark);
    return;
  }

  if (["nightstand", "dresser", "wardrobe", "cabinet", "bookcase", "storage_shelf", "tv_stand"].includes(type)) {
    const itemHeight = Math.max(0.32, preset.height);
    if (type === "bookcase" || type === "storage_shelf") {
      box("shelf-back", 0, itemHeight / 2, -depth / 2 + 0.035, width, itemHeight, 0.07, wood);
      box("shelf-left-side", -width / 2 + 0.035, itemHeight / 2, 0, 0.07, itemHeight, depth, wood);
      box("shelf-right-side", width / 2 - 0.035, itemHeight / 2, 0, 0.07, itemHeight, depth, wood);
      for (let i = 1; i <= 4; i += 1) {
        const y = (itemHeight / 5) * i;
        box("shelf-board", 0, y, 0, width, 0.06, depth, wood);
      }
      return;
    }
    box("storage-body", 0, itemHeight / 2, 0, width, itemHeight, depth, wood);
    if (type === "wardrobe") {
      [-0.25, 0.25].forEach((dx) => {
        box("wardrobe-door", dx * width, itemHeight * 0.52, depth / 2 + 0.018, width * 0.45, itemHeight * 0.86, 0.035, primary);
        box("wardrobe-handle", dx * width + (dx < 0 ? 0.12 : -0.12), itemHeight * 0.55, depth / 2 + 0.05, 0.035, 0.46, 0.035, metal);
      });
      return;
    }
    if (type === "dresser") {
      [0.25, 0.5, 0.75].forEach((ratio) => {
        box("dresser-drawer", 0, itemHeight * ratio, depth / 2 + 0.018, width * 0.86, itemHeight * 0.17, 0.035, primary);
        box("dresser-handle", 0, itemHeight * ratio, depth / 2 + 0.05, width * 0.42, 0.035, 0.035, metal);
      });
      return;
    }
    if (type === "tv_stand" || type === "nightstand" || type === "cabinet") {
      box("storage-top", 0, itemHeight + 0.03, 0, width + 0.04, 0.06, depth + 0.04, light);
      [-0.24, 0.24].forEach((dx) => {
        box("storage-door", dx * width, itemHeight * 0.48, depth / 2 + 0.018, width * 0.38, itemHeight * 0.42, 0.035, primary);
        box("storage-handle", dx * width, itemHeight * 0.52, depth / 2 + 0.05, width * 0.18, 0.03, 0.03, metal);
      });
      return;
    }
  }

  if (type === "plant") {
    cylinder("plant-pot", 0, 0.18, 0, width * 0.28, width * 0.36, 0.36, createStandardMaterial("#92400e", { roughness: 0.8 }));
    cylinder("plant-stem", 0, 0.64, 0, 0.035, 0.045, 0.72, createStandardMaterial("#166534", { roughness: 0.78 }));
    sphere("plant-foliage", 0, 1.08, 0, width * 0.42, green, { scaleY: 0.82 });
    sphere("plant-foliage", width * 0.22, 0.95, 0.08, width * 0.28, green, { scaleY: 0.72 });
    sphere("plant-foliage", -width * 0.22, 0.95, -0.06, width * 0.28, green, { scaleY: 0.72 });
    return;
  }

  if (type === "planter_box") {
    box("planter-box-soil", 0, 0.42, 0, width * 0.9, 0.08, depth * 0.72, createStandardMaterial("#3f2a1d", { roughness: 0.86 }));
    box("planter-box-front", 0, 0.28, depth / 2 - 0.035, width, 0.42, 0.07, wood);
    box("planter-box-back", 0, 0.28, -depth / 2 + 0.035, width, 0.42, 0.07, wood);
    box("planter-box-left", -width / 2 + 0.035, 0.28, 0, 0.07, 0.42, depth, wood);
    box("planter-box-right", width / 2 - 0.035, 0.28, 0, 0.07, 0.42, depth, wood);
    [-0.28, 0, 0.28].forEach((dx) => sphere("planter-foliage", dx * width, 0.66, 0, width * 0.16, green, { scaleY: 0.72 }));
    return;
  }

  if (type === "grill") {
    box("grill-cart", 0, 0.42, 0, width, 0.58, depth, dark);
    cylinder("grill-lid", 0, 0.82, -depth * 0.08, width * 0.42, width * 0.42, depth * 0.55, dark, { rotationX: Math.PI / 2, radialSegments: 24 });
    box("grill-side-shelf-left", -width / 2 - 0.16, 0.68, 0, 0.32, 0.06, depth * 0.72, metal);
    box("grill-side-shelf-right", width / 2 + 0.16, 0.68, 0, 0.32, 0.06, depth * 0.72, metal);
    box("grill-handle", 0, 0.94, depth / 2 + 0.04, width * 0.6, 0.04, 0.04, metal);
    [-0.3, 0.3].forEach((dx) => cylinder("grill-wheel", dx * width, 0.12, depth * 0.36, 0.1, 0.1, 0.08, rubber, { rotationZ: Math.PI / 2 }));
    return;
  }

  if (type === "patio_umbrella") {
    cylinder("umbrella-pole", 0, 1.05, 0, 0.035, 0.045, 2.1, metal);
    cylinder("umbrella-base", 0, 0.05, 0, width * 0.18, width * 0.2, 0.1, dark, { radialSegments: 24 });
    cylinder("umbrella-canopy", 0, 2.05, 0, width * 0.08, width * 0.5, 0.32, primary, { radialSegments: 32 });
    [-0.35, 0, 0.35].forEach((dx) => box("umbrella-rib", dx * width, 1.94, 0, width * 0.28, 0.035, 0.035, metal, { rotationZ: dx * 0.15 }));
    [-0.35, 0, 0.35].forEach((dz) => box("umbrella-rib", 0, 1.94, dz * depth, 0.035, 0.035, depth * 0.28, metal, { rotationX: -dz * 0.15 }));
    return;
  }

  if (type === "pergola") {
    [-0.45, 0.45].forEach((dx) => [-0.42, 0.42].forEach((dz) => box("pergola-post", dx * width, 1.2, dz * depth, 0.12, 2.4, 0.12, wood)));
    [-0.42, 0.42].forEach((dz) => box("pergola-beam-long", 0, 2.45, dz * depth, width, 0.12, 0.12, wood));
    [-0.45, 0.45].forEach((dx) => box("pergola-beam-short", dx * width, 2.38, 0, 0.12, 0.12, depth, wood));
    for (let i = -2; i <= 2; i += 1) box("pergola-slat", (i / 5) * width, 2.55, 0, 0.08, 0.08, depth, light);
    return;
  }

  if (type === "car") {
    const tireRadius = Math.min(0.28, width * 0.06, depth * 0.15);
    const tireWidth = Math.min(0.22, depth * 0.12);
    const wheelX = [-width * 0.34, width * 0.35];
    const wheelZ = [-depth * 0.46, depth * 0.46];
    box("car-chassis", 0, 0.34, 0, width * 0.94, 0.28, depth * 0.82, dark);
    box("car-body", 0, 0.62, 0, width * 0.9, 0.48, depth * 0.78, primary);
    box("car-hood", width * 0.3, 0.84, 0, width * 0.34, 0.2, depth * 0.72, primary);
    box("car-trunk", -width * 0.36, 0.82, 0, width * 0.22, 0.18, depth * 0.72, primary);
    box("car-cabin", -width * 0.06, 1.06, 0, width * 0.42, 0.5, depth * 0.62, glass, { castShadow: false });
    box("car-roof", -width * 0.08, 1.32, 0, width * 0.34, 0.08, depth * 0.56, primary);
    box("car-front-windshield", width * 0.16, 1.07, 0, width * 0.08, 0.42, depth * 0.56, glass, { castShadow: false, rotationZ: -0.2 });
    box("car-rear-windshield", -width * 0.29, 1.04, 0, width * 0.08, 0.36, depth * 0.54, glass, { castShadow: false, rotationZ: 0.18 });
    wheelX.forEach((dx) => wheelZ.forEach((dz) => {
      cylinder("car-tire", dx, tireRadius, dz, tireRadius, tireRadius, tireWidth, rubber, { rotationX: Math.PI / 2, radialSegments: 28 });
      cylinder("car-wheel-hub", dx, tireRadius, dz + Math.sign(dz) * 0.012, tireRadius * 0.42, tireRadius * 0.42, tireWidth + 0.025, metal, { rotationX: Math.PI / 2, radialSegments: 18 });
    }));
    box("car-front-bumper", width / 2 - 0.05, 0.48, 0, 0.1, 0.16, depth * 0.8, metal);
    box("car-rear-bumper", -width / 2 + 0.05, 0.48, 0, 0.1, 0.16, depth * 0.78, metal);
    box("car-headlight-left", width / 2 + 0.004, 0.66, -depth * 0.23, 0.035, 0.1, 0.18, light, { castShadow: false });
    box("car-headlight-right", width / 2 + 0.004, 0.66, depth * 0.23, 0.035, 0.1, 0.18, light, { castShadow: false });
    box("car-tail-light-left", -width / 2 - 0.004, 0.64, -depth * 0.24, 0.035, 0.1, 0.16, createStandardMaterial("#ef4444", { roughness: 0.45 }), { castShadow: false });
    box("car-tail-light-right", -width / 2 - 0.004, 0.64, depth * 0.24, 0.035, 0.1, 0.16, createStandardMaterial("#ef4444", { roughness: 0.45 }), { castShadow: false });
    box("car-left-mirror", width * 0.12, 1.05, -depth * 0.48, 0.12, 0.06, 0.04, dark);
    box("car-right-mirror", width * 0.12, 1.05, depth * 0.48, 0.12, 0.06, 0.04, dark);
    return;
  }

  if (type === "motorcycle") {
    const tireRadius = Math.min(0.28, width * 0.14, depth * 0.36);
    const frontX = width * 0.36;
    const rearX = -width * 0.36;
    cylinder("motorcycle-front-tire", frontX, tireRadius, 0, tireRadius, tireRadius, depth * 0.18, rubber, { rotationX: Math.PI / 2, radialSegments: 28 });
    cylinder("motorcycle-back-tire", rearX, tireRadius, 0, tireRadius, tireRadius, depth * 0.18, rubber, { rotationX: Math.PI / 2, radialSegments: 28 });
    cylinder("motorcycle-front-hub", frontX, tireRadius, 0, tireRadius * 0.38, tireRadius * 0.38, depth * 0.21, metal, { rotationX: Math.PI / 2, radialSegments: 16 });
    cylinder("motorcycle-back-hub", rearX, tireRadius, 0, tireRadius * 0.38, tireRadius * 0.38, depth * 0.21, metal, { rotationX: Math.PI / 2, radialSegments: 16 });
    box("motorcycle-main-frame", 0, 0.62, 0, width * 0.56, 0.08, depth * 0.16, primary, { rotationZ: -0.05 });
    box("motorcycle-frame-down", -width * 0.04, 0.52, 0, width * 0.5, 0.055, depth * 0.12, metal, { rotationZ: 0.35 });
    box("motorcycle-seat", -width * 0.13, 0.82, 0, width * 0.38, 0.12, depth * 0.34, dark);
    box("motorcycle-tank", width * 0.1, 0.82, 0, width * 0.28, 0.18, depth * 0.32, primary);
    box("motorcycle-engine", -width * 0.06, 0.48, 0, width * 0.22, 0.22, depth * 0.26, metal);
    box("motorcycle-front-fork", width * 0.3, 0.68, 0, 0.055, 0.72, depth * 0.08, metal, { rotationZ: -0.22 });
    box("motorcycle-handlebar", width * 0.43, 1.0, 0, 0.08, 0.08, depth * 0.72, metal);
    box("motorcycle-headlight", width * 0.46, 0.82, 0, 0.08, 0.1, depth * 0.18, light, { castShadow: false });
    box("motorcycle-exhaust", -width * 0.22, 0.52, depth * 0.22, width * 0.42, 0.055, 0.06, metal, { rotationZ: -0.08 });
    return;
  }

  if (type === "bicycle") {
    const tireRadius = Math.min(0.3, width * 0.16, depth * 0.52);
    cylinder("bicycle-front-tire", width * 0.36, tireRadius, 0, tireRadius, tireRadius, depth * 0.08, rubber, { rotationX: Math.PI / 2, radialSegments: 32 });
    cylinder("bicycle-back-tire", -width * 0.36, tireRadius, 0, tireRadius, tireRadius, depth * 0.08, rubber, { rotationX: Math.PI / 2, radialSegments: 32 });
    cylinder("bicycle-front-hub", width * 0.36, tireRadius, 0, tireRadius * 0.18, tireRadius * 0.18, depth * 0.1, metal, { rotationX: Math.PI / 2, radialSegments: 14 });
    cylinder("bicycle-back-hub", -width * 0.36, tireRadius, 0, tireRadius * 0.18, tireRadius * 0.18, depth * 0.1, metal, { rotationX: Math.PI / 2, radialSegments: 14 });
    box("bicycle-frame-top", 0, 0.72, 0, width * 0.56, 0.045, 0.045, primary, { rotationZ: -0.1 });
    box("bicycle-frame-down", -width * 0.08, 0.58, 0, width * 0.5, 0.04, 0.04, primary, { rotationZ: 0.38 });
    box("bicycle-frame-seat-tube", -width * 0.12, 0.66, 0, 0.04, 0.46, 0.04, primary, { rotationZ: -0.16 });
    box("bicycle-front-fork", width * 0.3, 0.62, 0, 0.04, 0.54, 0.04, metal, { rotationZ: -0.18 });
    box("bicycle-seat", -width * 0.12, 0.92, 0, width * 0.18, 0.07, depth * 0.32, dark);
    box("bicycle-handlebar", width * 0.42, 0.9, 0, 0.08, 0.08, depth * 0.58, metal);
    cylinder("bicycle-crank", -width * 0.02, 0.48, 0, tireRadius * 0.14, tireRadius * 0.14, depth * 0.12, metal, { rotationX: Math.PI / 2, radialSegments: 12 });
    return;
  }

  if (type === "scooter") {
    const tireRadius = Math.min(0.18, width * 0.11, depth * 0.34);
    cylinder("scooter-front-tire", width * 0.36, tireRadius, 0, tireRadius, tireRadius, depth * 0.14, rubber, { rotationX: Math.PI / 2, radialSegments: 24 });
    cylinder("scooter-back-tire", -width * 0.36, tireRadius, 0, tireRadius, tireRadius, depth * 0.14, rubber, { rotationX: Math.PI / 2, radialSegments: 24 });
    cylinder("scooter-front-hub", width * 0.36, tireRadius, 0, tireRadius * 0.4, tireRadius * 0.4, depth * 0.16, metal, { rotationX: Math.PI / 2, radialSegments: 14 });
    cylinder("scooter-back-hub", -width * 0.36, tireRadius, 0, tireRadius * 0.4, tireRadius * 0.4, depth * 0.16, metal, { rotationX: Math.PI / 2, radialSegments: 14 });
    box("scooter-deck", 0, 0.34, 0, width * 0.78, 0.1, depth * 0.34, primary);
    box("scooter-body-cover", -width * 0.08, 0.52, 0, width * 0.38, 0.22, depth * 0.42, primary);
    box("scooter-stem", width * 0.34, 0.72, 0, 0.055, 0.8, 0.055, metal, { rotationZ: -0.18 });
    box("scooter-front-panel", width * 0.42, 0.78, 0, 0.14, 0.38, depth * 0.42, primary, { rotationZ: -0.08 });
    box("scooter-handlebar", width * 0.28, 1.08, 0, 0.08, 0.06, depth * 0.75, metal);
    box("scooter-seat", -width * 0.12, 0.78, 0, width * 0.3, 0.08, depth * 0.42, dark);
    box("scooter-headlight", width * 0.48, 0.84, 0, 0.05, 0.08, depth * 0.18, light, { castShadow: false });
    return;
  }

  box("furniture-body", 0, preset.height / 2, 0, width, preset.height, depth, primary);
  box("furniture-handle", 0, preset.height * 0.55, depth / 2 + 0.02, width * 0.7, 0.04, 0.035, light);
}

function addFurnitureLegs(sourceId, cx, cz, width, depth, elevation, rotationY, legHeight, material, options = {}) {
  const legWidth = options.legWidth || 0.07;
  const sourceType = options.sourceType || "furniture-leg";
  const legOffsetX = Math.max(legWidth, width * 0.38);
  const legOffsetZ = Math.max(legWidth, depth * 0.34);
  [
    [-legOffsetX, -legOffsetZ],
    [legOffsetX, -legOffsetZ],
    [-legOffsetX, legOffsetZ],
    [legOffsetX, legOffsetZ]
  ].forEach(([dx, dz]) => {
    addFurnitureBox({
      sourceId,
      sourceType,
      cx,
      cz,
      elevation,
      rotationY,
      dx,
      centerY: legHeight / 2,
      dz,
      width: legWidth,
      height: legHeight,
      depth: legWidth,
      material
    });
  });
}

function addStairMesh(room, selected) {
  const name = `${room.name || ""} ${room.id || ""}`.toLowerCase();
  if (!name.includes("tangga") && !name.includes("stair") && !name.includes("tg")) return;
  if (room.skip3D) return;
  const elevation = getElevation(room);
  const totalRise = Math.max(2.6, Number(project.settings.wallHeight) || 3);
  const steps = Math.max(6, Math.min(14, Math.round(Math.max(room.width, room.height) * 1.5)));
  const stepRise = totalRise / steps;
  const runAlongY = room.height >= room.width;
  const stepWidth = Math.max(0.5, (runAlongY ? room.width : room.height) * 0.78);
  const stepDepth = Math.max(0.22, (runAlongY ? room.height : room.width) / steps);
  const startX = room.x + room.width / 2;
  const startZ = room.y + room.height / 2;
  const material = createStandardMaterial(selected ? "#fde047" : "#d97706", { roughness: 0.6 });
  for (let i = 0; i < steps; i += 1) {
    const stepHeight = stepRise * (i + 1);
    const offset = -((steps - 1) * stepDepth) / 2 + i * stepDepth;
    addBoxMesh({
      width: runAlongY ? stepWidth : stepDepth,
      height: stepHeight,
      depth: runAlongY ? stepDepth : stepWidth,
      x: runAlongY ? startX : startX + offset,
      y: elevation + stepHeight / 2,
      z: runAlongY ? startZ + offset : startZ,
      material,
      userData: { sourceId: room.id, sourceType: "stair-step" }
    });
  }

  if (render3DOptions.detail !== "detailed") return;
  const railMaterial = createStandardMaterial("#e2e8f0", { roughness: 0.5 });
  const railHeight = 0.85;
  if (runAlongY) {
    addBoxMesh({ width: 0.08, height: railHeight, depth: room.height, x: room.x + 0.18, y: elevation + railHeight / 2 + 0.7, z: startZ, material: railMaterial, userData: { sourceId: room.id, sourceType: "stair-rail" } });
    addBoxMesh({ width: 0.08, height: railHeight, depth: room.height, x: room.x + room.width - 0.18, y: elevation + railHeight / 2 + 0.7, z: startZ, material: railMaterial, userData: { sourceId: room.id, sourceType: "stair-rail" } });
  } else {
    addBoxMesh({ width: room.width, height: railHeight, depth: 0.08, x: startX, y: elevation + railHeight / 2 + 0.7, z: room.y + 0.18, material: railMaterial, userData: { sourceId: room.id, sourceType: "stair-rail" } });
    addBoxMesh({ width: room.width, height: railHeight, depth: 0.08, x: startX, y: elevation + railHeight / 2 + 0.7, z: room.y + room.height - 0.18, material: railMaterial, userData: { sourceId: room.id, sourceType: "stair-rail" } });
  }
}

function createGableRoofGeometry(width, depth, roofHeight, baseHeight) {
  const w = width / 2;
  const d = depth / 2;
  const top = baseHeight + roofHeight;
  let vertices;
  let indices;

  if (width >= depth) {
    vertices = new Float32Array([
      -w, baseHeight, -d,
       w, baseHeight, -d,
       w, baseHeight,  d,
      -w, baseHeight,  d,
      -w, top, 0,
       w, top, 0
    ]);
    indices = [
      0, 1, 5, 0, 5, 4,
      3, 2, 5, 3, 5, 4,
      0, 3, 4,
      1, 2, 5,
      0, 2, 1, 0, 3, 2
    ];
  } else {
    vertices = new Float32Array([
      -w, baseHeight, -d,
       w, baseHeight, -d,
       w, baseHeight,  d,
      -w, baseHeight,  d,
       0, top, -d,
       0, top,  d
    ]);
    indices = [
      0, 3, 5, 0, 5, 4,
      1, 2, 5, 1, 5, 4,
      0, 1, 4,
      3, 2, 5,
      0, 2, 1, 0, 3, 2
    ];
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function clearGroup(group) {
  while (group.children.length) {
    const child = group.children.pop();
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
      else child.material.dispose();
    }
  }
}

function getMaxWallHeight() {
  if (!project.walls.length) return Number(project.settings.wallHeight) || 3;
  return Math.max(...project.walls.map((wall) => Number(wall.height) || project.settings.wallHeight));
}

function newProject() {
  if (!window.confirm("Reset the current project? Unsaved changes will be lost.")) return;
  project = createEmptyProject();
  selectedRef = null;
  history = [];
  historyIndex = -1;
  pushHistory();
  resetView();
  updatePropertiesPanel();
  render2D();
  generate3DFromProject();
  setStatusMessage("New project created");
}

function saveProject() {
  try {
    project.meta.updatedAt = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    setStatusMessage("Project saved to localStorage");
  } catch (error) {
    window.alert(`Save failed: ${error.message}`);
    setStatusMessage("Save failed");
  }
}

function loadProject() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.alert("No saved project found in localStorage.");
      setStatusMessage("No localStorage project found");
      return;
    }
    const parsed = JSON.parse(raw);
    project = normalizeProject(parsed);
    selectedRef = null;
    history = [];
    historyIndex = -1;
    pushHistory();
    updatePropertiesPanel();
    render2D();
    generate3DFromProject();
    frameCameraToProject();
    fitBlueprintToScreen();
    setStatusMessage("Project loaded from localStorage");
  } catch (error) {
    window.alert(`Load failed: ${error.message}`);
    setStatusMessage("Load failed");
  }
}

function exportJSON() {
  project.meta.updatedAt = new Date().toISOString();
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, `${safeFileName(project.meta.name)}.json`);
  setStatusMessage("Project JSON exported");
}

function importJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    setStatusMessage("Import cancelled");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      validateProject(parsed);
      project = normalizeProject(parsed);
      selectedRef = null;
      history = [];
      historyIndex = -1;
      pushHistory();
      updatePropertiesPanel();
      render2D();
      generate3DFromProject();
      frameCameraToProject();
      fitBlueprintToScreen();
      setStatusMessage("Project JSON imported");
    } catch (error) {
      window.alert(`Invalid JSON import: ${error.message}`);
      setStatusMessage("Import failed");
    } finally {
      dom.jsonFileInput.value = "";
    }
  };
  reader.onerror = () => {
    window.alert("FileReader failed to read the selected file.");
    dom.jsonFileInput.value = "";
    setStatusMessage("Import failed");
  };
  reader.readAsText(file);
}

function exportBlueprintPNG() {
  render2D();
  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (!blob) {
        window.alert("Blueprint export failed.");
        return;
      }
      downloadBlob(blob, `${safeFileName(project.meta.name)}-blueprint.png`);
      setStatusMessage("Blueprint PNG exported");
    }, "image/png");
  } else {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${safeFileName(project.meta.name)}-blueprint.png`;
    link.click();
    setStatusMessage("Blueprint PNG exported");
  }
}

function export3DScreenshot() {
  if (!renderer) {
    window.alert("3D renderer is not available.");
    return;
  }
  render3D();
  renderer.domElement.toBlob((blob) => {
    if (!blob) {
      window.alert("3D screenshot export failed.");
      return;
    }
    downloadBlob(blob, `${safeFileName(project.meta.name)}-3d.png`);
    setStatusMessage("3D screenshot exported");
  }, "image/png");
}

function pushHistory() {
  if (suppressHistory) return;
  project.meta.updatedAt = new Date().toISOString();
  const snapshot = JSON.stringify(project);
  if (history[historyIndex] === snapshot) return;
  history = history.slice(0, historyIndex + 1);
  history.push(snapshot);
  if (history.length > HISTORY_LIMIT) history.shift();
  historyIndex = history.length - 1;
}

function undo() {
  if (historyIndex <= 0) {
    setStatusMessage("Nothing to undo");
    return;
  }
  historyIndex -= 1;
  restoreHistorySnapshot();
  setStatusMessage("Undo");
}

function redo() {
  if (historyIndex >= history.length - 1) {
    setStatusMessage("Nothing to redo");
    return;
  }
  historyIndex += 1;
  restoreHistorySnapshot();
  setStatusMessage("Redo");
}

function restoreHistorySnapshot() {
  suppressHistory = true;
  project = normalizeProject(JSON.parse(history[historyIndex]));
  selectedRef = null;
  updatePropertiesPanel();
  render2D();
  generate3DFromProject();
  updateStatus();
  suppressHistory = false;
}

function validateProject(candidate) {
  if (!candidate || typeof candidate !== "object") throw new Error("Project root must be an object.");
  if (!candidate.meta || typeof candidate.meta !== "object") throw new Error("Missing meta object.");
  if (!candidate.settings || typeof candidate.settings !== "object") throw new Error("Missing settings object.");
  Object.values(COLLECTIONS).forEach((collection) => {
    if (!Array.isArray(candidate[collection])) throw new Error(`Missing array: ${collection}.`);
  });
  const ids = [];
  Object.values(COLLECTIONS).forEach((collection) => {
    candidate[collection].forEach((object) => {
      if (!object.id) throw new Error(`Object in ${collection} is missing id.`);
      ids.push(object.id);
    });
  });
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate object ids are not allowed.");
}

function normalizeProject(input) {
  validateProject({
    ...input,
    meta: input.meta || {},
    settings: input.settings || {},
    walls: input.walls || [],
    rooms: input.rooms || [],
    doors: input.doors || [],
    windows: input.windows || [],
    floors: input.floors || [],
    roofs: input.roofs || [],
    furniture: input.furniture || [],
    dimensions: input.dimensions || [],
    labels: input.labels || []
  });

  const now = new Date().toISOString();
  return {
    meta: {
      name: input.meta.name || DEFAULT_PROJECT_NAME,
      version: input.meta.version || "1.0.0",
      units: "meters",
      createdAt: input.meta.createdAt || now,
      updatedAt: input.meta.updatedAt || now
    },
    settings: { ...DEFAULT_SETTINGS, ...input.settings },
    walls: input.walls || [],
    rooms: input.rooms || [],
    doors: input.doors || [],
    windows: input.windows || [],
    floors: input.floors || [],
    roofs: input.roofs || [],
    furniture: input.furniture || [],
    dimensions: input.dimensions || [],
    labels: input.labels || []
  };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function screenToWorld(screenX, screenY) {
  return {
    x: (screenX - view.offsetX) / view.scale,
    y: (screenY - view.offsetY) / view.scale
  };
}

function worldToScreen(worldX, worldY) {
  return {
    x: worldX * view.scale + view.offsetX,
    y: worldY * view.scale + view.offsetY
  };
}

function snapPoint(point) {
  if (!project.settings.snapEnabled) return { x: point.x, y: point.y };
  const grid = Math.max(0.01, Number(project.settings.metersPerGrid) || DEFAULT_SETTINGS.metersPerGrid);
  return {
    x: Math.round(point.x / grid) * grid,
    y: Math.round(point.y / grid) * grid
  };
}

function getNearestWall(x, y, maxDistance) {
  let best = null;
  project.walls.forEach((wall) => {
    const projection = projectPointOnSegment(x, y, wall.x1, wall.y1, wall.x2, wall.y2);
    if (projection.distance <= maxDistance && (!best || projection.distance < best.distance)) {
      best = { wall, ratio: projection.ratio, distance: projection.distance, point: { x: projection.x, y: projection.y } };
    }
  });
  return best;
}

function getWallPointAtRatio(wall, ratio) {
  const t = clamp(Number(ratio) || 0, 0, 1);
  return {
    x: wall.x1 + (wall.x2 - wall.x1) * t,
    y: wall.y1 + (wall.y2 - wall.y1) * t
  };
}

function getWallLength(wall) {
  return Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1);
}

function getRatioOnWall(wall, x, y) {
  return projectPointOnSegment(x, y, wall.x1, wall.y1, wall.x2, wall.y2).ratio;
}

function metersToPixels(meters) {
  return Number(meters) * pixelsPerMeter();
}

function pixelsToMeters(pixels) {
  return Number(pixels) / pixelsPerMeter();
}

function pixelsPerMeter() {
  const metersPerGrid = Math.max(0.01, Number(project.settings.metersPerGrid) || DEFAULT_SETTINGS.metersPerGrid);
  const gridSize = Math.max(1, Number(project.settings.gridSize) || DEFAULT_SETTINGS.gridSize);
  return gridSize / metersPerGrid;
}

function getObjectAt(point) {
  const hitPriority = {
    label: 100,
    dimension: 95,
    door: 90,
    window: 90,
    furniture: 80,
    wall: 75,
    room: 65,
    roof: 35,
    floor: 25
  };
  const candidates = [];
  Object.entries({
    label: project.labels,
    dimension: project.dimensions,
    door: project.doors,
    window: project.windows,
    furniture: project.furniture,
    wall: project.walls,
    room: project.rooms,
    roof: project.roofs,
    floor: project.floors
  }).forEach(([type, list]) => {
    list.forEach((object, index) => {
      if (!hitTest(type, object, point)) return;
      candidates.push({
        type,
        id: object.id,
        priority: hitPriority[type] || 0,
        area: getObjectHitArea(type, object),
        index
      });
    });
  });

  candidates.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (a.area !== b.area) return a.area - b.area;
    return b.index - a.index;
  });
  return candidates[0] ? { type: candidates[0].type, id: candidates[0].id } : null;
}

function hitTest(type, object, point) {
  if (type === "wall") {
    const thickness = Math.max(8 / view.scale, (Number(object.thickness) || project.settings.wallThickness) / 2 + 6 / view.scale);
    return distanceToSegment(point.x, point.y, object.x1, object.y1, object.x2, object.y2) <= thickness;
  }
  if (type === "door" || type === "window") {
    const wall = getObjectById("wall", object.wallId);
    if (!wall) return false;
    const p = getWallPointAtRatio(wall, object.ratio);
    const radius = (Number(object.width) || 1) / 2 + 10 / view.scale;
    return Math.hypot(point.x - p.x, point.y - p.y) <= radius;
  }
  if (type === "dimension") {
    return distanceToSegment(point.x, point.y, object.x1, object.y1, object.x2, object.y2) <= 8 / view.scale;
  }
  if (type === "label") {
    const box = measureLabel(object);
    return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
  }
  if ("x" in object && "y" in object && "width" in object && "height" in object) {
    return point.x >= object.x && point.x <= object.x + object.width && point.y >= object.y && point.y <= object.y + object.height;
  }
  return false;
}

function getObjectHitArea(type, object) {
  if (type === "door" || type === "window") return Math.max(0.01, Number(object.width) || 1);
  if (type === "wall" || type === "dimension") {
    const length = Math.hypot((object.x2 || 0) - (object.x1 || 0), (object.y2 || 0) - (object.y1 || 0));
    return Math.max(0.01, length);
  }
  if (type === "label") {
    const box = measureLabel(object);
    return Math.max(0.01, box.width * box.height);
  }
  if ("width" in object && "height" in object) return Math.max(0.01, Math.abs(object.width * object.height));
  return 1;
}

function getObjectById(type, id) {
  const collection = COLLECTIONS[type];
  if (!collection) return null;
  return project[collection].find((object) => object.id === id) || null;
}

function getSelectedObject() {
  if (!selectedRef) return null;
  return getObjectById(selectedRef.type, selectedRef.id);
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function projectPointOnSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  const ratio = lengthSq === 0 ? 0 : clamp(((px - x1) * dx + (py - y1) * dy) / lengthSq, 0, 1);
  const x = x1 + dx * ratio;
  const y = y1 + dy * ratio;
  return { x, y, ratio, distance: Math.hypot(px - x, py - y) };
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  return projectPointOnSegment(px, py, x1, y1, x2, y2).distance;
}

function constrainAxis(start, current) {
  const dx = current.x - start.x;
  const dy = current.y - start.y;
  if (Math.abs(dx) >= Math.abs(dy)) return { x: current.x, y: start.y };
  return { x: start.x, y: current.y };
}

function getProjectBounds() {
  const points = [];
  project.walls.forEach((wall) => points.push([wall.x1, wall.y1], [wall.x2, wall.y2]));
  [...project.rooms, ...project.floors, ...project.roofs, ...project.furniture].forEach((object) => {
    points.push([object.x, object.y], [object.x + object.width, object.y + object.height]);
  });
  project.dimensions.forEach((dimension) => points.push([dimension.x1, dimension.y1], [dimension.x2, dimension.y2]));
  project.labels.forEach((label) => points.push([label.x, label.y]));
  if (!points.length) return null;
  return points.reduce((bounds, [x, y]) => ({
    minX: Math.min(bounds.minX, x),
    minY: Math.min(bounds.minY, y),
    maxX: Math.max(bounds.maxX, x),
    maxY: Math.max(bounds.maxY, y)
  }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
}

function getProjectVerticalBounds() {
  let minY = 0;
  let maxY = 1;
  project.walls.forEach((wall) => {
    const elevation = getElevation(wall);
    minY = Math.min(minY, elevation);
    maxY = Math.max(maxY, elevation + (Number(wall.height) || project.settings.wallHeight || 3));
  });
  project.floors.forEach((floor) => {
    const elevation = getElevation(floor);
    minY = Math.min(minY, elevation);
    maxY = Math.max(maxY, elevation + 0.12);
  });
  project.rooms.forEach((room) => {
    if (room.skip3D) return;
    const elevation = getElevation(room);
    minY = Math.min(minY, elevation);
    maxY = Math.max(maxY, elevation + 0.08);
  });
  project.roofs.forEach((roof) => {
    const elevation = getElevation(roof);
    minY = Math.min(minY, elevation);
    maxY = Math.max(maxY, elevation + (Number(roof.roofHeight) || 0.5));
  });
  project.furniture.forEach((item) => {
    const elevation = getElevation(item);
    const preset = getFurniturePreset(item.furnitureType);
    minY = Math.min(minY, elevation);
    maxY = Math.max(maxY, elevation + preset.height);
  });
  return { minY, maxY };
}

function pixelPointTo3D(x, y) {
  return {
    x,
    z: y
  };
}

function getElevation(object, fallbackObject) {
  if (object && Number.isFinite(Number(object.elevation))) return Number(object.elevation);
  if (fallbackObject && Number.isFinite(Number(fallbackObject.elevation))) return Number(fallbackObject.elevation);
  return 0;
}

function getRectAreaMeters(width, height) {
  return Math.abs(width * height);
}

function normalizeRect(x1, y1, x2, y2) {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1)
  };
}

function measureLabel(label) {
  const text = label.text || "Label";
  const width = Math.max(30, text.length * (label.fontSize || 16) * 0.58) / view.scale;
  const height = ((label.fontSize || 16) * 1.25) / view.scale;
  return {
    x: label.x,
    y: label.y - height,
    width,
    height
  };
}

function createId(prefix) {
  let id;
  do {
    id = `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  } while (objectIdExists(id));
  return id;
}

function objectIdExists(id) {
  return Object.values(COLLECTIONS).some((collection) => project[collection].some((object) => object.id === id));
}

function updateStatus() {
  dom.statusTool.textContent = TOOL_LABELS[currentTool] || currentTool;
  dom.statusMouse.textContent = `${roundNumber(pointerWorld.x, 2)} m, ${roundNumber(pointerWorld.y, 2)} m`;
  dom.statusZoom.textContent = `${Math.round((view.scale / pixelsPerMeter()) * 100)}%`;
  dom.statusGrid.textContent = `${project.settings.metersPerGrid} m`;
  dom.statusSnap.textContent = project.settings.snapEnabled ? "On" : "Off";
  dom.statusSelected.textContent = selectedRef ? `${selectedRef.type}:${selectedRef.id}` : "None";
  dom.snapButton.textContent = project.settings.snapEnabled ? "Snap On" : "Snap Off";
  dom.statusMessage.textContent = lastStatusMessage;
}

function setStatusMessage(message) {
  lastStatusMessage = message;
  if (dom.statusMessage) dom.statusMessage.textContent = message;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundNumber(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
}

function degToRad(degrees) {
  return (Number(degrees) || 0) * Math.PI / 180;
}

function normalizeRotation(degrees) {
  const normalized = ((Number(degrees) || 0) % 360 + 360) % 360;
  return roundNumber(normalized, 2);
}

function snapOrientation(degrees) {
  return Math.round(normalizeRotation(degrees) / 90) * 90 % 360;
}

function withAlpha(hex, alpha) {
  const normalized = String(hex || "#ffffff").replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized.padEnd(6, "f").slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function safeFileName(name) {
  return String(name || DEFAULT_PROJECT_NAME).toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "house-blueprint";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
