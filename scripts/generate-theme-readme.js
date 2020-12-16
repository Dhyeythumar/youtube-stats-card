const theme = require("../themes/index");
const fs = require("fs");

// :: TODO ::
// Is it required to add examples related to video stats card with all the color themes similar to channel stats card examples shown in themes>readme.md file?

const TARGET_FILE = "./themes/README.md";
const CHANNEL_CARD_LINKS_FLAG = "<!-- CHANNEL_CARD_LINKS -->";
const CHANNEL_CARD_TABLE_FLAG = "<!-- CHANNEL_CARD_TABLE -->";

const THEME_TEMPLATE = `
## Available Themes

<!-- Do not edit this file directly.
It is automatically populated by the generate-theme-readme.js file. -->

With inbuilt themes, you can customize the look of the card without doing any manual customization of colors.

Use \`&theme=THEME_NAME\` parameter like so:

\`\`\`md
![Youtube channel stats](https://youtube-stats-card.vercel.app/api?channelid=UCpKizIKSk8ga_LCI3e3GUig&theme=dark_pink)
\`\`\`

## Themes

> **Note**
>
> - **Here the themes are only applied to Channel Stats Card with the default layout.**
> - **All these themes work for both the Channel Stats Card and Video Stats Card.**
> - **And also works for all the different layouts available for Channel Stats Card and Video Stats Card.**


| | | |
| :--: | :--: | :--: |
${CHANNEL_CARD_TABLE_FLAG}


${CHANNEL_CARD_LINKS_FLAG}

[add-theme]: https://github.com/Dhyeythumar/youtube-stats-card/edit/main/themes/index.js

Wanted to add a new theme? Consider reading the [contribution guidelines](../CONTRIBUTING.md#themes-contribution)
`;

const createChannelLink = (theme) => {
    return `\n[${theme}]: https://youtube-stats-card.vercel.app/api?channelid=UCpKizIKSk8ga_LCI3e3GUig&cache_seconds=86400&theme=${theme}`;
};

const generateLinks = (fn) => {
    return Object.keys(theme)
        .map((name) => fn(name))
        .join("");
};

const createTableItem = ({ link, label }) => {
    if (!link || !label) return "";
    return `\`${label}\` ![${link}][${link}]`;
};
const generateTable = () => {
    const rows = [];
    const themes = Object.keys(theme);

    for (let i = 0; i < themes.length; i += 3) {
        const one = themes[i];
        const two = themes[i + 1];
        const three = themes[i + 2];

        let tableItem1 = createTableItem({ link: one, label: one });
        let tableItem2 = createTableItem({ link: two, label: two });
        let tableItem3 = createTableItem({ link: three, label: three });

        if (three === undefined) {
            tableItem3 = `[Add your theme][add-theme]`;
        }
        rows.push(`| ${tableItem1} | ${tableItem2} | ${tableItem3} |`);

        // if it's the last row & the row has no empty space push a new row
        if (three && i + 3 === themes.length) {
            rows.push(`| [Add your theme][add-theme] | | |`);
        }
    }
    return rows.join("\n");
};

const buildReadme = () => {
    return THEME_TEMPLATE.split("\n")
        .map((line) => {
            if (line.includes(CHANNEL_CARD_LINKS_FLAG)) {
                return generateLinks(createChannelLink);
            }
            if (line.includes(CHANNEL_CARD_TABLE_FLAG)) {
                return generateTable();
            }
            return line;
        })
        .join("\n");
};

fs.writeFileSync(TARGET_FILE, buildReadme());
