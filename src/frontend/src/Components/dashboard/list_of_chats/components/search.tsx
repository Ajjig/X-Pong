import { Button, Group } from "@mantine/core";
import { SpotlightProvider, spotlight } from "@mantine/spotlight";
import type { SpotlightAction } from "@mantine/spotlight";
import { IconHome, IconDashboard, IconFileText, IconSearch } from "@tabler/icons-react";

function SpotlightControl() {
    return (
        <Group position="center" bg={"red"}>
            <Button onClick={spotlight.open}>Open spotlight</Button>
        </Group>
    );
}

const actions: SpotlightAction[] = [
    {
        title: "Home",
        description: "Get to home page",
        onTrigger: () => console.log("Home"),
        icon: <IconHome size="1.2rem" />,
    },
    {
        title: "Dashboard",
        description: "Get full information about current system status",
        onTrigger: () => console.log("Dashboard"),
        icon: <IconDashboard size="1.2rem" />,
    },
    {
        title: "Documentation",
        description: "Visit documentation to lean more about all features",
        onTrigger: () => console.log("Documentation"),
        icon: <IconFileText size="1.2rem" />,
    },
];

export default function Search({ children }: any) {
    return (
        <SpotlightProvider
            actions={actions}
            searchIcon={<IconSearch size="1.2rem" />}
            searchPlaceholder="Search..."
            shortcut="mod + shift + 1"
            nothingFoundMessage="No users found"
            zIndex={1000}
        >
            {/* {children} */}
            <SpotlightControl />
        </SpotlightProvider>
    );
}
