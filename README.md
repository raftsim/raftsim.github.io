# [raftsim.github.io](https://raftsim.github.io)

## Instructions on Creating New Simulations

### 1. Create a CAD model of each individual part in the kit
- Parts that don't move independently of each other (like the popsicle sticks from Zippy Catapult) can be made into an assembly.
- we used Autodesk Fusion 360 and OnShape to create our CAD designs. Both are free for students but expensive otherwise, so they may not be great options. The important thing to keep in mind when choosing a CAD software is exporting to a text-based file format, which can either be `.obj` or `.stl`. Fusion360 includes obj files as an export option, while OnShape has stl files.
- Maintaining consistent units is important to ensure parts actually scale properly with each other.
- You have to make sure the origin point of each part or assembly is where you want it to be, or you won't be able to properly control the positioning of each part through code

### 2. Export the models to a text-based file format
- As stated previously, `.obj` and `.stl` are the two options supported by existing code. [three.js](https://threejs.org), the graphics library used in this project, includes support for other 3D model text files, but those have not been incorporated into existing template code.

*Before continuing, you must have a few different apps on your computer. You will need access to command line (like through Terminal), Git, a GitHub account with access to the repository, a Git client if so desired (like GitHub Desktop or SourceTree, the app we used). You will also need a code editor of some kind (we used Visual Studio Code).

### 3. Clone the raftsim.github.io repository to a local computer
- Instructions can be found [here](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).
- Choosing between command line, GitHub Desktop, or some other Git client is entirely up to the user, however, some knowledge of the command line is recommended before going that route.
- Once cloned, create a branch for the simulation you are working on (or checkout an existing branch). Instructions to do either of these via the command line can be found [here](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging).
- The branch name should be the kit's name in all lowercase with no special characters and dashes (`-`) instead of spaces.

### 4. If a kit folder does not already exist, create one
- More specifically, duplicate the `template-obj` or `template-stl` folder (depending on what type of model file you have) and rename the new folder the same as the branch.
- This folder name will also be the url where the kit can be accessed (like `raftsim.github.io/zippy-catapult`)
- Inside this kit folder, create an `objects` folder (if it doesn't already exist) and move the `.obj` or `.stl` files you exported into this new folder. Use a uniform style/convention to name all the model files.

*From this point on, the instructions become much more fluid and flexible, since every kit has different needs and has to be designed in a different way.*

### 5. Modify `index.html`
- On line 5, change "Template" to the actual name of the kit (with normal English formatting).
- From lines 17 onward, rewrite the inputs and outputs as necessary (depending on each kit)

### 6. Modify `app.js`
- This is where the bulk of the code logic will go. In the `init()` function, you must change the imports to reflect the models you will be using.
- You will also have to change the variables to reflect the inputs, outputs, models, and data used by the simulation.
- The `render()` and `submitInputs()` functions are where the bulk of the simulation's logic will be. You must rewrite these functions to suit your needs, as I cannot give you specific instructions on what your kit entails.

### 7. Test the code you have written and iron out bugs.
- No code is perfect on its first iteration, and these simulations need to be easily accessible to all.
- After writing the first draft of the code, debug it and work to improve performance toward an optimal revision.

### 8. Throughout the process of writing code, commit and push your changes to GitHub to maintain a log of your actions and thought process.
- Further instructions available [here](https://docs.github.com/en/github/committing-changes-to-your-project).

### 9. After finishing a kit, you must submit a pull request through GitHub.com (see [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests)).
- This pull request must be reviewed by at least one other person with access to the repository before it can be merged into the `main` branch.
- If there are issues with the merge, a merge conflict will arise (instructions for resolving a conflict are [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/addressing-merge-conflicts).

### 10. If there are no issues, you can merge the pull request (after an approving review) and the new code will be updated and available at the `raftsim.github.io` page momentarily.

## Congrats, you've successfully created a kit simulation!