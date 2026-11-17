import { axiosClient } from "./client";

export const getGames = async (params) => {
    const res = await axiosClient.get("/games", {params});
    return res.data;
};