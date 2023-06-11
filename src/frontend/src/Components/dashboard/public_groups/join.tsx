import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

function Join({Group, open_Model}: {Group: any, open_Model: boolean}) {
    const [opened, { open, close }] = useDisclosure(open_Model);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Authentication" centered>
                {/* Modal content */}
            </Modal>

            <Group position="center">
                <Button onClick={open}>Open centered Modal</Button>
            </Group>
        </>
    );
}

export default Join;