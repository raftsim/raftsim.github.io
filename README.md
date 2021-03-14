# [raftsim.github.io](https://raftsim.github.io)

[Resource Area for Teaching (RAFT)](https://raft.net) is a nonprofit organization that ships STEAM kits to thousands of classrooms around the US to supplement educational instruction in those fields. Raftsim is an open source project designed to either complement or replace these physical kits, which is especially useful during virtual classes. It is hosted through GitHub Pages and uses 3D models (created with CAD software) animated by the JavaScript library [three.js](https://threejs.org). The simulations work with both desktop and mobile browsers, with added support as iOS web apps.

## Instructions on Creating New Simulations

### 1. Create a CAD model of each individual part in the kit
- Parts that don't move independently of each other (like the popsicle sticks from Zippy Catapult) can be made into an assembly, since it is easier to position fixed objects in CAD than using JS.
- We used Autodesk Fusion 360 and OnShape to create our CAD designs. Both are free for students but expensive otherwise, so they may not be great options. The important thing to keep in mind when choosing a CAD software is exporting to a text-based file format, which can either be `.obj` or `.stl`. Fusion 360 includes obj files as an export option, while OnShape has stl files.
- Maintaining consistent units is important to ensure parts actually scale properly with each other.
- You have to make sure the origin point of each part or assembly is where you want it to be, or you won't be able to properly control the positioning of each part through code

Completed Zippy Catapult CAD in Autodesk Fusion 360:
![](/storage/instructions/cad-assembly.png)
*Tube & popsicle sticks assembly: joints & constraints used to fix position*
![](/storage/instructions/cad-spoon.png)
*Spoon object*
![](/storage/instructions/cad-straw.png)
*Straw object*
![](/storage/instructions/cad-ball.png)
*Ball assembly: used to center ball object at origin*

### 2. Export the models to a text-based file format
- As stated previously, `.obj` and `.stl` are the two options supported by existing code. [three.js](https://threejs.org), the graphics library used in this project, includes support for other 3D model text files, but those have not been incorporated into existing template code. If asked for desired units in the export, select the units that were used when creating the model itself.

![](/storage/instructions/cad-export.png)
*.obj export screen in Fusion 360*

**Before continuing to the coding section, you will need the following software tools:**
- Access to command line (ex. Terminal, bash)
- [Git](https://git-scm.com)
- A [GitHub](https://github.com) account with access to the [raftsim.github.io](https://github.com/raftsim/raftsim.github.io) or other intended repository
- A Git client if desired
	- Useful if your knowledge/experience with Git's command line interface is limited
	- We use [Sourcetree](https://sourcetreeapp.com)
- A code editor or web development-focused IDE
	- We use [Visual Studio Code](https://code.visualstudio.com)

### 3. Clone the raftsim.github.io repository to a local computer
- Instructions for the command line and GitHub Desktop can be found [here](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).
- Choosing between command line, GitHub Desktop, or some other Git client is entirely up to the user, however, some knowledge of the command line is recommended if you choose that option.
	- If you wish to use a Git client, look up instructions for cloning repositories with that client.
	- Instructions for Sourcetree [here](https://confluence.atlassian.com/sourcetreekb/clone-a-repository-into-sourcetree-780870050.html)
- Once cloned, create a branch for the simulation you are working on (or checkout an existing branch).
	- Instructions to do either of these via the command line can be found [here](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging).
	- Instructions for GitHub Desktop [here](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/managing-branches)
	- Instructions for Sourcetree [here](https://confluence.atlassian.com/sourcetreekb/branch-management-785325799.html)
- The branch name should be the kit's name in all lowercase with no special characters and dashes (`-`) instead of spaces.
	- Ex: `zippy-catapult`, `leonardos-bridge`

### 4. If a kit folder does not already exist, create one
- More specifically, duplicate the `template-obj` or `template-stl` folder (depending on what type of model file you have) and rename the new folder the same as the branch.
- This folder name will also be the url where the kit can be accessed (ex. `raftsim.github.io/zippy-catapult`)
- Inside this kit folder, create an `objects` folder (if it doesn't already exist) and move the `.obj` or `.stl` files you exported into this new folder. Use a uniform style/convention to name all the model files.
	- Ex. all file names could use the same naming convention as the folders and branches: `magnet-north.stl`, `magnet-south.stl`

![](/storage/instructions/folder.png)
*Contents of `zippy-catapult` folder*

### 5. Modify `index.html`
*Any references to `index.html`, unless specifically mentioned otherwise, refer to the html file within the kit folder.*

#### a. On line 5, change "Template" to the actual name of the kit (with normal English formatting).
- Ex. `Zippy Catapult`
- Final `head` example:
    
```html
<head>
    <title>Template | raft Kit Simulations</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <link rel="shortcut icon" href="/storage/favicon.ico" type="image/x-icon">
</head>
```

#### b. Rewrite the inputs (initially on lines 17-18)
- Add more inputs if necessary by duplicating the entire line, from the description text to the end of the `input` tag
- Set the `value` key equal to the initial of the input
- Set a unique `id` key for each input tag
- Final inputs example (lines 17-20):

```html
Height of straws (in): <input type="number" value=0 id="strawLength"><br>
Angle of spoon (degrees): <input type="number" value=0 id="spoonAngle"><br>
Starting speed of ball (d/t): <input type="number" value=0 id="velocity"><br>
Gravity (g): <input type="number" value=50 id="gravity"><br>
```

#### c. Rewrite the output (initially on line 27)
- Change "Example Output" to a descriptor for the output (Ex. "Distance")
- The nested `span` tag with `id="output"` will be modified whenever the simulation has an output. Add a space and units for this output between the two closing `</span>` tags
- By default, the entire `span` tag with the `id="output-text"` key is hidden, but can be made visible as necessary through code
- Final output example:
    
```html
<span id="output-text">Distance: <span id="output">123.45</span> (in)</span>
```

![](/storage/instructions/index.png)
*Changes made to the `index.html` file for Zippy Catapult*

### 6. Modify `app.js`
- This is where the bulk of the code logic will go.
- For help using the three.js library, consult the [documentation](https://threejs.org/docs/) and [examples](https://threejs.org/examples/).

#### a. Update variables
1. Add a variable for every 3D object needed.

    ```js
    var assembly, ball, spoon, straw1, straw2;
    ```

2. Add a variable for each input in `index.html`.

    ```js
    var strawLength, spoonAngle, velocity, gravity;
    ```

3. Add minimum and maximum variables for each input (as necessary)

    ```js
    let strawLengthMin = 0;
    let strawLengthMax = 2.834;

    let spoonAngleMin = Math.PI * 0.04;
    let spoonAngleMax = Math.PI * 0.5;
    ```

4. Add a variable to reference each `<input>` html tag (used to get input values)

    ```js
    let strawLengthInput = document.getElementById("strawLength");
    let spoonAngleInput = document.getElementById("spoonAngle");
    let velocityInput = document.getElementById("velocity");
    let gravityInput = document.getElementById("gravity");
    ```

#### b. Update `init()` function
1. Below the onError() function (not inside it), replace the example code and add object imports into the curly braces corresponding to 3D object variables created in step a.

    ```js
    {
        var loader = new OBJLoader(manager);

        loader.load('objects/assembly.obj', function (obj) {
            assembly = obj;
        }, onProgress, onError);

        loader.load('objects/spoon.obj', function (obj) {
            spoon = obj;
        }, onProgress, onError);

        loader.load('objects/straw.obj', function (obj) {
            straw1 = obj;
        }, onProgress, onError);

        loader.load('objects/straw.obj', function (obj) {
            straw2 = obj;
        }, onProgress, onError);

        loader.load('objects/ball.obj', function (obj) {
            ball = obj;
        }, onProgress, onError);
    }
    ```

2. A few methods up, update the loadModel() function for all the object variables

    ```js
    function loadModel() {

        scene.add(assembly);
        scene.add(ball);
        scene.add(spoon);
        scene.add(straw1);
        scene.add(straw2);

    }
    ```

#### c. Update `submitInputs()` and `sendValues()` functions
1. Replace the existing input code with one line for each input variable/html tag.
    - Use the `clip()` method to restrict a value within the min and max values
    - If a certain variable has no min **or** no max, use `null` instead of that boundary
    - If the variable has neither min nor max, use `Number()` to cast it as a number (by default, html forms return strings).
    
    ```js
    function submitInputs() {
        document.getElementById("output-text").style.visibility = "hidden";

        strawLength = clip(strawLengthInput.value, strawMin, strawMax);
        spoonAngle = clip(spoonAngleInput.value * Math.PI / 180, spoonAngleMin, spoonAngleMax);

        velocity = Number(velocityInput.value);
        gravity = Number(gravityInput.value);

        sendValues();
    }
    ```

2. In `sendValues()`, replace the example code with a line for each input value that was clipped in `submitInputs()` to return the bounded values (so the user is accurately informed about the inputs that the simulation uses)

    ```js
    function sendValues() {
        strawLengthInput.value = Math.round(strawLength * 100) / 100;
        spoonAngleInput.value = Math.round(spoonAngle / Math.PI * 180 * 100) / 100;
    }
    ```

#### d. Before continuing, open `index.html` in a browser to check for any bugs.
- If using Visual Studio Code, the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension can be used to create a live preview that updates every time any file is changed and saved.

![](/storage/instructions/live.png)

*"Go Live" at the bottom right footer bar starts a Live Preview of the current html file in Visual Studio Code.*

- The page should show all the inputs and show the loaded 3D models at the center of the screen. If any are missing, check the console for errors to debug.

![](/storage/instructions/preview.png)

*All the ZIppy Catapult objects loaded into three.js*

#### e. Update starting positions
In `loadModel()` (in `init()`), after each model is added to `scene`, set its starting position and rotation using `[object].position.x/y/z` and `[object].rotation.x/y/z` like so:

```js
function loadModel() {

    scene.add(assembly);

    scene.add(ball);
    ball.position.x = -0.07;
    ball.position.y = spoon.position.y;
    ball.position.z = spoon.position.z;

    scene.add(spoon);
    spoon.rotation.y = -Math.PI / 2;
    spoon.rotation.z = -Math.PI / 2;

    scene.add(straw1);
    straw1.position.x = 3.12;
    straw1.rotation.z = Math.PI / 2;

    scene.add(straw2);
    straw2.position.x = -straw1.position.x;
    straw2.rotation.z = straw1.rotation.z;
}
```

The position values are along the given axis and the rotation values are in radians about the given axis (relative to the object). It is also recommended to update the initial camera position as necessary by adjusting the camera's x, y, and z positions. The camera does not need to be rotated, as it will always point toward the coordinates given by the `targetPos` object (a `THREE.Vector3` that stores x, y, and z coordinates and is set to the origin by default).

```js
camera.position.z = 20;
camera.position.y = 2;
```

#### f. Update `render()` function
- Three.js begins the animation loop by running `animate()`, which repeatedly calls `render()`, where most of the simulation's logic is based.
- By default, `render()` contains two TODOs, "Change camera target here" and "change object positions, rotations, states, etc here".
    - Replace the first TODO with any code to adjust the camera's focusing point.
        - For example, when Zippy Catapult launches its ball, the camera target is exactly halfway between the origin, where the catapult is, and the ball's current position.
            ```js
            if (ball != null) {
                targetPos.z = (scene.position.z + ball.position.z) / 2;
            }
            ```
    - Replace the second TODO with the simulation's actual logic. This is where inputs are used to set outputs and change the positions and rotations of the objects on screen. If additional variables are needed (like in Zippy Catapult), create them near the top of the code file under the existing variables, and if additional three.js modules are needed, import them from [unpkg.com](https://unpkg.com/three) using the directory structure from three.js' [GitHub repository](https://github.com/mrdoob/three.js).

#### g. Update `submitInputs()` (pt. 2)
- `submitInputs()` runs every time the "Start" button is clicked. Code to reset the simulation to its initial state should go here, as should any other code needed to reset the values of additional variables.

### 7. Test the code you have written and iron out bugs.
- No code is perfect on its first iteration, and these simulations need to be easily accessible to all.
- After writing the first draft of the code, debug it and work to improve performance toward an optimal revision.

### 8. Throughout the process of writing code, commit and push your changes to GitHub to maintain a log of the changes you make.
- Further instructions available [here](https://docs.github.com/en/github/committing-changes-to-your-project).

### 9. After finishing a kit, you must submit a pull request through GitHub.com (see [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests)).
- This pull request must be reviewed by at least one other person with write access to the repository before it can be merged into the `main` branch.
- If there are issues with the merge, a merge conflict will arise (instructions for resolving a conflict are [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/addressing-merge-conflicts).

### 10. If there are no issues (or after the issues are fixed and resolved), you can merge the pull request after an approving review and the new code will be updated and available at the `raftsim.github.io` page momentarily.

## Congrats, you've successfully created a kit simulation!
