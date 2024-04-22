497 Chrome Extension
==

## Things to show off in demo
1. Record feature

2. Playback feature

3. Information tab (website opening in new tab)

4. Deleting of recordings

5. Help Tab

6. Record with no audio (play button doesn't appear)

7. Mention that it defaults to current website

## Todo

- [x] BUG - Fix audio not stopping when playing new audio

- [x] BUG - Make audio permanant

- [ ] BUG - visual, fix the spacing between recordings

- [x] BUG - make it so audio continues playing / recording even while the user clicks out of the extension to interact with the website.

- [x] BUG - clicking website link in info does not open - I think just need to add `target='_blank'` for it to open in new tab?

- [ ] FEAT - Import / Export via json. See [here](https://stackoverflow.com/a/8205461) and [here](https://github.com/Polarisation/indexeddb-export-import) though let's discuss before adding any packages

- [ ] FEAT - stretch goal, but add favicon from website a recording happened on to the left of the task name to improve recognition

- [ ] FEAT - do some basic CSS with the recording page so it looks nice

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/ayoung5555/497-Chrome-Extension.git
    ```

2. Open Google Chrome and go to the Extensions page by typing `chrome://extensions` in the address bar.

3. Enable Developer mode by toggling the switch in the top right corner.

4. Click on the "Load unpacked" button in the top left and select the cloned repository folder (`497-Chrome-Extension`).

5. The extension should now be loaded in developer mode and ready to use. 

## Usage

1. After installing the extension, you can use it by clicking on its icon in the Chrome toolbar. Right click and select pin to access it easier.

## Development

If you want to make changes to the extension's code and test them, follow these steps:

1. Open the cloned repository folder (`497-Chrome-Extension`) in your preferred code editor.

2. Make the necessary changes to the code and be sure to save. Most updates to rendering (HTML/CSS/JS) will update when the extension popup is re-rendered, but if not, continue following the steps below.

3. Go back to the Extensions page in Chrome (`chrome://extensions`).

4. Find the extension in the list and click on the "Reload" button (looks like a small arrow going in a circle) to apply the changes.

## Contributing

1. Please develop using a branch for your own work, ideally with a helpful title like (`ui-andrew`) or (`api-faizan`).

2. Submit a pull request before merging into main.


