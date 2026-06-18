import Helpers from "./helpers.js";

// Modify the RSS Feed HTML element
export class ModifyRSSHTML {

    static FEED_CONTAINER_INNER_HTML = '<div html-ref="src/layout/rss-feed.html"></div>';

    static FULLSCREEN_CRUNCH_SIZE = 700;

    // ===== LOAD AND RELOAD FEED ===== //

    // Reload the window
    static reloadFeed(fullscreen) {
        console.log("Reload toggled");

        var container = document.getElementById("rss-feed-wrapper");
        container.innerHTML = ModifyRSSHTML.FEED_CONTAINER_INNER_HTML;
        self.mhtml.loadPage(null);
    }

    // ===== EXPAND/MINIMISE READER ===== //

    // Check if there is a fullscreen jquery parameter and then fullscreen if true
    static checkFullscreen() {
        const url = new URL(window.location.href);
        const fullscreen = (url.searchParams.get('fullscreen') === 'true');

        if (fullscreen) {
            ModifyRSSHTML.toggleFullscreen(fullscreen);
        }
    }

    // Toggle the expand and contract window functions
    static toggleFullscreen(toggleflag) {
        console.log("Fullscreen toggled");

        ModifyRSSHTML.expandOrContractFeedWindow(toggleflag);
        ModifyRSSHTML.hideAndUnhideToggleButtons(toggleflag);

        const url = new URL(window.location.href);
        url.searchParams.set('fullscreen', toggleflag);
        window.history.pushState(null, '', url.toString());
    }

    static expandOrContractFeedWindow(toggleflag) {
        var feedWindow = document.getElementById("rss-feed-wrapper");

        var elementsToHide =
            ["menu-wrapper", "ribbon-wrapper", "footer-wrapper", "sidebar"]
                .map((id) => document.getElementById(id));

        if (toggleflag) {
            elementsToHide.forEach((element) => {
                element.style.display = 'none';
            })

            feedWindow.style.position = 'fixed';
            feedWindow.style.top = '0';
            feedWindow.style.left = '0';

            feedWindow.style.width = '100vw';
            feedWindow.style.height = '100vh';

            self.mhtml.CRUNCH_SIZE = ModifyRSSHTML.FULLSCREEN_CRUNCH_SIZE;
            self.mhtml.crunch();
        } else {
            feedWindow.style.position = '';
            feedWindow.style.top = '';
            feedWindow.style.left = '';

            feedWindow.style.width = '';
            feedWindow.style.height = '';

            elementsToHide.forEach((element) => {
                element.style.display = '';
            })

            self.mhtml.CRUNCH_SIZE = self.mhtml.DEFAULT_CRUNCH_SIZE;
            self.mhtml.crunch();
        }
    }

    static hideAndUnhideToggleButtons(toggleflag) {
        const toggle = (flag) => flag ? 'none' : 'inline';

        var min_buttons = document.getElementsByClassName("rss-feed-min");
        var max_buttons = document.getElementsByClassName("rss-feed-max");

        for (let i = 0; i < min_buttons.length; i++) {
            min_buttons[i].style.display = toggle(!toggleflag);
        }

        for (let i = 0; i < max_buttons.length; i++) {
            max_buttons[i].style.display = toggle(toggleflag);
        }
    }

}

// Singular object to get/set important data for the files in app to use
class ReaderState {

    // ===== READ OBJECTS AND DISMISSED OBJECTS ===== //

    readIDs = new Set([]);
    dismissedIDs = new Set([]);

    // ===== LOAD/SAVE DATA FROM COOKIES ===== //

    loadIDs() {

    }

    saveIDs() {

    }

    // ===== APPEND AND REMOVE DATA ===== //

    appendItem(uuid) {

    }

    removeItem(uuid) {

    }
}

export default ReaderState;