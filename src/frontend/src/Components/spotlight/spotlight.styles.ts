import { MantineTheme, createStyles } from "@mantine/core";

export const SpotlightStyles = createStyles((theme: MantineTheme) => ({
    content: {
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
    },
    body: {
        padding: "15px 15px 15px 15px",
        background: theme.colors.dark[9],
    },
    action: {
        margin: "10px 0px",
        ["&:hover"]: { 
            background: theme.colors.dark[7],
            
        }
    },
    searchInput: {
        background: "transparent",
        borderBottom: "0 !important",
    },
   
}));
