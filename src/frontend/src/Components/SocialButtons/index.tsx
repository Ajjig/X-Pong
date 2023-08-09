import { Button, ButtonProps } from "@mantine/core";
import { Network42Icon } from "./Network42Icon";

export function Network42Button(props: ButtonProps) {
    return (
        <Button
            leftIcon={<Network42Icon />}
            variant="default"
            sx={{
                backgroundColor: "#FFFFFF",
                color: "#000000",
            }}
            {...props}
        />
    );
}
