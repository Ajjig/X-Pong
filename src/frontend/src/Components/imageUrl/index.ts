import api from "@/api";

export function imageUrl(url: string) {
    // check if url is a absolute url or a relative url
    return url.startsWith("http") ? url : `${api.getUri()}${url}`;
}
