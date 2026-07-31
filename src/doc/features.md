# UI Features

Below is a comprehensive list of the available/unique features of this webpage application template. This section will focus exclusively on how to use these features within the webpage UI, i.e. in the HTML source files.

You can additionally inspect the source code of this webpage and the other linked websites to get a better idea of how to practically use these features.

## HTML Loading

HTML files can be loaded using the client-side XHTTP request. To load the contents of an HTML file, add a container `<div>` element with the attribute `html-ref` to the tag, setting it to the path of the HTML file _relative to the repository's top-level directory_. For example:

```html
<div html-ref="src/layout/rss-feed.htm" style="display: inline;"></div>
```

In `index.js` the window's `onload` event is set to call the function `Navigator.initPage` by default. You can optionally add other functions to this event listener. Avoid loading the page multiple times automatically.

## Page Navigation

Before setting up page navigation, make sure you have included in the `src/html` directory the content HTML file you wish to navigate to. As a naming convention, always name the HTML file as `[<section-category>-]<section name>.html`. Additionally, you should add an entry to the `SECTION_COLOR_DICT` declaration in `index.js`:

```javascript
["file name (without extension)", section_hue];
```

This will set the section's defined hue, which is important for the CSS to understand what colour scheme to use for the webpage. If you do not set a colour, then it will default to transparent background colours. The default section is listed as `home`, however you can change this by doing the above steps and then setting the `DEFAULT_SECTION` declaration in `index.js` to the desired default page. To navigate to a specific section, you _can_ simply add the `?s=[<section-category>-]<section name>` to the website's URL, however it is recommended you instead call the function `Navigator.goToSection` method.

To allow users to navigate using the ribbon/menu, you must add an extra HTML `<a>` tag to allow for navigation. The CSS provides functionality to group sections together under a category. Within the ribbon and menu, to add a category of sections, add the following:

```html
<div hidden class="dropdown" id="drop-wrapper-<section-category>">
	<div hidden class="dropdown-content" id="drop-<section-category>">Add links here.</div>
</div>

<a
	class="dropbtn"
	onclick="Navigator.showSubList('<section-category>');"
	onmouseleave="Navigator.hideSubList('<section-category>');"
>
	Documentation
</a>
```

> In src/layout/ribbon.html

```html
<span>Documentation</span>
<div class="sublist" id="docs-sublist">Add links here.</div>
```

> In src/layout/menu.html

## Styling

Defined in the document root in `style.css`, there are a series of standard colour values that are set to change with each section, according to the `SECTION_COLOR_DICT` constant in `index.js`. There are 9 non-greyscale colours, shown using a hue of 300˚:

<table style="empty-cells: hide;">
    <tr>
        <th colspan="2" rowspan="2" style="text-align: center">HSL(300, %S, %B)</th>
        <th colspan="3" style="text-align: center">Brightness</th>
    </tr>
    <tr>
        <th>Dark</th>
        <th>Mid</th>
        <th>Light</th>
    </tr>
    <tr>
        <th rowspan="4">Saturation</th>
        <th>Vibrant</th>
        <td style="background-color: hsl(300, 100%, 25%)">(100, 25)</td>
        <td style="background-color: hsl(300, 100%, 50%)">(100, 50)</td>
        <td style="background-color: hsl(300, 100%, 75%)">(100, 75)</td>
    </tr>
    <tr>
        <th>Mid</th>
        <td style="background-color: hsl(300, 50%, 25%)">(50, 25)</td>
        <td style="background-color: hsl(300, 50%, 50%)">(50, 50)</td>
        <td style="background-color: hsl(300, 50%, 75%)">(50, 75)</td>
    </tr>
    <tr>
        <th>Pale</th>
        <td style="background-color: hsl(300, 25%, 25%)">(25, 25)</td>
        <td style="background-color: hsl(300, 25%, 50%)">(25, 50)</td>
        <td style="background-color: hsl(300, 25%, 75%)">(25, 75)</td>
    </tr>
    <tr>
        <th>Greyscale</th>
        <td style="background-color: #333">(0, 20)</td>
        <td style="background-color: #666">(0, 40)</td>
        <td style="background-color: #999">(0, 60)</td>
    </tr>
</table>

Each variable is named according to the structure: `--<saturation name>-<brightness Name>-color`, where all values are in lower case; the greyscale values take the form: `--<brightness name>-gray`.

The CSS also contains the `--base-hue` variable.

There is an additional `--very-light-gray` with <span style="color: black; background-color: hsl(300, 0%, 80%)">80% brightness</span> for better contrast with grey backgrounds.

## Dynamic Span Elements

Below is a list of custom classes that will allow for span elements to update dynamically:

| Class Name | Parameters | Function | Example HTML Output |
|--|--|--|--|
| `sectionname` | N/A | Updates (beautified version of) current section's name | Documentation: Features |
| `current-date` | N/A | Shows today's current (local time) date | Wed Jun 24 2026 |
| `age` | `date`: {format: `yyyy-mm-dd`}; `showdate` | Displays the total amount of years elapsed since a given `date`, rounded down | 16 (1/2/2010) |

## Mobile Compatibility

The website is designed to be compatible with mobile devices. The main functionality being found with the `Cruncher` class. The class defines two events: `Cruncher.oncrunch` and `Cruncher.onrelax`. Additionally, `index.js` assigns the events to the window, as well as what to do when the even is triggered.

These two events are triggered when the window is resized to a width above (`onrelax`) or below (`oncrunch`) a constant `DEFAULT_CRUNCH_SIZE` set in `index.js`.

The default behaviour, as defined by the `Cruncher` class, is such that any element with the attribute `hide-oncrunch` will disappear on smaller screens and re-appear on larger screens, and vice versa for the `hide-onrelax` attribute.

## Markdown Embedding

Thanks to [`<zero-md>`](https://zerodevx.github.io/zero-md/), embedding markdown in HTML is very simple and is used throughout this website.

Please see the above link for more information on how to embed markdown.

## Footer Minigame

In the footer for the website there is a small idle/clicker game. There is a separate file designed to handle the game's functionality. Feel free to expand on the game or use it as an example of custom functionality.

## Cookies and JQuery

The `Storer` class packages functionality for storing user data related to the webpage that stays after reloading. This comes in the form of both URL search parameter storage and cookie storage.

## RSS Feeds

<b style="color: red;">WARNING</b>**:** The RSS feeds are still a work in progress. This section may be subject to change based on how the end product works.

For how to use the feed with an end-user perspective, see the [README](https://github.com/oliviax727/RSS-ohrw/blob/main/README.md#how-to-use-the-newsreader) for the RSS feed repository.

To set up the RSS feed, first add a new entry to `src/data/newsreader.json`:

```json
"RSS feed name" : {
    "News site name": "Link to RSS feed",
    //... add as many entries as you would like
}
```

Then, in the HTML end simply requires adding the following element:

```html
<div id="rss-feed-wrapper" data-xml-id="">
    <div html-ref="src/layout/rss-feed.htm"></div>
</div>
```

And then set the `data-xml-id` parameter to the name of the RSS feed. From there, the RSS feed should display a combined list of articles from the various RSS feeds you specified in `src/data/newsreader.json`. This list is ordered according to the date of publication.

Otherwise, you can use the attribute `set-xml-id` to set the `data-xml-id` field to whatever the name of the current section is.

$/LaTeX$
