import api from "@/api";

function check_token() {
    api.get("/user/profile")
        .then((res) => {
            if (res.status === 200) {
                return true;
            } else {
                return false;
            }
        })
        .catch((err) => {
            return false;
        });
}
