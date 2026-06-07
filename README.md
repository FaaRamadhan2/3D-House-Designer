# House Blueprint 3D Designer

House Blueprint 3D Designer is a browser-based 2D blueprint editor with a generated 3D house preview. It lets you sketch walls, rooms, floors, roofs, doors, windows, furniture, dimensions, and labels, then inspect the result in a Three.js 3D scene.

## Features

- Draw and edit a 2D house blueprint on a grid-based canvas.
- Generate a live 3D preview from the blueprint.
- Add walls, rooms, floors, roofs, doors, windows, furniture, labels, and dimensions.
- Configure wall height, wall thickness, elevations, object colors, roof style, furniture type, and model detail.
- Switch between 2D, 3D, and split views.
- Save and load projects from browser localStorage.
- Export and import project JSON files.
- Export blueprint and 3D preview screenshots as PNG files.

## Running Locally

This project is a static web app. No build step is required.

1. Clone the repository.
2. Open `index.html` in a modern browser.

For best browser behavior around file downloads and WebGL assets, you can also serve the folder with any static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project Structure

```text
.
|-- index.html   # Application markup and controls
|-- script.js    # 2D editor logic, project data model, and Three.js rendering
|-- style.css    # Application layout and visual styling
|-- LICENSE      # GNU General Public License v3.0
`-- README.md
```

## Dependencies

The app loads these libraries from jsDelivr CDN:

- Three.js `0.128.0`
- Three.js OrbitControls `0.128.0`

## License

Copyright (C) 2026 FaaRamadhan2

This project is free software licensed under the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See [LICENSE](LICENSE) for the full license text.
