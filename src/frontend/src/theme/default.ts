import { MantineThemeOverride } from "@mantine/core";
import { Russo_One, Kanit } from "next/font/google";

const fontHeadings = Russo_One({ weight: "400", subsets: ["latin"] });
const font = Kanit({ weight: "400", subsets: ["latin"] });

export const default_theme: MantineThemeOverride = {
    colorScheme: "dark",
    primaryColor: "purple",
    // change background color
    colors: {
        purple: ["#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA", "#5951BA"],
        cos_black: ["#292932", "#242428", "#15151A", "#121214"],
    },
    fontFamily: font.style.fontFamily,
    // add font to theme
    fontFamilyMonospace: font.style.fontFamily,
    headings: {
        fontFamily: fontHeadings.style.fontFamily,
    },
    components: {
        SegmentedControl: {
            styles: {
                root: {
                    borderRadius: 40,
                    background: "#000000",
                },
                indicator: {
                    borderRadius: 40,
                },
            },
        },
        Input: {
            styles: {
                input: {
                    borderRadius: 40,
                },
            },
        },
        Button: {
            styles: {
                root: {
                    borderRadius: 40,
                },
            },
        },
        Paper: {
            styles: {
                root: {},
            },
        },
        Popover: {
            styles: {
                body: {
                    borderRadius: 40,
                },
            },
        },
        Select: {
            styles: {
                root: {
                    borderRadius: 40,
                },
            },
        },
    },
};
